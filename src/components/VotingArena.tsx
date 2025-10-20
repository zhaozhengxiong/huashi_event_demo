import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ActivityMeta, Match, OcWork } from '../types'
import WorkGallery from './WorkGallery'

type VoteResult = 'left' | 'right' | 'skip'

interface VotingArenaProps {
  matches: Match[]
  worksMap: Record<string, OcWork>
  meta: ActivityMeta
  activePk?: string
  onActivePkChange?: (pkNumber: string) => void
}

function VotingArena({ matches, worksMap, meta, activePk, onActivePkChange }: VotingArenaProps) {
  const [internalPk, setInternalPk] = useState(matches[0]?.pkNumber ?? '')
  const [voteHistory, setVoteHistory] = useState<Record<string, VoteResult>>({})
  const [pkInput, setPkInput] = useState('')

  const currentPk = activePk ?? internalPk

  const setPk = useCallback(
    (pkNumber: string) => {
      if (onActivePkChange) {
        onActivePkChange(pkNumber)
      }
      if (activePk === undefined) {
        setInternalPk(pkNumber)
      }
      setPkInput('')
    },
    [onActivePkChange, activePk]
  )

  useEffect(() => {
    if (!matches.length) {
      return
    }
    const hasCurrent = matches.some((match) => match.pkNumber === currentPk)
    if (!hasCurrent) {
      setPk(matches[0].pkNumber)
    }
  }, [matches, currentPk, setPk])

  const currentMatch = useMemo(
    () => matches.find((match) => match.pkNumber === currentPk) ?? matches[0],
    [currentPk, matches]
  )

  const completedCount = useMemo(
    () =>
      matches.filter((match) => match.status === 'closed' || voteHistory[match.pkNumber])
        .length,
    [matches, voteHistory]
  )

  const handleVote = (result: VoteResult) => {
    if (!currentMatch || currentMatch.status === 'closed') {
      return
    }
    setVoteHistory((prev) => ({ ...prev, [currentMatch.pkNumber]: result }))
    const currentIndex = matches.findIndex((match) => match.pkNumber === currentMatch.pkNumber)
    const remaining = matches.slice(currentIndex + 1).find((match) => match.status === 'open')
    if (remaining) {
      setPk(remaining.pkNumber)
    }
  }

  const handlePkSearch = () => {
    if (!pkInput.trim()) {
      return
    }
    const target = matches.find((match) => match.pkNumber.toLowerCase() === pkInput.trim().toLowerCase())
    if (target) {
      setPk(target.pkNumber)
    }
  }

  if (!currentMatch) {
    return <div className='empty-state'>暂无对阵，请稍后再来。</div>
  }

  const leftWork = worksMap[currentMatch.left.workId]
  const rightWork = worksMap[currentMatch.right.workId]
  const deadlineLabel = new Date(currentMatch.deadline).toLocaleString('zh-CN', {
    hour12: false
  })

  const currentVote = voteHistory[currentMatch.pkNumber]

  return (
    <section className='voting-arena'>
      <header className='arena-header'>
        <div>
          <small>轮次</small>
          <strong>{currentMatch.round}</strong>
        </div>
        <div>
          <small>PK 号码</small>
          <strong>{currentMatch.pkNumber}</strong>
        </div>
        <div>
          <small>本组截止</small>
          <strong>{deadlineLabel}</strong>
        </div>
        <div>
          <small>整体进度</small>
          <strong>
            {completedCount} / {matches.length}
          </strong>
        </div>
        <div>
          <small>剩余时间</small>
          <strong>{meta.remainingTimeLabel}</strong>
        </div>
      </header>
      <div className='pk-search'>
        <input
          type='text'
          placeholder='输入 PK 号码直达'
          value={pkInput}
          onChange={(event) => setPkInput(event.target.value)}
        />
        <button type='button' onClick={handlePkSearch}>
          前往
        </button>
      </div>
      <div className='arena-body'>
        <article className={`arena-card${currentVote === 'left' ? ' is-picked' : ''}`}>
          <header>
            <h3>{leftWork?.title ?? '待补充'}</h3>
            <span className='creator'>作者：{leftWork?.creator ?? '未知'}</span>
          </header>
          <WorkGallery title={leftWork?.title ?? '作品'} images={leftWork?.coverImages ?? []} />
          <footer>
            <div className='score'>
              得票：{currentMatch.left.votes}
              <span>（评分 {currentMatch.left.score}）</span>
            </div>
            <p>{leftWork?.highlight}</p>
          </footer>
          <button type='button' className='ghost-button'>查看作品详情</button>
        </article>
        <div className='arena-divider'>VS</div>
        <article className={`arena-card${currentVote === 'right' ? ' is-picked' : ''}`}>
          <header>
            <h3>{rightWork?.title ?? '待补充'}</h3>
            <span className='creator'>作者：{rightWork?.creator ?? '未知'}</span>
          </header>
          <WorkGallery title={rightWork?.title ?? '作品'} images={rightWork?.coverImages ?? []} />
          <footer>
            <div className='score'>
              得票：{currentMatch.right.votes}
              <span>（评分 {currentMatch.right.score}）</span>
            </div>
            <p>{rightWork?.highlight}</p>
          </footer>
          <button type='button' className='ghost-button'>查看作品详情</button>
        </article>
      </div>
      <div className='arena-actions'>
        <button type='button' onClick={() => handleVote('left')}>
          投左
        </button>
        <button type='button' className='ghost-button' onClick={() => handleVote('skip')}>
          弃权
        </button>
        <button type='button' onClick={() => handleVote('right')}>
          投右
        </button>
      </div>
      {completedCount === matches.length && (
        <div className='arena-footer'>
          🎉 恭喜完成当轮所有对阵，抽奖入口已点亮。
        </div>
      )}
    </section>
  )
}

export default VotingArena
