import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { CREATOR_SUGGESTIONS } from '../data/mockData'

interface ShareTarget {
  id: string
  nickname: string
  avatarUrl: string
  isCustom?: boolean
}

interface ShareInviteFormProps {
  label?: string
  addButtonLabel?: string
  shareButtonLabel?: string
  inputPlaceholder?: string
  emptyErrorMessage?: string
  successMessage?: string | ((nicknames: string[]) => string)
  onShareComplete?: (nicknames: string[]) => void
}

const DEFAULT_EMPTY_ERROR = '请至少输入一个需要通知的昵称'
const DEFAULT_SUCCESS_MESSAGE = (nicknames: string[]) =>
  `已通过站内消息通知 ${nicknames.join('、')}，祝你比赛顺利！`

function ShareInviteForm({
  label = '邀请好友',
  addButtonLabel = '添加',
  shareButtonLabel = '分享通知',
  inputPlaceholder = '输入昵称后回车，支持多个',
  emptyErrorMessage = DEFAULT_EMPTY_ERROR,
  successMessage = DEFAULT_SUCCESS_MESSAGE,
  onShareComplete
}: ShareInviteFormProps) {
  const [shareTargets, setShareTargets] = useState<ShareTarget[]>([])
  const [nicknameInput, setNicknameInput] = useState('')
  const [shareFeedback, setShareFeedback] = useState<string | null>(null)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
  const [suggestionVisible, setSuggestionVisible] = useState(false)

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
      setShareFeedback(emptyErrorMessage)
      return
    }
    const nicknames = shareTargets.map((target) => target.nickname)
    const message =
      typeof successMessage === 'function' ? successMessage(nicknames) : successMessage
    setShareFeedback(message)
    setShareTargets([])
    setNicknameInput('')
    setSuggestionVisible(false)
    onShareComplete?.(nicknames)
  }

  return (
    <div className='share-nickname-form'>
      <label>
        {label}
        <div className='share-nickname-input'>
          <div className='share-nickname-input-field'>
            <input
              type='text'
              value={nicknameInput}
              onChange={(event) => handleNicknameInputChange(event.target.value)}
              onKeyDown={handleNicknameKeyDown}
              onFocus={() => setSuggestionVisible(Boolean(filteredSuggestions.length))}
              onBlur={() => setTimeout(() => setSuggestionVisible(false), 120)}
              placeholder={inputPlaceholder}
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
                      {suggestion.avatarUrl && (
                        <img src={suggestion.avatarUrl} alt='' className='share-suggestion-avatar' />
                      )}
                      <span>{suggestion.nickname}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type='button' onClick={handleAddCustomNickname}>
            {addButtonLabel}
          </button>
        </div>
      </label>
      {shareTargets.length > 0 && (
        <ul className='share-nickname-list'>
          {shareTargets.map((target) => (
            <li key={target.id}>
              {target.avatarUrl ? (
                <img src={target.avatarUrl} alt='' className='share-nickname-avatar' aria-hidden='true' />
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
          {shareButtonLabel}
        </button>
      </div>
      {shareFeedback && <p className='share-feedback'>{shareFeedback}</p>}
    </div>
  )
}

export default ShareInviteForm
