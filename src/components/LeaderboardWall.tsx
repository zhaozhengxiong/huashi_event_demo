import type { LeaderboardEntry, OcWork } from '../types'

interface LeaderboardWallProps {
  entries: LeaderboardEntry[]
  worksMap: Record<string, OcWork>
}

function LeaderboardWall({ entries, worksMap }: LeaderboardWallProps) {
  const podium = entries.filter((entry) => entry.rank <= 3)
  const others = entries.filter((entry) => entry.rank > 3)

  const renderCard = (entry: LeaderboardEntry) => {
    const work = worksMap[entry.workId]
    return (
      <article key={entry.workId} className='leader-card'>
        <div className='leader-rank'>#{entry.rank}</div>
        <img src={work?.coverImages[0]} alt={work?.title ?? '作品'} />
        <h3>{work?.title ?? '未知作品'}</h3>
        <p>创作者：{work?.creator ?? '—'}</p>
        {entry.award && <span className='leader-award'>{entry.award}</span>}
      </article>
    )
  }

  return (
    <section className='leaderboard'>
      <header>
        <h2>最终榜单</h2>
        <p>获奖作品支持一键生成证书海报，分享荣耀时刻。</p>
        <button type='button' className='ghost-button'>生成获奖证书</button>
      </header>
      <div className='leader-podium'>{podium.map(renderCard)}</div>
      {others.length > 0 && (
        <div className='leader-grid'>{others.map(renderCard)}</div>
      )}
    </section>
  )
}

export default LeaderboardWall


