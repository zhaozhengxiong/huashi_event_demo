export type Stage = 'registration' | 'evaluation' | 'announcement'

export type StageVariant = 'registration' | 'evaluation-32' | 'evaluation-8' | 'announcement'

export type ActivityView =
  | 'home'
  | 'register'
  | 'vote'
  | 'myEntries'
  | 'pkList'
  | 'leaderboard'
  | 'lottery'

export interface OcWork {
  id: string
  title: string
  creator: string
  coverImages: string[]
  tags: string[]
  synopsis: string
  highlight: string
  stats: {
    likes: number
    favorites: number
    comments: number
  }
}

export interface RegistrationConfig {
  enrollmentCount: number
  rewards: string[]
  rules: string[]
}

export type EntryStatus = '进行中' | '晋级' | '淘汰' | '轮空'

export interface MyEntry {
  id: string
  workId: string
  status: EntryStatus
  opponent?: string
  pkNumber: string
  currentRound: string
  resultNote?: string
}

export interface MatchContestant {
  workId: string
  score: number
  votes: number
}

export interface Match {
  pkNumber: string
  round: string
  deadline: string
  left: MatchContestant
  right: MatchContestant
  status: 'open' | 'closed'
}

export interface LeaderboardEntry {
  rank: number
  workId: string
  award?: string
}

export interface LotteryReward {
  id: string
  name: string
  probability: number
  imageUrl: string
}

export interface LotteryConfig {
  isUnlocked: boolean
  drawsRemaining: number
  rewards: LotteryReward[]
  history: Array<{ id: string; reward: string; date: string }>
}

export interface ActivityMeta {
  currentRound: string
  totalGroups: number
  completedGroups: number
  remainingTimeLabel: string
}

export interface ShippingInfo {
  name: string
  phone: string
  address: string
}

export interface UserProfile {
  id: string
  nickname: string
  isWinner: boolean
  avatarUrl: string
}

