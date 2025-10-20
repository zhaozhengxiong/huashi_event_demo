import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ShippingInfo } from '../types'

interface ShippingModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: (info: ShippingInfo) => void
}

function ShippingModal({ visible, onClose, onSubmit }: ShippingModalProps) {
  const [form, setForm] = useState<ShippingInfo>({ name: '', phone: '', address: '' })

  if (!visible) {
    return null
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <div className='modal-mask'>
      <div className='modal'>
        <header>
          <h3>填写收件信息</h3>
          <button type='button' className='ghost-button' onClick={onClose}>
            关闭
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <label>
            收件人
            <input
              type='text'
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </label>
          <label>
            联系电话
            <input
              type='tel'
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              required
            />
          </label>
          <label>
            收件地址
            <textarea
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
              required
              rows={3}
            />
          </label>
          <button type='submit'>提交</button>
        </form>
      </div>
    </div>
  )
}

export default ShippingModal
