import type { ActivityMeta, LeaderboardEntry, LotteryConfig, Match, MyEntry, OcWork, RegistrationConfig } from '../types'

export const MOCK_STAGE: 'registration' | 'evaluation' | 'announcement' = 'evaluation'

export const OC_WORKS: OcWork[] = [
  {
    id: 'work-neo-aurora',
    title: '霓光行者 Neo Aurora',
    creator: '灯塔',
    coverImages: [
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99',
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6'
    ],
    tags: ['科幻', '城市猎手'],
    synopsis:
      '身披可编织霓光的城际递送员，穿梭于高空磁悬道，为被遗忘的记忆送达归属。',
    highlight: '能读取情绪频谱的光刃手套是她的王牌。',
    stats: {
      likes: 12431,
      favorites: 6732,
      comments: 836
    }
  },
  {
    id: 'work-sandbard',
    title: '沙律吟游者',
    creator: '未眠之丘',
    coverImages: [
      'https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee',
      'https://images.unsplash.com/photo-1618005198760-5731d05bb77a'
    ],
    tags: ['奇幻', '吟游诗人'],
    synopsis:
      '背负古老琴匣的吟游者，在风暴之海收集沉沙中的歌谣，用声音折叠空间。',
    highlight: '琴匣共鸣可召唤风暴之灵。',
    stats: {
      likes: 8904,
      favorites: 5012,
      comments: 412
    }
  },
  {
    id: 'work-clocktailor',
    title: '时纺匠',
    creator: '桔灯',
    coverImages: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'
    ],
    tags: ['蒸汽朋克', '工匠'],
    synopsis: '能将时间缝制进衣料里的工匠，替漂泊者修补破损的过往。',
    highlight: '每件作品都藏着一段已修复的记忆。',
    stats: {
      likes: 11203,
      favorites: 7045,
      comments: 510
    }
  },
  {
    id: 'work-mistrider',
    title: '雾岬逐浪者',
    creator: '海鸥电台',
    coverImages: [
      'https://images.unsplash.com/photo-1526481280695-3c46973ed155',
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'
    ],
    tags: ['冒险', '海洋'],
    synopsis: '驭雾飞板穿梭礁桥，收集潮汐频谱的少女，守护岛屿间的航路。',
    highlight: '潮汐记忆罐能复刻失落景象。',
    stats: {
      likes: 9532,
      favorites: 6188,
      comments: 377
    }
  }
]

export const REGISTRATION_CONFIG: RegistrationConfig = {
  enrollmentCount: 326,
  rewards: [
    '冠军：定制奖杯 + 平台首页推荐位 + 5000 积分',
    '亚军：平台推荐位 + 3000 积分',
    '季军：平台推荐位 + 2000 积分',
    'TOP16：专属徽章 + 500 积分'
  ],
  rules: [
    '单败淘汰赛制：报名作品两两随机匹配，胜者晋级',
    '参赛作品支持多图与视频，需通过机审后展示',
    '每轮结束后票数清零，下一轮重新开始',
    '支持 PK 号码直达对阵页，可分享好友助阵'
  ]
}

export const MATCHES: Match[] = [
  {
    pkNumber: 'A102',
    round: '64 进 32',
    deadline: '2025-10-24T18:00:00+08:00',
    left: { workId: 'work-neo-aurora', score: 64, votes: 320 },
    right: { workId: 'work-sandbard', score: 58, votes: 298 },
    status: 'open'
  },
  {
    pkNumber: 'A204',
    round: '64 进 32',
    deadline: '2025-10-24T18:00:00+08:00',
    left: { workId: 'work-clocktailor', score: 72, votes: 402 },
    right: { workId: 'work-mistrider', score: 70, votes: 401 },
    status: 'open'
  },
  {
    pkNumber: 'B108',
    round: '32 进 16',
    deadline: '2025-10-26T20:00:00+08:00',
    left: { workId: 'work-neo-aurora', score: 84, votes: 512 },
    right: { workId: 'work-clocktailor', score: 79, votes: 478 },
    status: 'closed'
  }
]

export const MY_ENTRIES: MyEntry[] = [
  {
    id: 'entry-1',
    workId: 'work-neo-aurora',
    status: '晋级',
    opponent: '沙律吟游者',
    pkNumber: 'A102',
    currentRound: '64 进 32',
    resultNote: '以 22 票优势晋级'
  },
  {
    id: 'entry-2',
    workId: 'work-sandbard',
    status: '淘汰',
    opponent: '霓光行者 Neo Aurora',
    pkNumber: 'A102',
    currentRound: '64 进 32',
    resultNote: '平票后按累计胜场裁决出局'
  },
  {
    id: 'entry-3',
    workId: 'work-clocktailor',
    status: '进行中',
    opponent: '雾岬逐浪者',
    pkNumber: 'A204',
    currentRound: '64 进 32'
  },
  {
    id: 'entry-4',
    workId: 'work-mistrider',
    status: '轮空',
    pkNumber: 'B000',
    currentRound: '32 进 16',
    resultNote: '本轮轮空自动晋级'
  }
]

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, workId: 'work-neo-aurora', award: '冠军' },
  { rank: 2, workId: 'work-clocktailor', award: '亚军' },
  { rank: 3, workId: 'work-mistrider', award: '季军' },
  { rank: 4, workId: 'work-sandbard' }
]

export const LOTTERY_CONFIG: LotteryConfig = {
  isUnlocked: true,
  drawsRemaining: 2,
  rewards: ['限定实体徽章', '实体画册', '双倍积分卡', '定制周边盲盒'],
  history: [
    { id: 'lot-1', reward: '双倍积分卡', date: '2025-10-18 21:32' },
    { id: 'lot-2', reward: '限定实体徽章', date: '2025-10-18 21:34' }
  ]
}

export const ACTIVITY_META: ActivityMeta = {
  currentRound: '64 进 32',
  totalGroups: 32,
  completedGroups: 18,
  remainingTimeLabel: '剩余 02:18:45'
}


