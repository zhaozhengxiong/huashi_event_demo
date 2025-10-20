import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import type { ActivityMeta, Match, OcWork } from '../types'

interface PkListTableProps {
  matches: Match[]
  worksMap: Record<string, OcWork>
  onSelect: (pkNumber: string) => void
  meta: ActivityMeta
}

const BRACKET_ROUND_ORDER = ['8 进 4', '4 进 2', '冠军战']

const BRACKET_CARD_HEIGHT = 160
const BRACKET_CARD_GAP = 16
const BRACKET_STEP = BRACKET_CARD_HEIGHT + BRACKET_CARD_GAP
const CHAMPION_HEADER_OFFSET = 60

type RoundStyle = CSSProperties & { '--round-gap'?: string; '--round-offset'?: string }

const normalizeRoundLabel = (label: string) => label.replace(/\s+/g, '')

const isBracketRound = (round: string) =>
  BRACKET_ROUND_ORDER.some((label) => normalizeRoundLabel(label) === normalizeRoundLabel(round))

const computeRoundOffset = (depth: number) => {
  if (depth <= 0) {
    return 0
  }
  return (Math.pow(2, depth - 1) - 0.5) * BRACKET_STEP
}

const computeRoundGap = (depth: number) => {
  if (depth <= 0) {
    return BRACKET_CARD_GAP
  }
  return Math.pow(2, depth) * BRACKET_STEP - BRACKET_CARD_HEIGHT
}

const buildRoundStyle = (depth: number): RoundStyle => ({
  '--round-gap': `${computeRoundGap(depth)}px`,
  '--round-offset': `${computeRoundOffset(depth)}px`
})

function PkListTable({ matches, worksMap, onSelect, meta }: PkListTableProps) {
  const progressRatio = meta.totalGroups > 0 ? meta.completedGroups / meta.totalGroups : 0
  const clampedRatio = Math.max(0, Math.min(progressRatio, 1))
  const progressPercent = Math.round(clampedRatio * 100)

  const bracketRounds = useMemo(() => {
    const grouped = BRACKET_ROUND_ORDER.map((round) => ({
      round,
      matches: matches.filter((match) => normalizeRoundLabel(match.round) === normalizeRoundLabel(round))
    }))
    return grouped.filter((group) => group.matches.length > 0)
  }, [matches])

  const finalMatch = useMemo(() => {
    for (const round of BRACKET_ROUND_ORDER.slice().reverse()) {
      const match = matches.find((item) => normalizeRoundLabel(item.round) === normalizeRoundLabel(round))
      if (match) {
        return match
      }
    }
    return undefined
  }, [matches])

  const showBracket = useMemo(() => {
    if (isBracketRound(meta.currentRound)) {
      return true
    }
    return matches.some((match) => isBracketRound(match.round))
  }, [matches, meta.currentRound])

  const renderBracket = () => {
    const championWorkId = finalMatch
      ? finalMatch.left.votes >= finalMatch.right.votes
        ? finalMatch.left.workId
        : finalMatch.right.workId
      : undefined
    const championWork = championWorkId ? worksMap[championWorkId] : undefined

    const finalRoundDepth = bracketRounds.length - 1
    const championOffset = finalRoundDepth >= 0 ? Math.max(computeRoundOffset(finalRoundDepth) - CHAMPION_HEADER_OFFSET, 0) : 0
    const championStyle: RoundStyle | undefined =
      finalRoundDepth >= 0 ? { '--round-offset': `${championOffset}px` } : undefined

    return (
      <div className='pk-bracket-wrapper'>
        <div className='pk-bracket'>
          {bracketRounds.map((round, index) => {
            const roundStyle = buildRoundStyle(index)
            return (
              <div key={round.round} className='pk-bracket-round' data-depth={index} style={roundStyle}>
                <header>
                  <h3>{round.round}</h3>
                  <span>{round.matches.length} 组对决</span>
                </header>
                <div className='pk-bracket-list'>
                  {round.matches.map((match) => {
                    const left = worksMap[match.left.workId]
                    const right = worksMap[match.right.workId]
                    const totalVotes = match.left.votes + match.right.votes
                    const leftPercent = totalVotes > 0 ? (match.left.votes / totalVotes) * 100 : 50
                    const rightPercent = 100 - leftPercent
                    const winner = match.left.votes === match.right.votes
                      ? undefined
                      : match.left.votes > match.right.votes
                        ? 'left'
                        : 'right'

                    return (
                      <article
                        key={match.pkNumber}
                        className={`pk-bracket-match${winner ? ` is-winner-${winner}` : ''}`}
                        role='button'
                        tabIndex={0}
                        onClick={() => onSelect(match.pkNumber)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            onSelect(match.pkNumber)
                          }
                        }}
                      >
                        <div className='pk-bracket-meta'>
                          <span className='pk-number'>{match.pkNumber}</span>
                          <span className={`pk-status pk-status-${match.status}`}>
                            {match.status === 'open' ? '进行中' : '已结束'}
                          </span>
                        </div>
                        <div className='pk-bracket-side'>
                          <div className='pk-bracket-work'>
                            <strong>{left?.title ?? '待补充'}</strong>
                            <span>{left?.creator ?? '未知'}</span>
                          </div>
                          <div className='pk-bracket-score'>
                            <span>{match.left.votes}</span>
                            <span>{Math.round(leftPercent)}%</span>
                          </div>
                        </div>
                        <div className='pk-bracket-divider'>VS</div>
                        <div className='pk-bracket-side'>
                          <div className='pk-bracket-work'>
                            <strong>{right?.title ?? '待补充'}</strong>
                            <span>{right?.creator ?? '未知'}</span>
                          </div>
                          <div className='pk-bracket-score'>
                            <span>{match.right.votes}</span>
                            <span>{Math.round(rightPercent)}%</span>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            )
          })}
          <div className='pk-bracket-final' style={championStyle}>
            <header>
              <h3>冠军</h3>
              <span>WIN</span>
            </header>
            {finalMatch && championWork ? (
              <div className='pk-champion-card'>
                <strong>{championWork.title}</strong>
                <span>作者：{championWork.creator}</span>
                <small>总票数 {Math.max(finalMatch.left.votes, finalMatch.right.votes)}</small>
              </div>
            ) : (
              <div className='pk-champion-card is-empty'>等待揭晓</div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className='pk-list'>
      <header>
        <h2>当前轮次 PK 列表</h2>
        <p>快速浏览所有对阵，选择感兴趣的 PK 进入投票。</p>
      </header>
      <div className='pk-meta'>
        <div className='pk-meta-item'>
          <span className='pk-meta-label'>当前轮次</span>
          <strong className='pk-meta-value'>{meta.currentRound}</strong>
        </div>
        <div className='pk-meta-item pk-meta-progress'>
          <div className='pk-meta-progress-header'>
            <span className='pk-meta-label'>进度</span>
            <span className='pk-meta-value'>
              {meta.completedGroups}/{meta.totalGroups}
            </span>
          </div>
          <div
            className='pk-progress-track'
            role='progressbar'
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
            aria-valuetext={`${meta.completedGroups}/${meta.totalGroups}`}
          >
            <div className='pk-progress-fill' style={{ width: `${progressPercent}%` }} />
          </div>
          <span className='pk-progress-percent'>{progressPercent}%</span>
        </div>
        <div className='pk-meta-item'>
          <span className='pk-meta-label'>剩余时间</span>
          <strong className='pk-meta-value'>{meta.remainingTimeLabel}</strong>
        </div>
      </div>
      {showBracket ? (
        renderBracket()
      ) : (
        <div className='pk-table-wrapper'>
          <table className='pk-table'>
            <thead>
              <tr>
                <th>PK 号</th>
                <th>左侧作品</th>
                <th>右侧作品</th>
                <th>投票进度</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => {
                const left = worksMap[match.left.workId]
                const right = worksMap[match.right.workId]
                const totalVotes = match.left.votes + match.right.votes
                const leftPercent = totalVotes > 0 ? (match.left.votes / totalVotes) * 100 : 50
                const rightPercent = 100 - leftPercent
                return (
                  <tr
                    key={match.pkNumber}
                    role='button'
                    tabIndex={0}
                    onClick={() => onSelect(match.pkNumber)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onSelect(match.pkNumber)
                      }
                    }}
                  >
                    <td>{match.pkNumber}</td>
                    <td>
                      <div className='pk-cell'>
                        <img src={left?.coverImages[0]} alt={left?.title ?? '作品'} />
                        <div>
                          <strong>{left?.title ?? '待补充'}</strong>
                          <span>作者：{left?.creator ?? '未知'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className='pk-cell'>
                        <img src={right?.coverImages[0]} alt={right?.title ?? '作品'} />
                        <div>
                          <strong>{right?.title ?? '待补充'}</strong>
                          <span>作者：{right?.creator ?? '未知'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className='pk-vote-progress'>
                        <div
                          className='pk-vote-track'
                          role='group'
                          aria-label={`${left?.title ?? '左侧作品'}与${right?.title ?? '右侧作品'}的投票进度`}
                        >
                          <div
                            className='pk-vote-segment pk-vote-segment-left'
                            style={{ width: `${leftPercent}%` }}
                          >
                            <span>{match.left.votes}票</span>
                          </div>
                          <div
                            className='pk-vote-segment pk-vote-segment-right'
                            style={{ width: `${rightPercent}%` }}
                          >
                            <span>{match.right.votes}票</span>
                          </div>
                        </div>
                        <div className='pk-vote-summary'>
                          <span className='pk-vote-count pk-vote-count-left'>左侧：{match.left.votes}票</span>
                          <span className='pk-vote-count pk-vote-count-right'>右侧：{match.right.votes}票</span>
                        </div>
                        <div className='pk-vote-extra'>
                          <span>总票数：{totalVotes}</span>
                          <span>
                            {Math.round(leftPercent)}% : {Math.round(rightPercent)}%
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default PkListTable
