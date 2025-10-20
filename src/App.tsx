import { useCallback, useEffect, useMemo, useState } from "react";
import ActivityHome from "./components/ActivityHome";
import LeaderboardWall from "./components/LeaderboardWall";
import LotteryPanel from "./components/LotteryPanel";
import MyEntriesBoard from "./components/MyEntriesBoard";
import PkListTable from "./components/PkListTable";
import PkNumberSearch from "./components/PkNumberSearch";
import RegistrationForm from "./components/RegistrationForm";
import ShippingModal from "./components/ShippingModal";
import TopNav from "./components/TopNav";
import VotingArena from "./components/VotingArena";
import {
  ACTIVITY_META_BY_STAGE,
  LEADERBOARD,
  LOTTERY_CONFIG,
  MATCHES_BY_STAGE,
  MY_ENTRIES,
  OC_WORKS,
  REGISTRATION_CONFIG,
} from "./data/mockData";
import type { ActivityView, ShippingInfo, Stage, StageVariant, UserProfile } from "./types";
import "./App.css";

interface StageState {
  stage: Stage;
  variant: StageVariant;
  index: number;
}

const STAGE_SEQUENCE: StageState[] = [
  { stage: "registration", variant: "registration", index: 0 },
  { stage: "evaluation", variant: "evaluation-32", index: 1 },
  { stage: "evaluation", variant: "evaluation-8", index: 2 },
  { stage: "announcement", variant: "announcement", index: 3 },
];

const DEFAULT_STAGE_STATE = STAGE_SEQUENCE[2];
const DEFAULT_VIEW_BY_STAGE: Record<Stage, ActivityView> = {
  registration: "home",
  evaluation: "pkList",
  announcement: "leaderboard",
};

const resolveStageFromSearch = (): StageState => {
  if (typeof window === "undefined") {
    return DEFAULT_STAGE_STATE;
  }
  const params = new URLSearchParams(window.location.search);
  const stageParam = params.get("stage");
  if (stageParam === null) {
    return DEFAULT_STAGE_STATE;
  }
  const stageIndex = Number(stageParam);
  if (!Number.isInteger(stageIndex)) {
    return DEFAULT_STAGE_STATE;
  }
  return STAGE_SEQUENCE[stageIndex] ?? DEFAULT_STAGE_STATE;
};

const VIEW_STAGE_RULES: Record<ActivityView, Stage[]> = {
  home: ["registration"],
  register: ["registration"],
  vote: ["evaluation"],
  myEntries: ["evaluation", "announcement"],
  pkList: ["evaluation"],
  leaderboard: ["announcement"],
  lottery: ["evaluation", "announcement"],
};

const VIEW_LABEL: Record<ActivityView, string> = {
  home: "活动首页",
  register: "报名入口",
  vote: "PK 投票",
  myEntries: "我的参赛",
  pkList: "PK 列表",
  leaderboard: "最终榜单",
  lottery: "抽奖",
};

const NAV_ORDER: ActivityView[] = ["home", "register", "vote", "myEntries", "pkList", "leaderboard", "lottery"];

const userProfile: UserProfile = {
  id: "user-demo",
  nickname: "风之河",
  isWinner: true,
  avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
};

// 将作品列表映射为索引，便于快速查找
const WORKS_MAP = OC_WORKS.reduce<Record<string, (typeof OC_WORKS)[number]>>((acc, work) => {
  acc[work.id] = work;
  return acc;
}, {});

function App() {
  const initialStageState = useMemo(() => resolveStageFromSearch(), []);
  const initialMatches = MATCHES_BY_STAGE[initialStageState.variant] ?? [];
  const [stageState, setStageState] = useState<StageState>(initialStageState);
  const stage = stageState.stage;
  const stageVariant = stageState.variant;
  const [activeView, setActiveView] = useState<ActivityView>(DEFAULT_VIEW_BY_STAGE[initialStageState.stage]);
  const [activePk, setActivePk] = useState<string | undefined>(initialMatches[0]?.pkNumber);
  const [shippingVisible, setShippingVisible] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [registrationVisible, setRegistrationVisible] = useState(false);

  const myWinningEntry = useMemo(() => {
    const myWorkIds = new Set(MY_ENTRIES.map((entry) => entry.workId));
    return LEADERBOARD.find((entry) => myWorkIds.has(entry.workId));
  }, []);
  const winnerWork = useMemo(() => (myWinningEntry ? WORKS_MAP[myWinningEntry.workId] : undefined), [myWinningEntry]);
  const matches = useMemo(() => MATCHES_BY_STAGE[stageVariant] ?? [], [stageVariant]);
  const activityMeta = useMemo(
    () => ACTIVITY_META_BY_STAGE[stageVariant] ?? ACTIVITY_META_BY_STAGE[DEFAULT_STAGE_STATE.variant],
    [stageVariant]
  );

  useEffect(() => {
    if (!matches.length) {
      setActivePk(undefined);
      return;
    }
    setActivePk((current) => (current && matches.some((match) => match.pkNumber === current) ? current : matches[0].pkNumber));
  }, [matches]);

  const handlePkNavigate = useCallback(
    (pkNumber: string) => {
      setActivePk(pkNumber);
      setActiveView("vote");
    },
    [setActivePk, setActiveView]
  );

  const allowedViews = useMemo(
    () =>
      NAV_ORDER.filter((view) => {
        if (stage === "registration" && view === "register") {
          return false;
        }
        return VIEW_STAGE_RULES[view].includes(stage);
      }),
    [stage]
  );

  useEffect(() => {
    if (!allowedViews.includes(activeView)) {
      setActiveView(DEFAULT_VIEW_BY_STAGE[stage]);
    }
    if (stage === "announcement" && userProfile.isWinner && !shippingInfo) {
      setShippingVisible(true);
    }
    if (stage !== "announcement") {
      setShippingVisible(false);
    }
    if (stage !== "registration") {
      setRegistrationVisible(false);
    }
  }, [stage, activeView, shippingInfo, allowedViews]);

  const navItems = useMemo(
    () =>
      allowedViews.map((view) => ({
        view,
        label: VIEW_LABEL[view],
      })),
    [allowedViews]
  );

  useEffect(() => {
    const syncStageFromUrl = () => {
      const nextStage = resolveStageFromSearch();
      setStageState((currentStage) =>
        currentStage.index === nextStage.index ? currentStage : nextStage
      );
    };

    window.addEventListener("popstate", syncStageFromUrl);
    return () => {
      window.removeEventListener("popstate", syncStageFromUrl);
    };
  }, []);

  const renderView = () => {
    switch (activeView) {
      case "home":
        return (
          <ActivityHome
            stage={stage}
            registration={REGISTRATION_CONFIG}
            meta={activityMeta}
            leaderboard={LEADERBOARD}
            worksMap={WORKS_MAP}
            onNavigate={(view) => setActiveView(view)}
            onOpenRegistration={() => setRegistrationVisible(true)}
          />
        );
      case "register":
        return null;
      case "vote":
        return (
          <VotingArena
            matches={matches}
            worksMap={WORKS_MAP}
            meta={activityMeta}
            activePk={activePk}
            onActivePkChange={(pk) => setActivePk(pk)}
          />
        );
      case "myEntries":
        return <MyEntriesBoard entries={MY_ENTRIES} worksMap={WORKS_MAP} />;
      case "pkList":
        return (
          <PkListTable
            matches={matches}
            worksMap={WORKS_MAP}
            meta={activityMeta}
            onSelect={(pk) => {
              setActivePk(pk);
              setActiveView("vote");
            }}
          />
        );
      case "leaderboard":
        return <LeaderboardWall entries={LEADERBOARD} worksMap={WORKS_MAP} stage={stage} />;
      case "lottery":
        return <LotteryPanel config={LOTTERY_CONFIG} />;
      default:
        return null;
    }
  };

  return (
    <div className={`app stage-${stage}`}>
      <header className="app-header">
        <div>
          <h1>画时 OC PK 赛</h1>
          <p>激发原创角色灵感，见证每一场逆袭与荣耀。</p>
        </div>
        <div className="user-chip">
          <img className="chip-avatar" src={userProfile.avatarUrl} alt={`${userProfile.nickname} 的头像`} />
          <span className="chip-name">{userProfile.nickname}</span>
        </div>
      </header>
      <TopNav items={navItems} activeView={activeView} onSelect={(view) => setActiveView(view)} />
      {stage === "evaluation" && activeView !== "vote" && matches.length > 0 && (
        <PkNumberSearch matches={matches} onNavigate={handlePkNavigate} />
      )}
      <main className="app-main">{renderView()}</main>
      <footer className="app-footer">
        <small>本页面所有数据均为演示用途的模拟数据。</small>
      </footer>
      <ShippingModal
        visible={shippingVisible && !shippingInfo}
        onClose={() => setShippingVisible(false)}
        onSubmit={(info) => {
          setShippingInfo(info);
          setShippingVisible(false);
        }}
        winnerWorkTitle={winnerWork?.title}
        winnerAward={myWinningEntry?.award}
      />
      {stage === "registration" && registrationVisible && (
        <div className="modal-mask">
          <div className="modal registration-modal">
            <header>
              <h3>报名入口</h3>
              <button type="button" className="ghost-button" onClick={() => setRegistrationVisible(false)}>
                关闭
              </button>
            </header>
            <div className="modal-body">
              <RegistrationForm works={OC_WORKS} />
            </div>
          </div>
        </div>
      )}
      {shippingInfo && (
        <div className="shipping-review">
          <strong>邮寄信息已提交</strong>
          <span>
            {shippingInfo.name} · {shippingInfo.phone} · {shippingInfo.address}
          </span>
        </div>
      )}
    </div>
  );
}

export default App;
