import type { ActivityMeta, ActivityView, LeaderboardEntry, OcWork, RegistrationConfig, Stage } from '../types'

interface ActivityHomeProps {
  stage: Stage
  registration: RegistrationConfig
  meta: ActivityMeta
  leaderboard: LeaderboardEntry[]
  worksMap: Record<string, OcWork>
  onNavigate: (view: ActivityView) => void
  onOpenRegistration: () => void
}

const STAGE_HEADLINE: Record<Stage, string> = {
  registration: '首届画时 OC 大赛火热报名中',
  evaluation: 'PK 赛火热进行，快去为心仪的 OC 助阵',
  announcement: '最终榜单揭晓，恭喜获奖的创作者们'
}

function ActivityHome({
  stage,
  registration,
  meta,
  leaderboard,
  worksMap,
  onNavigate,
  onOpenRegistration
}: ActivityHomeProps) {
  const renderRegistration = () => (
    <div className='home-panel'>
      <div className='home-section'>
        <h3>活动亮点</h3>
        <ul>
          {registration.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>
      <div className='home-section'>
        <h3>奖品池</h3>
        <ul>
          {registration.rewards.map((reward) => (
            <li key={reward}>{reward}</li>
          ))}
        </ul>
      </div>
      <div className='home-cta'>
        <div>
          <span className='home-stat'>{registration.enrollmentCount}</span>
          <span> 人已报名</span>
        </div>
        <button type='button' onClick={onOpenRegistration}>
          立即报名
        </button>
      </div>
    </div>
  )

  const renderEvaluation = () => (
    <div className='home-panel'>
      <div className='home-section meta'>
        <div>
          <small>当前轮次</small>
          <strong>{meta.currentRound}</strong>
        </div>
        <div>
          <small>进度</small>
          <strong>
            {meta.completedGroups} / {meta.totalGroups}
          </strong>
        </div>
        <div>
          <small>剩余时间</small>
          <strong>{meta.remainingTimeLabel}</strong>
        </div>
      </div>
      <p>完成当前轮全部 PK 可解锁抽奖机会，快去投票助阵吧。</p>
      <div className='home-cta cta-dual'>
        <button type='button' onClick={() => onNavigate('vote')}>
          进入 PK 对阵
        </button>
        <button type='button' onClick={() => onNavigate('lottery')}>
          抽奖中心
        </button>
      </div>
    </div>
  )

  const renderAnnouncement = () => (
    <div className='home-panel'>
      <div className='home-section'>
        <h3>最终榜单</h3>
        <ul className='winner-list'>
          {leaderboard.slice(0, 4).map((entry) => {
            const work = worksMap[entry.workId]
            return (
              <li key={entry.workId}>
                <div className='winner-rank'>#{entry.rank}</div>
                <div>
                  <div className='winner-title'>
                    {work?.title ?? '未知作品'}
                    {entry.award && <span className='winner-tag'>{entry.award}</span>}
                  </div>
                  <div className='winner-meta'>作者：{work?.creator ?? '—'}</div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <div className='home-cta cta-dual'>
        <button type='button' onClick={() => onNavigate('myEntries')}>
          查看我的 PK 轨迹
        </button>
        <button type='button' onClick={() => onNavigate('lottery')}>
          查看抽奖记录
        </button>
      </div>
    </div>
  )

  return (
    <section className='activity-home'>
      <header>
        <h2>{STAGE_HEADLINE[stage]}</h2>
        {stage !== 'registration' && (
          <p className='home-subtitle'>
            支持 PK 号码直达、淘汰裁决可回放，公平透明随时回看。
          </p>
        )}
      </header>
      {stage === 'registration' && renderRegistration()}
      {stage === 'evaluation' && renderEvaluation()}
      {stage === 'announcement' && renderAnnouncement()}
    </section>
  )
}

export default ActivityHome


