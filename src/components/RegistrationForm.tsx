import { useMemo, useState, type KeyboardEvent } from 'react'
import type { OcWork } from '../types'

interface RegistrationFormProps {
  works: OcWork[]
}

function RegistrationForm({ works }: RegistrationFormProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [remarkMap, setRemarkMap] = useState<Record<string, { title: string; highlight: string }>>({})
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [shareNicknames, setShareNicknames] = useState<string[]>([])
  const [nicknameInput, setNicknameInput] = useState('')
  const [shareFeedback, setShareFeedback] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleRemarkChange = (id: string, field: 'title' | 'highlight', value: string) => {
    setRemarkMap((prev) => ({
      ...prev,
      [id]: {
        title: field === 'title' ? value : prev[id]?.title ?? '',
        highlight: field === 'highlight' ? value : prev[id]?.highlight ?? ''
      }
    }))
  }

  const handleSubmit = () => {
    if (!selectedIds.length) {
      return
    }
    setSuccessModalVisible(true)
    setShareFeedback(null)
  }

  const handleAddNickname = () => {
    const trimmed = nicknameInput.trim()
    if (!trimmed) {
      return
    }
    if (shareNicknames.includes(trimmed)) {
      setShareFeedback(`已添加 ${trimmed}，无需重复输入`)
      setNicknameInput('')
      return
    }
    setShareNicknames((prev) => [...prev, trimmed])
    setNicknameInput('')
    setShareFeedback(null)
  }

  const handleNicknameKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAddNickname()
    }
  }

  const handleRemoveNickname = (nickname: string) => {
    setShareNicknames((prev) => prev.filter((item) => item !== nickname))
  }

  const handleShare = () => {
    if (!shareNicknames.length) {
      setShareFeedback('请至少输入一个需要通知的昵称')
      return
    }
    setShareFeedback(`已通过站内消息通知 ${shareNicknames.join('、')}，祝你比赛顺利！`)
    setShareNicknames([])
  }

  const handleCloseModal = () => {
    setSuccessModalVisible(false)
    setShareNicknames([])
    setNicknameInput('')
    setShareFeedback(null)
  }

  const selectedWorks = useMemo(
    () => works.filter((work) => selectedIds.includes(work.id)),
    [selectedIds, works]
  )

  return (
    <section className='registration'>
      <header>
        <h2>报名我的原创角色</h2>
        <p>选择想参赛的 OC 作品，补充亮点描述后提交，审核通过即可进入抽签池。</p>
      </header>
      <div className='work-grid'>
        {works.map((work) => {
          const isSelected = selectedIds.includes(work.id)
          return (
            <article key={work.id} className={`work-card${isSelected ? ' is-selected' : ''}`}>
              <div className='work-thumb'>
                <img src={work.coverImages[0]} alt={work.title} />
                <label className='work-select'>
                  <input
                    type='checkbox'
                    checked={isSelected}
                    onChange={() => handleToggle(work.id)}
                  />
                  参赛
                </label>
              </div>
              <div className='work-info'>
                <h3>{work.title}</h3>
                <p className='work-meta'>作者：{work.creator}</p>
                <div className='badge-row'>
                  {work.tags.map((tag) => (
                    <span key={tag} className='badge'>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className='work-synopsis'>{work.synopsis}</p>
              </div>
            </article>
          )
        })}
      </div>
      {selectedWorks.length > 0 && (
        <div className='enroll-form'>
          <h3>补充参赛信息</h3>
          {selectedWorks.map((work) => {
            const remark = remarkMap[work.id] ?? { title: '', highlight: '' }
            return (
              <div key={work.id} className='enroll-item'>
                <header>
                  <strong>{work.title}</strong>
                  <span>PK 展示信息将在审核通过后可更新</span>
                </header>
                <label>
                  参赛标题
                  <input
                    type='text'
                    value={remark.title}
                    onChange={(event) => handleRemarkChange(work.id, 'title', event.target.value)}
                    placeholder='例：霓光行者·夜幕巡航'
                  />
                </label>
                <label>
                  亮点补充
                  <textarea
                    value={remark.highlight}
                    onChange={(event) => handleRemarkChange(work.id, 'highlight', event.target.value)}
                    placeholder='简要说明本场亮点，如：限定武器、剧情彩蛋、视频更新等'
                    rows={3}
                  />
                </label>
              </div>
            )
          })}
          <button type='button' className='submit-button' onClick={handleSubmit}>
            确认报名
          </button>
        </div>
      )}
      {successModalVisible && (
        <div className='modal-mask'>
          <div className='modal share-success-modal'>
            <header>
              <h3>报名成功</h3>
              <button type='button' className='ghost-button' onClick={handleCloseModal}>
                关闭
              </button>
            </header>
            <div className='modal-body'>
              <p className='modal-message'>作品已进入审核队列。填写想通知的创作者昵称，我们会通过站内消息告知他们一起围观。</p>
              <div className='share-nickname-form'>
                <label>
                  邀请好友
                  <div className='share-nickname-input'>
                    <input
                      type='text'
                      value={nicknameInput}
                      onChange={(event) => setNicknameInput(event.target.value)}
                      onKeyDown={handleNicknameKeyDown}
                      placeholder='输入昵称后回车，支持多个'
                    />
                    <button type='button' onClick={handleAddNickname}>
                      添加
                    </button>
                  </div>
                </label>
                {shareNicknames.length > 0 && (
                  <ul className='share-nickname-list'>
                    {shareNicknames.map((nickname) => (
                      <li key={nickname}>
                        <span>{nickname}</span>
                        <button type='button' onClick={() => handleRemoveNickname(nickname)} aria-label={`移除 ${nickname}`}>
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className='share-actions'>
                  <button type='button' className='primary' onClick={handleShare}>
                    分享通知
                  </button>
                </div>
                {shareFeedback && <p className='share-feedback'>{shareFeedback}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default RegistrationForm


