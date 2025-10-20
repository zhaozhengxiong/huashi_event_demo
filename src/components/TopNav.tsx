import type { ActivityView } from '../types'

interface NavItem {
  view: ActivityView
  label: string
  disabled?: boolean
  badge?: string
}

interface TopNavProps {
  items: NavItem[]
  activeView: ActivityView
  onSelect: (view: ActivityView) => void
}

function TopNav({ items, activeView, onSelect }: TopNavProps) {
  return (
    <nav className='top-nav'>
      {items.map((item) => (
        <button
          key={item.view}
          className={`nav-item${item.view === activeView ? ' is-active' : ''}`}
          onClick={() => onSelect(item.view)}
          disabled={item.disabled}
          type='button'
        >
          <span>{item.label}</span>
          {item.badge && <span className='nav-badge'>{item.badge}</span>}
        </button>
      ))}
    </nav>
  )
}

export default TopNav


