import { useEffect, useMemo, useState } from 'react'
import ActivityHome from './components/ActivityHome'
import LeaderboardWall from './components/LeaderboardWall'
import LotteryPanel from './components/LotteryPanel'
import MyEntriesBoard from './components/MyEntriesBoard'
import PkListTable from './components/PkListTable'
import RegistrationForm from './components/RegistrationForm'
import ShippingModal from './components/ShippingModal'
import StageToggle from './components/StageToggle'
import TopNav from './components/TopNav'
import VotingArena from './components/VotingArena'
import {
  ACTIVITY_META,
  LEADERBOARD,
  LOTTERY_CONFIG,
  MATCHES,
  MY_ENTRIES,
  OC_WORKS,
  REGISTRATION_CONFIG
} from './data/mockData'
import type { ActivityView, ShippingInfo, Stage, UserProfile } from './types'
import './App.css'

const DEFAULT_STAGE: Stage = 'evaluation'
const DEFAULT_VIEW_BY_STAGE: Record<Stage, ActivityView> = {
  registration: 'home',
  evaluation: 'vote',
  announcement: 'leaderboard'
}

const VIEW_STAGE_RULES: Record<ActivityView, Stage[]> = {
  home: ['registration', 'evaluation'],
  register: ['registration'],
  vote: ['evaluation', 'announcement'],
  myEntries: ['evaluation', 'announcement'],
  pkList: ['evaluation'],
  leaderboard: ['announcement'],
  lottery: ['evaluation', 'announcement']
}

const VIEW_LABEL: Record<ActivityView, string> = {
  home: '活动首页',
  register: '报名入口',
  vote: 'PK 投票',
  myEntries: '我的参赛',
  pkList: 'PK 列表',
  leaderboard: '最终榜单',
  lottery: '抽奖'
}

const NAV_ORDER: ActivityView[] = ['home', 'register', 'vote', 'myEntries', 'pkList', 'leaderboard', 'lottery']

const userProfile: UserProfile = {
  id: 'user-demo',
  nickname: '风之河',
  isWinner: true
}

// 将作品列表映射为索引，便于快速查找
const WORKS_MAP = OC_WORKS.reduce<Record<string, typeof OC_WORKS[number]>>((acc, work) => {
  acc[work.id] = work
  return acc
}, {})

const SHOW_STAGE_TOGGLE = true // 测试环境使用，正式上线前设为 false 即可隐藏

function App() {
  const [stage, setStage] = useState<Stage>(DEFAULT_STAGE)
  const [activeView, setActiveView] = useState<ActivityView>(DEFAULT_VIEW_BY_STAGE[DEFAULT_STAGE])
  const [activePk, setActivePk] = useState<string | undefined>(MATCHES[0]?.pkNumber)
  const [shippingVisible, setShippingVisible] = useState(false)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null)

  useEffect(() => {
    const allowedViews = NAV_ORDER.filter((view) => VIEW_STAGE_RULES[view].includes(stage))
    if (!allowedViews.includes(activeView)) {
      setActiveView(DEFAULT_VIEW_BY_STAGE[stage])
    }
    if (stage === 'announcement' && userProfile.isWinner && !shippingInfo) {
      setShippingVisible(true)
    }
    if (stage !== 'announcement') {
      setShippingVisible(false)
    }
  }, [stage, activeView, shippingInfo])

  const navItems = useMemo(
    () =>
      NAV_ORDER.filter((view) => VIEW_STAGE_RULES[view].includes(stage)).map((view) => ({
        view,
        label: VIEW_LABEL[view]
      })),
    [stage]
  )

  const handleStageChange = (nextStage: Stage) => {
    setStage(nextStage)
    setActiveView((current) => {
      const isValid = VIEW_STAGE_RULES[current].includes(nextStage)
      return isValid ? current : DEFAULT_VIEW_BY_STAGE[nextStage]
    })
  }

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return (
          <ActivityHome
            stage={stage}
            registration={REGISTRATION_CONFIG}
            meta={ACTIVITY_META}
            leaderboard={LEADERBOARD}
            worksMap={WORKS_MAP}
            onNavigate={(view) => setActiveView(view)}
          />
        )
      case 'register':
        return <RegistrationForm works={OC_WORKS} />
      case 'vote':
        return (
          <VotingArena
            matches={MATCHES}
            worksMap={WORKS_MAP}
            meta={ACTIVITY_META}
            activePk={activePk}
            onActivePkChange={(pk) => setActivePk(pk)}
          />
        )
      case 'myEntries':
        return <MyEntriesBoard entries={MY_ENTRIES} worksMap={WORKS_MAP} />
      case 'pkList':
        return (
          <PkListTable
            matches={MATCHES}
            worksMap={WORKS_MAP}
            onSelect={(pk) => {
              setActivePk(pk)
              setActiveView('vote')
            }}
          />
        )
      case 'leaderboard':
        return <LeaderboardWall entries={LEADERBOARD} worksMap={WORKS_MAP} />
      case 'lottery':
        return <LotteryPanel config={LOTTERY_CONFIG} />
      default:
        return null
    }
  }

  return (
    <div className={`app stage-${stage}`}>
      <StageToggle stage={stage} onStageChange={handleStageChange} isVisible={SHOW_STAGE_TOGGLE} />
      <header className='app-header'>
        <div>
          <h1>画时 OC PK 赛</h1>
          <p>激发原创角色灵感，见证每一场逆袭与荣耀。</p>
        </div>
        <div className='user-chip'>
          <span className='chip-name'>{userProfile.nickname}</span>
          <span className='chip-role'>参赛选手</span>
        </div>
      </header>
      <TopNav
        items={navItems}
        activeView={activeView}
        onSelect={(view) => setActiveView(view)}
      />
      <main className='app-main'>{renderView()}</main>
      <footer className='app-footer'>
        <small>本页面所有数据均为演示用途的模拟数据。</small>
      </footer>
      <ShippingModal
        visible={shippingVisible && !shippingInfo}
        onClose={() => setShippingVisible(false)}
        onSubmit={(info) => {
          setShippingInfo(info)
          setShippingVisible(false)
        }}
      />
      {shippingInfo && (
        <div className='shipping-review'>
          <strong>邮寄信息已提交</strong>
          <span>
            {shippingInfo.name} · {shippingInfo.phone} · {shippingInfo.address}
          </span>
        </div>
      )}
    </div>
  )
}

export default App


