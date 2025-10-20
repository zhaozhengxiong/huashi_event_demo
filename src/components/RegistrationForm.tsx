import { useEffect, useMemo, useRef, useState } from 'react'
import type { OcWork } from '../types'

interface RegistrationFormProps {
  works: OcWork[]
}

interface SubmissionLink {
  workId: string
  shareLink: string
}

function RegistrationForm({ works }: RegistrationFormProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [remarkMap, setRemarkMap] = useState<Record<string, { title: string; highlight: string }>>({})
  const [submissionLinks, setSubmissionLinks] = useState<SubmissionLink[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const copyTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimer.current) {
        window.clearTimeout(copyTimer.current)
      }
    }
  }, [])

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
    const newLinks = selectedIds.map((id) => ({
      workId: id,
      shareLink: `https://oc.example.com/match/${id}`
    }))
    setSubmissionLinks(newLinks)
  }

  const handleCopy = async (link: string, workId: string) => {
    try {
      await navigator.clipboard.writeText(link)
    } catch (error) {
      console.warn('复制失败，已尝试保留文本', error)
    }
    if (copyTimer.current) {
      window.clearTimeout(copyTimer.current)
    }
    setCopiedId(workId)
    copyTimer.current = window.setTimeout(() => {
      setCopiedId(null)
      copyTimer.current = null
    }, 2000)
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
      {submissionLinks.length > 0 && (
        <aside className='submission-result'>
          <h3>报名成功，分享你的链接</h3>
          <ul>
            {submissionLinks.map((item) => {
              const work = works.find((w) => w.id === item.workId)
              const isCopied = copiedId === item.workId
              return (
                <li key={item.workId}>
                  <strong>{work?.title ?? '未知作品'}</strong>
                  <span>{item.shareLink}</span>
                  <button type='button' onClick={() => handleCopy(item.shareLink, item.workId)}>
                    {isCopied ? '已复制' : '复制'}
                  </button>
                </li>
              )
            })}
          </ul>
          <p>复制分享卡发送给朋友，邀请他们关注你的对阵。</p>
        </aside>
      )}
    </section>
  )
}

export default RegistrationForm


