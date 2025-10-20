import type { ActivityMeta, Match, OcWork } from '../types'

interface PkListTableProps {
  matches: Match[]
  worksMap: Record<string, OcWork>
  onSelect: (pkNumber: string) => void
  meta: ActivityMeta
}

function PkListTable({ matches, worksMap, onSelect, meta }: PkListTableProps) {
  const progressRatio = meta.totalGroups > 0 ? meta.completedGroups / meta.totalGroups : 0
  const clampedRatio = Math.max(0, Math.min(progressRatio, 1))
  const progressPercent = Math.round(clampedRatio * 100)

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
    </section>
  )
}

export default PkListTable
