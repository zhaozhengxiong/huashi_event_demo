import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { CREATOR_SUGGESTIONS } from '../data/mockData'
import type { OcWork } from '../types'

interface RegistrationFormProps {
  works: OcWork[]
}

interface ShareTarget {
  id: string
  nickname: string
  avatarUrl: string
  isCustom?: boolean
}

function RegistrationForm({ works }: RegistrationFormProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [remarkMap, setRemarkMap] = useState<Record<string, { title: string; highlight: string }>>({})
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [shareTargets, setShareTargets] = useState<ShareTarget[]>([])
  const [nicknameInput, setNicknameInput] = useState('')
  const [shareFeedback, setShareFeedback] = useState<string | null>(null)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
  const [suggestionVisible, setSuggestionVisible] = useState(false)

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

  const filteredSuggestions = useMemo(() => {
    const keyword = nicknameInput.trim().toLowerCase()
    if (!keyword) {
      return []
    }
    return CREATOR_SUGGESTIONS.filter((suggestion) => {
      if (shareTargets.some((target) => target.id === suggestion.id)) {
        return false
      }
      return suggestion.nickname.toLowerCase().includes(keyword)
    })
  }, [nicknameInput, shareTargets])

  useEffect(() => {
    setActiveSuggestionIndex(0)
  }, [filteredSuggestions.length])

  const handleNicknameInputChange = (value: string) => {
    setNicknameInput(value)
    setShareFeedback(null)
    setSuggestionVisible(Boolean(value.trim()))
  }

  const addShareTarget = (target: ShareTarget) => {
    setShareTargets((prev) => [...prev, target])
    setNicknameInput('')
    setShareFeedback(null)
    setSuggestionVisible(false)
  }

  const handleAddCustomNickname = () => {
    const trimmed = nicknameInput.trim()
    if (!trimmed) {
      return
    }
    if (shareTargets.some((target) => target.nickname === trimmed)) {
      setShareFeedback(`已添加 ${trimmed}，无需重复输入`)
      setNicknameInput('')
      setSuggestionVisible(false)
      return
    }
    addShareTarget({
      id: `custom-${trimmed}`,
      nickname: trimmed,
      avatarUrl: '',
      isCustom: true
    })
  }

  const handleSelectSuggestion = (suggestion: ShareTarget) => {
    addShareTarget(suggestion)
  }

  const handleNicknameKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!filteredSuggestions.length) {
      if (event.key === 'Enter') {
        event.preventDefault()
        handleAddCustomNickname()
      }
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSuggestionVisible(true)
      setActiveSuggestionIndex((prev) => (prev + 1) % filteredSuggestions.length)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSuggestionVisible(true)
      setActiveSuggestionIndex((prev) =>
        prev - 1 < 0 ? filteredSuggestions.length - 1 : prev - 1
      )
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSelectSuggestion(filteredSuggestions[activeSuggestionIndex])
      return
    }
    if (event.key === 'Escape') {
      setSuggestionVisible(false)
    }
  }

  const handleRemoveNickname = (targetId: string) => {
    setShareTargets((prev) => prev.filter((item) => item.id !== targetId))
  }

  const handleShare = () => {
    if (!shareTargets.length) {
      setShareFeedback('请至少输入一个需要通知的昵称')
      return
    }
    const nicknames = shareTargets.map((target) => target.nickname)
    setShareFeedback(`已通过站内消息通知 ${nicknames.join('、')}，祝你比赛顺利！`)
    setShareTargets([])
  }

  const handleCloseModal = () => {
    setSuccessModalVisible(false)
    setShareTargets([])
    setNicknameInput('')
    setShareFeedback(null)
    setSuggestionVisible(false)
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
                    <div className='share-nickname-input-field'>
                      <input
                        type='text'
                        value={nicknameInput}
                        onChange={(event) => handleNicknameInputChange(event.target.value)}
                        onKeyDown={handleNicknameKeyDown}
                        onFocus={() => setSuggestionVisible(Boolean(filteredSuggestions.length))}
                        onBlur={() => setTimeout(() => setSuggestionVisible(false), 120)}
                        placeholder='输入昵称后回车，支持多个'
                        aria-autocomplete='list'
                        aria-expanded={suggestionVisible}
                        aria-activedescendant={
                          suggestionVisible && filteredSuggestions.length
                            ? filteredSuggestions[activeSuggestionIndex].id
                            : undefined
                        }
                      />
                      {suggestionVisible && filteredSuggestions.length > 0 && (
                        <ul className='share-suggestion-panel' role='listbox'>
                          {filteredSuggestions.map((suggestion, index) => (
                            <li
                              key={suggestion.id}
                              id={suggestion.id}
                              className={`share-suggestion-item${
                                index === activeSuggestionIndex ? ' is-active' : ''
                              }`}
                              role='option'
                              aria-selected={index === activeSuggestionIndex}
                            >
                              <button
                                type='button'
                                onMouseDown={(event) => {
                                  event.preventDefault()
                                  handleSelectSuggestion(suggestion)
                                }}
                              >
                                <img src={suggestion.avatarUrl} alt='' className='share-suggestion-avatar' />
                                <span>{suggestion.nickname}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button type='button' onClick={handleAddCustomNickname}>
                      添加
                    </button>
                  </div>
                </label>
                {shareTargets.length > 0 && (
                  <ul className='share-nickname-list'>
                    {shareTargets.map((target) => (
                      <li key={target.id}>
                        {target.avatarUrl ? (
                          <img
                            src={target.avatarUrl}
                            alt=''
                            className='share-nickname-avatar'
                            aria-hidden='true'
                          />
                        ) : (
                          <span className='share-nickname-placeholder' aria-hidden='true'>
                            {target.nickname.slice(0, 1)}
                          </span>
                        )}
                        <span>{target.nickname}</span>
                        <button
                          type='button'
                          onClick={() => handleRemoveNickname(target.id)}
                          aria-label={`移除 ${target.nickname}`}
                        >
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


