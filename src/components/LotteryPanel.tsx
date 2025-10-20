import type { LotteryConfig } from '../types'

interface LotteryPanelProps {
  config: LotteryConfig
}

function LotteryPanel({ config }: LotteryPanelProps) {
  return (
    <section className='lottery'>
      <header>
        <h2>抽奖中心</h2>
        <p>完成当轮全部对阵即可抽奖，每日次数上限为 3 次。</p>
      </header>
      <div className='lottery-status'>
        <span className={`unlock-badge${config.isUnlocked ? ' is-on' : ''}`}>
          {config.isUnlocked ? '已解锁' : '未解锁'}
        </span>
        <button type='button' disabled={!config.isUnlocked}>
          {config.isUnlocked ? '立即抽一次' : '完成投票后解锁'}
        </button>
      </div>
      <div className='lottery-grid'>
        {config.rewards.map((reward) => (
          <div key={reward} className='lottery-item'>
            <strong>{reward}</strong>
            <span>概率：均等</span>
          </div>
        ))}
      </div>
      <aside className='lottery-history'>
        <h3>抽奖记录</h3>
        <ul>
          {config.history.map((record) => (
            <li key={record.id}>
              <span>{record.date}</span>
              <strong>{record.reward}</strong>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  )
}

export default LotteryPanel


