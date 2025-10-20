import { useEffect, useMemo, useState } from 'react'
import type { LotteryConfig, LotteryReward } from '../types'

interface LotteryPanelProps {
  config: LotteryConfig
}

const VOTES_PER_DRAW = 10

const drawReward = (rewards: LotteryReward[]): LotteryReward => {
  const totalProbability = rewards.reduce((total, reward) => total + reward.probability, 0)
  const randomValue = Math.random() * totalProbability
  let cumulative = 0

  for (const reward of rewards) {
    cumulative += reward.probability
    if (randomValue <= cumulative) {
      return reward
    }
  }

  return rewards[rewards.length - 1]
}

function LotteryPanel({ config }: LotteryPanelProps) {
  const [drawsRemaining, setDrawsRemaining] = useState(() => config.drawsRemaining)
  const [history, setHistory] = useState(() => config.history)
  const [resultReward, setResultReward] = useState<LotteryReward | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const canDraw = useMemo(() => config.isUnlocked, [config.isUnlocked])

  useEffect(() => {
    if (!feedback) {
      return
    }
    const timer = window.setTimeout(() => setFeedback(null), 2400)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const handleDraw = () => {
    if (!config.isUnlocked) {
      return
    }

    if (drawsRemaining <= 0) {
      setFeedback(`再投${VOTES_PER_DRAW}票可获得1次抽奖机会`)
      return
    }

    const reward = drawReward(config.rewards)
    setDrawsRemaining((count) => count - 1)
    setResultReward(reward)
    setModalVisible(true)
    setFeedback(null)
    setHistory((prev) => [
      {
        id: `lot-${Date.now()}`,
        reward: reward.name,
        date: new Date().toLocaleString('zh-CN', { hour12: false })
      },
      ...prev
    ])
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  return (
    <section className='lottery'>
      <header>
        <h2>抽奖中心</h2>
        <p>完成当轮全部对阵即可抽奖，每日次数上限为 3 次。</p>
        <p>每投出10票获得一次抽奖机会。</p>
      </header>
      <div className='lottery-status'>
        <span className='lottery-remaining'>剩余抽奖次数：{drawsRemaining} 次</span>
        <div className='lottery-action'>
          <button type='button' disabled={!canDraw} onClick={handleDraw}>
            {config.isUnlocked ? '立即抽一次' : '完成投票后解锁'}
          </button>
          {feedback && <span className='lottery-feedback'>{feedback}</span>}
        </div>
      </div>
      <div className='lottery-grid'>
        {config.rewards.map((reward) => (
          <div key={reward.id} className='lottery-item'>
            <img src={reward.imageUrl} alt={reward.name} />
            <strong>{reward.name}</strong>
            <span>概率：{reward.probability}%</span>
          </div>
        ))}
      </div>
      <aside className='lottery-history'>
        <h3>抽奖记录</h3>
        <ul>
          {history.map((record) => (
            <li key={record.id}>
              <span>{record.date}</span>
              <strong>{record.reward}</strong>
            </li>
          ))}
        </ul>
      </aside>
      {modalVisible && resultReward && (
        <div className='modal-mask'>
          <div className='modal lottery-modal'>
            <header>
              <h3>抽奖结果</h3>
              <button type='button' className='ghost-button' onClick={closeModal}>
                关闭
              </button>
            </header>
            <div className='lottery-modal-body'>
              <img src={resultReward.imageUrl} alt={resultReward.name} />
              <strong className='lottery-result-title'>恭喜获得：{resultReward.name}</strong>
              <p className='lottery-result-tip'>奖励已发送到背包，请注意查收。</p>
            </div>
            <button type='button' onClick={closeModal}>
              知道了
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default LotteryPanel
