import type {
  ActivityMeta,
  LeaderboardEntry,
  LotteryConfig,
  Match,
  MyEntry,
  OcWork,
  RegistrationConfig,
  StageVariant,
  UserProfile
} from '../types'

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
  },
  {
    id: 'work-starseer',
    title: '星脉占梦师',
    creator: '北辰',
    coverImages: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['玄幻', '星象'],
    synopsis: '在星图间穿梭的占梦师，能为迷失者捕捉未来的回响。',
    highlight: '她的星脉罗盘能同步整个星域的脉动。',
    stats: {
      likes: 8120,
      favorites: 4521,
      comments: 389
    }
  },
  {
    id: 'work-inkguard',
    title: '墨域守门人',
    creator: '丹青客',
    coverImages: [
      'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['武侠', '守护'],
    synopsis: '以墨化刃守护书城边界的守门人，将传说封存于卷轴之中。',
    highlight: '墨刃挥落时能暂存时间，护送旅人安全通过。',
    stats: {
      likes: 7688,
      favorites: 4210,
      comments: 345
    }
  },
  {
    id: 'work-riftchef',
    title: '裂隙厨师',
    creator: '南风铺子',
    coverImages: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['奇趣', '美食'],
    synopsis: '能在次元裂隙中烹饪的厨师，把失落的味觉重新缝合。',
    highlight: '他的器具可捕捉异空间香气，转化为现实味道。',
    stats: {
      likes: 7021,
      favorites: 3895,
      comments: 298
    }
  },
  {
    id: 'work-windcarver',
    title: '风痕雕翼师',
    creator: '夏墨',
    coverImages: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['工艺', '飞行'],
    synopsis: '为浮空城打造羽翼的雕刻师，以风痕铭刻每一次飞翔。',
    highlight: '能为飞行者量身雕刻共鸣羽翼，增强气流掌控。',
    stats: {
      likes: 6810,
      favorites: 3544,
      comments: 276
    }
  }
]

export const CREATOR_SUGGESTIONS: Array<Pick<UserProfile, 'id' | 'nickname' | 'avatarUrl'>> = [
  {
    id: 'creator-lighthouse',
    nickname: '灯塔',
    avatarUrl: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=160&q=80'
  },
  {
    id: 'creator-nightwind',
    nickname: '夜风船长',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80'
  },
  {
    id: 'creator-aurora',
    nickname: '霓极光',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'
  },
  {
    id: 'creator-sandbard',
    nickname: '沙律吟游',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80'
  },
  {
    id: 'creator-inkguard',
    nickname: '墨域守门',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80'
  },
  {
    id: 'creator-starweaver',
    nickname: '织星人',
    avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=160&q=80'
  },
  {
    id: 'creator-riftchef',
    nickname: '裂隙小厨',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80'
  },
  {
    id: 'creator-dawn',
    nickname: '晨昕',
    avatarUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=160&q=80'
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

const MATCHES_EVALUATION_32: Match[] = [
  {
    pkNumber: 'R16-01',
    round: '32 进 16',
    deadline: '2025-10-28T18:00:00+08:00',
    left: { workId: 'work-neo-aurora', score: 89, votes: 412 },
    right: { workId: 'work-riftchef', score: 84, votes: 376 },
    status: 'closed'
  },
  {
    pkNumber: 'R16-02',
    round: '32 进 16',
    deadline: '2025-10-28T19:00:00+08:00',
    left: { workId: 'work-sandbard', score: 85, votes: 398 },
    right: { workId: 'work-windcarver', score: 80, votes: 344 },
    status: 'closed'
  },
  {
    pkNumber: 'R16-03',
    round: '32 进 16',
    deadline: '2025-10-29T18:00:00+08:00',
    left: { workId: 'work-clocktailor', score: 90, votes: 436 },
    right: { workId: 'work-inkguard', score: 83, votes: 362 },
    status: 'closed'
  },
  {
    pkNumber: 'R16-04',
    round: '32 进 16',
    deadline: '2025-10-29T19:30:00+08:00',
    left: { workId: 'work-mistrider', score: 88, votes: 421 },
    right: { workId: 'work-starseer', score: 87, votes: 415 },
    status: 'closed'
  },
  {
    pkNumber: 'R16-05',
    round: '32 进 16',
    deadline: '2025-10-30T18:00:00+08:00',
    left: { workId: 'work-neo-aurora', score: 91, votes: 452 },
    right: { workId: 'work-windcarver', score: 82, votes: 331 },
    status: 'open'
  },
  {
    pkNumber: 'R16-06',
    round: '32 进 16',
    deadline: '2025-10-30T19:00:00+08:00',
    left: { workId: 'work-clocktailor', score: 93, votes: 468 },
    right: { workId: 'work-riftchef', score: 85, votes: 352 },
    status: 'open'
  },
  {
    pkNumber: 'R16-07',
    round: '32 进 16',
    deadline: '2025-10-31T18:00:00+08:00',
    left: { workId: 'work-starseer', score: 89, votes: 404 },
    right: { workId: 'work-inkguard', score: 86, votes: 378 },
    status: 'open'
  },
  {
    pkNumber: 'R16-08',
    round: '32 进 16',
    deadline: '2025-10-31T20:00:00+08:00',
    left: { workId: 'work-mistrider', score: 90, votes: 446 },
    right: { workId: 'work-sandbard', score: 84, votes: 362 },
    status: 'open'
  }
]

const MATCHES_EVALUATION_8: Match[] = [
  {
    pkNumber: 'QF01',
    round: '8 进 4',
    deadline: '2025-11-02T18:00:00+08:00',
    left: { workId: 'work-neo-aurora', score: 92, votes: 618 },
    right: { workId: 'work-inkguard', score: 86, votes: 564 },
    status: 'open'
  },
  {
    pkNumber: 'QF02',
    round: '8 进 4',
    deadline: '2025-11-02T19:00:00+08:00',
    left: { workId: 'work-sandbard', score: 88, votes: 532 },
    right: { workId: 'work-starseer', score: 90, votes: 548 },
    status: 'open'
  },
  {
    pkNumber: 'QF03',
    round: '8 进 4',
    deadline: '2025-11-03T18:00:00+08:00',
    left: { workId: 'work-clocktailor', score: 94, votes: 601 },
    right: { workId: 'work-riftchef', score: 87, votes: 522 },
    status: 'open'
  },
  {
    pkNumber: 'QF04',
    round: '8 进 4',
    deadline: '2025-11-03T19:00:00+08:00',
    left: { workId: 'work-mistrider', score: 90, votes: 566 },
    right: { workId: 'work-windcarver', score: 84, votes: 498 },
    status: 'open'
  },
  {
    pkNumber: 'SF01',
    round: '4 进 2',
    deadline: '2025-11-05T20:00:00+08:00',
    left: { workId: 'work-neo-aurora', score: 96, votes: 652 },
    right: { workId: 'work-starseer', score: 93, votes: 618 },
    status: 'closed'
  },
  {
    pkNumber: 'SF02',
    round: '4 进 2',
    deadline: '2025-11-05T21:00:00+08:00',
    left: { workId: 'work-clocktailor', score: 95, votes: 640 },
    right: { workId: 'work-mistrider', score: 91, votes: 604 },
    status: 'closed'
  },
  {
    pkNumber: 'GF01',
    round: '冠军战',
    deadline: '2025-11-07T20:30:00+08:00',
    left: { workId: 'work-neo-aurora', score: 98, votes: 712 },
    right: { workId: 'work-clocktailor', score: 97, votes: 705 },
    status: 'closed'
  }
]

export const MATCHES_BY_STAGE: Record<StageVariant, Match[]> = {
  registration: [],
  'evaluation-32': MATCHES_EVALUATION_32,
  'evaluation-8': MATCHES_EVALUATION_8,
  announcement: MATCHES_EVALUATION_8
}


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
  { rank: 4, workId: 'work-sandbard' },
  { rank: 5, workId: 'work-starseer' },
  { rank: 6, workId: 'work-inkguard' },
  { rank: 7, workId: 'work-riftchef' },
  { rank: 8, workId: 'work-windcarver' }
]

export const LOTTERY_CONFIG: LotteryConfig = {
  isUnlocked: true,
  drawsRemaining: 2,
  rewards: [
    {
      id: 'reward-badge',
      name: '限定实体徽章',
      probability: 35,
      imageUrl: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee'
    },
    {
      id: 'reward-artbook',
      name: '实体画册',
      probability: 28,
      imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d'
    },
    {
      id: 'reward-double-points',
      name: '双倍积分卡',
      probability: 22,
      imageUrl: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c'
    },
    {
      id: 'reward-mystery-box',
      name: '定制周边盲盒',
      probability: 15,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
    }
  ],
  history: [
    { id: 'lot-1', reward: '双倍积分卡', date: '2025-10-18 21:32' },
    { id: 'lot-2', reward: '限定实体徽章', date: '2025-10-18 21:34' }
  ]
}

const META_REGISTRATION: ActivityMeta = {
  currentRound: '报名进行中',
  totalGroups: 0,
  completedGroups: 0,
  remainingTimeLabel: '剩余 05 天 12:00:00'
}

const META_EVALUATION_32: ActivityMeta = {
  currentRound: '32 进 16',
  totalGroups: 16,
  completedGroups: 6,
  remainingTimeLabel: '剩余 08:12:45'
}

const META_EVALUATION_8: ActivityMeta = {
  currentRound: '8 进 4',
  totalGroups: 4,
  completedGroups: 2,
  remainingTimeLabel: '剩余 01:12:32'
}

const META_ANNOUNCEMENT: ActivityMeta = {
  currentRound: '冠军战',
  totalGroups: 1,
  completedGroups: 1,
  remainingTimeLabel: '已结束'
}

export const ACTIVITY_META_BY_STAGE: Record<StageVariant, ActivityMeta> = {
  registration: META_REGISTRATION,
  'evaluation-32': META_EVALUATION_32,
  'evaluation-8': META_EVALUATION_8,
  announcement: META_ANNOUNCEMENT
}

