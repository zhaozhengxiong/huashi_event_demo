import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ActivityMeta, Match, OcWork } from '../types'
import WorkGallery from './WorkGallery'
import PkNumberSearch from './PkNumberSearch'

type VoteTarget = 'left' | 'right'

interface MatchVotes {
  left: number
  right: number
  lastPick?: VoteTarget
}

interface VotingArenaProps {
  matches: Match[]
  worksMap: Record<string, OcWork>
  meta: ActivityMeta
  activePk?: string
  onActivePkChange?: (pkNumber: string) => void
}

function VotingArena({ matches, worksMap, meta, activePk, onActivePkChange }: VotingArenaProps) {
  const [internalPk, setInternalPk] = useState(matches[0]?.pkNumber ?? '')
  const [matchVotes, setMatchVotes] = useState<Record<string, MatchVotes>>({})
  const currentPk = activePk ?? internalPk

  const setPk = useCallback(
    (pkNumber: string) => {
      if (onActivePkChange) {
        onActivePkChange(pkNumber)
      }
      if (activePk === undefined) {
        setInternalPk(pkNumber)
      }
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
      matches.filter((match) => {
        if (match.status === 'closed') {
          return true
        }
        const record = matchVotes[match.pkNumber]
        if (!record) {
          return false
        }
        return record.left + record.right > 0
      }).length,
    [matches, matchVotes]
  )

  const votesPerDraw = 10

  const votesCast = useMemo(
    () =>
      Object.values(matchVotes).reduce((total, record) => total + record.left + record.right, 0),
    [matchVotes]
  )

  const drawsEarned = Math.floor(votesCast / votesPerDraw)
  const votesTowardsNext = votesCast % votesPerDraw
  const completedSegment = drawsEarned && votesTowardsNext === 0 ? votesPerDraw : votesTowardsNext
  const lotteryProgressLabel = drawsEarned
    ? `完成投票 ${completedSegment}/${votesPerDraw}，获得抽奖机会 +${drawsEarned}`
    : `完成投票 ${votesCast}/${votesPerDraw}，还差${votesPerDraw - votesCast}票可获得1次抽奖机会`

  const handleVote = (target: VoteTarget) => {
    if (!currentMatch || currentMatch.status === 'closed') {
      return
    }
    setMatchVotes((prev) => {
      const existing = prev[currentMatch.pkNumber] ?? { left: 0, right: 0 }
      const updated: MatchVotes = {
        left: existing.left + (target === 'left' ? 1 : 0),
        right: existing.right + (target === 'right' ? 1 : 0),
        lastPick: target
      }
      return { ...prev, [currentMatch.pkNumber]: updated }
    })
  }

  const handlePkSearch = useCallback(
    (pkNumber: string) => {
      setPk(pkNumber)
    },
    [setPk]
  )

  const handleShuffleMatch = useCallback(() => {
    const available = matches.filter(
      (match) => match.status === 'open' && match.pkNumber !== currentPk
    )
    if (!available.length) {
      return
    }
    const randomIndex = Math.floor(Math.random() * available.length)
    setPk(available[randomIndex].pkNumber)
  }, [matches, currentPk, setPk])

  if (!currentMatch) {
    return <div className='empty-state'>暂无对阵，请稍后再来。</div>
  }

  const leftWork = worksMap[currentMatch.left.workId]
  const rightWork = worksMap[currentMatch.right.workId]
  const deadlineLabel = new Date(currentMatch.deadline).toLocaleString('zh-CN', {
    hour12: false
  })

  const currentMatchVotes = matchVotes[currentMatch.pkNumber]
  const leftVotes = currentMatch.left.votes + (currentMatchVotes?.left ?? 0)
  const rightVotes = currentMatch.right.votes + (currentMatchVotes?.right ?? 0)
  const totalVotesForCurrent = (currentMatchVotes?.left ?? 0) + (currentMatchVotes?.right ?? 0)
  const combinedVotes = leftVotes + rightVotes
  const showNeutralProgress = combinedVotes === 0
  const leftVoteRatio = showNeutralProgress ? 0.5 : leftVotes / combinedVotes
  const rightVoteRatio = showNeutralProgress ? 0.5 : rightVotes / combinedVotes
  const leftVotePercent = showNeutralProgress ? 0 : Math.round(leftVoteRatio * 100)
  const rightVotePercent = showNeutralProgress ? 0 : Math.round(rightVoteRatio * 100)
  const progressAriaMax = combinedVotes === 0 ? 1 : combinedVotes
  const voteLeadDiff = Math.abs(leftVotes - rightVotes)
  const voteLeadLabel =
    voteLeadDiff === 0
      ? '当前双方票数持平'
      : leftVotes > rightVotes
        ? `${leftWork?.title ?? '左侧作品'}领先 ${voteLeadDiff} 票`
        : `${rightWork?.title ?? '右侧作品'}领先 ${voteLeadDiff} 票`
  const paidVotesForCurrent = totalVotesForCurrent > 1 ? totalVotesForCurrent - 1 : 0
  const voteRuleLabel = totalVotesForCurrent
    ? paidVotesForCurrent
      ? `本组已投 ${totalVotesForCurrent} 票，其中 ${paidVotesForCurrent} 票需消耗积分。`
      : '已使用免费票，继续投票将消耗积分。'
    : '本组第一票免费，继续投票将消耗积分。'
  const lastPick = currentMatchVotes?.lastPick

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
      <PkNumberSearch matches={matches} onNavigate={handlePkSearch} />
      <div className='arena-body'>
        <article className={`arena-card${lastPick === 'left' ? ' is-picked' : ''}`}>
          <header>
            <h3>{leftWork?.title ?? '待补充'}</h3>
            <span className='creator'>作者：{leftWork?.creator ?? '未知'}</span>
          </header>
          <WorkGallery title={leftWork?.title ?? '作品'} images={leftWork?.coverImages ?? []} />
          <footer>
            <div className='score'>
              得票：{leftVotes}
              <span>
                （评分 {currentMatch.left.score}
                {combinedVotes > 0 ? `，占比 ${leftVotePercent}%` : ''}）
              </span>
            </div>
            <p>{leftWork?.highlight}</p>
          </footer>
          <button type='button' className='ghost-button'>查看作品详情</button>
        </article>
        <div className='arena-divider'>VS</div>
        <article className={`arena-card${lastPick === 'right' ? ' is-picked' : ''}`}>
          <header>
            <h3>{rightWork?.title ?? '待补充'}</h3>
            <span className='creator'>作者：{rightWork?.creator ?? '未知'}</span>
          </header>
          <WorkGallery title={rightWork?.title ?? '作品'} images={rightWork?.coverImages ?? []} />
          <footer>
            <div className='score'>
              得票：{rightVotes}
              <span>
                （评分 {currentMatch.right.score}
                {combinedVotes > 0 ? `，占比 ${rightVotePercent}%` : ''}）
              </span>
            </div>
            <p>{rightWork?.highlight}</p>
          </footer>
          <button type='button' className='ghost-button'>查看作品详情</button>
        </article>
      </div>
      <div className='arena-vote-progress'>
        <div className='arena-vote-progress-header'>
          <span>实时投票情况</span>
          <span>总票数：{combinedVotes}</span>
        </div>
        <div
          className='arena-vote-track'
          role='group'
          aria-label={`${leftWork?.title ?? '左侧作品'}与${rightWork?.title ?? '右侧作品'}的实时投票进度`}
        >
          <div
            className='arena-vote-segment arena-vote-segment-left'
            style={{ width: `${leftVoteRatio * 100}%` }}
            role='progressbar'
            aria-valuemin={0}
            aria-valuemax={progressAriaMax}
            aria-valuenow={leftVotes}
            aria-label={`${leftWork?.title ?? '左侧作品'}累计 ${leftVotes} 票`}
          >
            <span>{leftVotes}票</span>
          </div>
          <div
            className='arena-vote-segment arena-vote-segment-right'
            style={{ width: `${rightVoteRatio * 100}%` }}
            role='progressbar'
            aria-valuemin={0}
            aria-valuemax={progressAriaMax}
            aria-valuenow={rightVotes}
            aria-label={`${rightWork?.title ?? '右侧作品'}累计 ${rightVotes} 票`}
          >
            <span>{rightVotes}票</span>
          </div>
        </div>
        <div className='arena-vote-summary'>
          <span className='arena-vote-count arena-vote-count-left'>左侧：{leftVotes}票</span>
          <span className='arena-vote-count arena-vote-count-right'>右侧：{rightVotes}票</span>
        </div>
        <div className='arena-vote-extra'>
          <span>{voteLeadLabel}</span>
          <span>
            {showNeutralProgress
              ? '暂无投票'
              : `${leftVotePercent}% : ${rightVotePercent}%`}
          </span>
        </div>
      </div>
      <div className='arena-actions'>
        <button type='button' onClick={() => handleVote('left')}>
          投左
        </button>
        <button type='button' onClick={handleShuffleMatch} className='ghost-button'>
          换一组
        </button>
        <button type='button' onClick={() => handleVote('right')}>
          投右
        </button>
      </div>
      <div className='arena-footer'>
        <span>{voteRuleLabel}</span>
        <span>{lotteryProgressLabel}</span>
      </div>
    </section>
  )
}

export default VotingArena
