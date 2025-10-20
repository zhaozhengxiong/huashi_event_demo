import type { Match, OcWork } from '../types'

interface PkListTableProps {
  matches: Match[]
  worksMap: Record<string, OcWork>
  onSelect: (pkNumber: string) => void
}

function PkListTable({ matches, worksMap, onSelect }: PkListTableProps) {
  return (
    <section className='pk-list'>
      <header>
        <h2>当前轮次 PK 列表</h2>
        <p>快速浏览所有对阵，选择感兴趣的 PK 进入投票。</p>
      </header>
      <div className='pk-table-wrapper'>
        <table className='pk-table'>
          <thead>
            <tr>
              <th>PK 号</th>
              <th>左侧作品</th>
              <th>右侧作品</th>
              <th>截止时间</th>
              <th>当前票数</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => {
              const left = worksMap[match.left.workId]
              const right = worksMap[match.right.workId]
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
                  <td>{new Date(match.deadline).toLocaleString('zh-CN', { hour12: false })}</td>
                  <td>
                    <div className='vote-meter'>
                      <span>{match.left.votes}</span>
                      <span>:</span>
                      <span>{match.right.votes}</span>
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


