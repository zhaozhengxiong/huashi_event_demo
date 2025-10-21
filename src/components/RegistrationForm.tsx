import { useMemo, useState } from 'react'
import type { OcWork } from '../types'
import ShareInviteForm from './ShareInviteForm'

interface RegistrationFormProps {
  works: OcWork[]
}

function RegistrationForm({ works }: RegistrationFormProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [remarkMap, setRemarkMap] = useState<Record<string, { title: string; highlight: string }>>({})
  const [successModalVisible, setSuccessModalVisible] = useState(false)
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
  }

  const handleCloseModal = () => {
    setSuccessModalVisible(false)
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
              <ShareInviteForm
                successMessage={(nicknames) =>
                  `已通过站内消息通知 ${nicknames.join('、')}，祝你比赛顺利！`
                }
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default RegistrationForm


