import type { LeaderboardEntry, OcWork, Stage } from '../types'

interface LeaderboardWallProps {
  entries: LeaderboardEntry[]
  worksMap: Record<string, OcWork>
  stage: Stage
}

function LeaderboardWall({ entries, worksMap, stage }: LeaderboardWallProps) {
  const topEntries = [...entries].sort((a, b) => a.rank - b.rank).slice(0, 8)
  const podium = topEntries.filter((entry) => entry.rank <= 3)
  const others = topEntries.filter((entry) => entry.rank > 3)

  const getCardClassName = (entry: LeaderboardEntry) => {
    if (entry.rank === 1) {
      return 'leader-card leader-card--podium leader-card--first'
    }
    if (entry.rank === 2) {
      return 'leader-card leader-card--podium leader-card--second'
    }
    if (entry.rank === 3) {
      return 'leader-card leader-card--podium leader-card--third'
    }
    return 'leader-card'
  }

  const renderCard = (entry: LeaderboardEntry) => {
    const work = worksMap[entry.workId]
    return (
      <article key={entry.workId} className={getCardClassName(entry)}>
        <div className='leader-rank'>
          <span className='leader-rank-number'>#{entry.rank}</span>
          {entry.rank <= 3 && (
            <span className='leader-rank-medal'>{entry.award ?? 'TOP3'}</span>
          )}
        </div>
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
        {stage === 'announcement' ? (
          <p>公示期榜单展示中，敬请关注颁奖信息。</p>
        ) : (
          <>
            <p>获奖作品支持一键生成证书海报，分享荣耀时刻。</p>
            <button type='button' className='ghost-button'>生成获奖证书</button>
          </>
        )}
      </header>
      <div className='leader-podium'>{podium.map(renderCard)}</div>
      {others.length > 0 && <div className='leader-grid'>{others.map(renderCard)}</div>}
    </section>
  )
}

export default LeaderboardWall
