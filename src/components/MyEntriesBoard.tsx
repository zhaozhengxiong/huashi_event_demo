import { useMemo, useState } from 'react'
import ShareInviteForm from './ShareInviteForm'
import type { MyEntry, OcWork } from '../types'

interface MyEntriesBoardProps {
  entries: MyEntry[]
  worksMap: Record<string, OcWork>
  isVotingStage: boolean
}

const STATUS_COLOR: Record<MyEntry['status'], string> = {
  进行中: 'status-live',
  晋级: 'status-win',
  淘汰: 'status-loss',
  轮空: 'status-bye'
}

function MyEntriesBoard({ entries, worksMap, isVotingStage }: MyEntriesBoardProps) {
  const [shareEntryId, setShareEntryId] = useState<string | null>(null)

  const activeShareContext = useMemo(() => {
    if (!shareEntryId) {
      return null
    }
    const entry = entries.find((item) => item.id === shareEntryId)
    if (!entry) {
      return null
    }
    return {
      entry,
      work: worksMap[entry.workId]
    }
  }, [entries, shareEntryId, worksMap])

  const handleShareClick = (entryId: string, status: MyEntry['status']) => {
    if (!isVotingStage || status !== '进行中') {
      return
    }
    setShareEntryId(entryId)
  }

  const handleCloseShareModal = () => {
    setShareEntryId(null)
  }

  return (
    <section className='my-entries'>
      <header>
        <h2>我的参赛作品</h2>
        <p>掌握每一场对阵状态，可快速直达投票或查看裁决回放。</p>
      </header>
      <div className='entry-list'>
        {entries.map((entry) => {
          const work = worksMap[entry.workId]
          return (
            <article key={entry.id} className='entry-card'>
              <div className='entry-cover'>
                <img src={work?.coverImages[0]} alt={work?.title ?? '参赛作品'} />
                <span className={`entry-status ${STATUS_COLOR[entry.status]}`}>{entry.status}</span>
              </div>
              <div className='entry-content'>
                <header>
                  <h3>{work?.title ?? '未知作品'}</h3>
                  <span className='entry-pk'>PK {entry.pkNumber}</span>
                </header>
                <p className='entry-round'>当前轮次：{entry.currentRound}</p>
                {entry.opponent && <p className='entry-opponent'>对手：{entry.opponent}</p>}
                {entry.resultNote && <p className='entry-note'>{entry.resultNote}</p>}
                <div className='entry-actions'>
                  <button type='button'>直达对阵</button>
                  <button type='button' className='ghost-button'>复制 PK 号码</button>
                  <button
                    type='button'
                    className='ghost-button'
                    disabled={!isVotingStage || entry.status !== '进行中'}
                    onClick={() => handleShareClick(entry.id, entry.status)}
                  >
                    分享
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
      {activeShareContext && activeShareContext.work && (
        <div className='modal-mask'>
          <div className='modal share-invite-modal'>
            <header>
              <h3>邀请好友来投票</h3>
              <button type='button' className='ghost-button' onClick={handleCloseShareModal}>
                关闭
              </button>
            </header>
            <div className='modal-body'>
              <p className='modal-message'>
                为《{activeShareContext.work.title}》号召援军吧！PK {activeShareContext.entry.pkNumber} 当前轮次：
                {activeShareContext.entry.currentRound}
              </p>
              <ShareInviteForm
                successMessage={(nicknames) =>
                  `已通知 ${nicknames.join('、')} 来为《${activeShareContext.work?.title}》助阵！`
                }
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default MyEntriesBoard
