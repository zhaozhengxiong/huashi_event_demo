import { useState } from 'react'
import type { Match } from '../types'

interface PkNumberSearchProps {
  matches: Match[]
  onNavigate: (pkNumber: string) => void
  className?: string
}

function PkNumberSearch({ matches, onNavigate, className }: PkNumberSearchProps) {
  const [input, setInput] = useState('')
  const [notFound, setNotFound] = useState(false)

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (!trimmed) {
      return
    }
    const target = matches.find((match) => match.pkNumber.toLowerCase() === trimmed.toLowerCase())
    if (target) {
      setNotFound(false)
      onNavigate(target.pkNumber)
      setInput('')
      return
    }
    setNotFound(true)
  }

  return (
    <div className={`pk-search${className ? ` ${className}` : ''}`}>
      <input
        type='text'
        placeholder='输入 PK 号码直达'
        value={input}
        onChange={(event) => {
          setInput(event.target.value)
          if (notFound) {
            setNotFound(false)
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            handleSubmit()
          }
        }}
        aria-label='输入 PK 号码直达'
      />
      <button type='button' onClick={handleSubmit}>
        前往
      </button>
      {notFound && <span className='pk-search-feedback'>未找到对应的 PK 号码</span>}
    </div>
  )
}

export default PkNumberSearch
