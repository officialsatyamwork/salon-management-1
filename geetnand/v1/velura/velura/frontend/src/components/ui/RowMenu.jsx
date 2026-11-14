import { useEffect, useRef, useState } from 'react'
import { MoreVertical } from 'lucide-react'

// Kebab menu rendered with fixed positioning so it isn't clipped by
// scrollable table containers.
export default function RowMenu({ items, label = 'Actions' }) {
  const [pos, setPos] = useState(null)
  const btn = useRef(null)
  const menu = useRef(null)

  useEffect(() => {
    if (!pos) return
    const close = e => {
      if (e.type === 'keydown' && e.key !== 'Escape') return
      if (e.type === 'pointerdown' && (menu.current?.contains(e.target) || btn.current?.contains(e.target))) return
      setPos(null)
    }
    const events = ['pointerdown', 'keydown', 'resize']
    events.forEach(ev => window.addEventListener(ev, close))
    window.addEventListener('scroll', close, true)
    return () => {
      events.forEach(ev => window.removeEventListener(ev, close))
      window.removeEventListener('scroll', close, true)
    }
  }, [pos])

  const toggle = () => {
    if (pos) { setPos(null); return }
    const r = btn.current.getBoundingClientRect()
    const openUp = r.bottom + 260 > window.innerHeight
    setPos({ right: window.innerWidth - r.right, ...(openUp ? { bottom: window.innerHeight - r.top + 4 } : { top: r.bottom + 4 }) })
  }

  return (
    <>
      <button ref={btn} onClick={toggle} aria-label={label} aria-expanded={!!pos}
        className={`w-8 h-8 rounded-lg inline-flex items-center justify-center transition-colors ${pos ? 'bg-fg/10 text-fg' : 'text-fg-muted hover:text-fg hover:bg-fg/5'}`}>
        <MoreVertical size={16} />
      </button>
      {pos && (
        <div ref={menu} role="menu" className="fixed z-50 min-w-[180px] p-1.5 rounded-xl border border-line"
          style={{ ...pos, background: 'var(--panel)', boxShadow: '0 16px 48px var(--shadow)' }}>
          {items.map(item => (
            <button key={item.label} role="menuitem" onClick={() => { setPos(null); item.onClick() }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-left transition-colors
                ${item.danger ? 'text-red-400 hover:bg-red-500/10' : 'text-fg-2 hover:text-fg hover:bg-fg/5'}`}>
              <item.icon size={15} /> {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
