import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, CalendarCheck, CalendarX, IndianRupee, PackageMinus, Star, UserCog,
  CheckCheck, X, BellOff, Settings
} from 'lucide-react'
import useDismiss from '../../hooks/useDismiss'

// Sample data until the notifications API exists.
const initialNotifications = [
  { id: 1, type: 'booking', title: 'New booking', body: 'Priya Sharma booked Hair Color with Riya at 4:00 PM', time: '2 min ago', group: 'Today', unread: true },
  { id: 2, type: 'payment', title: 'Payment received', body: '₹2,500 via UPI from Anita Mehta · INV-1042', time: '18 min ago', group: 'Today', unread: true },
  { id: 3, type: 'stock', title: 'Low stock alert', body: "L'Oréal Hair Serum has only 3 units left", time: '1 hr ago', group: 'Today', unread: true },
  { id: 4, type: 'cancel', title: 'Appointment cancelled', body: 'Sonal Joshi cancelled Haircut at 3:30 PM', time: '2 hr ago', group: 'Today', unread: false },
  { id: 5, type: 'review', title: 'New 5-star review', body: '"Loved the facial, Sunita was amazing!" by Kavya Nair', time: 'Yesterday', group: 'Earlier', unread: false },
  { id: 6, type: 'staff', title: 'Leave request', body: 'Meena requested leave for Saturday, 16 Nov', time: 'Yesterday', group: 'Earlier', unread: false },
]

const typeStyle = {
  booking: { icon: CalendarCheck, cls: 'bg-violet-500/15 text-violet-400' },
  payment: { icon: IndianRupee, cls: 'bg-green-500/15 text-green-400' },
  stock: { icon: PackageMinus, cls: 'bg-orange-500/15 text-orange-400' },
  cancel: { icon: CalendarX, cls: 'bg-red-500/15 text-red-400' },
  review: { icon: Star, cls: 'bg-yellow-500/15 text-yellow-400' },
  staff: { icon: UserCog, cls: 'bg-blue-500/15 text-blue-400' },
}

export default function NotificationMenu({ open, onToggle, onClose }) {
  const ref = useRef(null)
  const [items, setItems] = useState(initialNotifications)
  const [tab, setTab] = useState('all')
  useDismiss(ref, open, onClose)

  const unread = items.filter(n => n.unread).length
  const visible = tab === 'unread' ? items.filter(n => n.unread) : items
  const groups = ['Today', 'Earlier']
    .map(g => [g, visible.filter(n => n.group === g)])
    .filter(([, list]) => list.length)

  const markRead = id => setItems(list => list.map(n => n.id === id ? { ...n, unread: false } : n))
  const markAllRead = () => setItems(list => list.map(n => ({ ...n, unread: false })))
  const dismiss = id => setItems(list => list.filter(n => n.id !== id))

  return (
    <div ref={ref} className="sm:relative">
      <button onClick={onToggle} aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`} aria-expanded={open}
        className={`relative w-8 h-8 rounded-xl flex items-center justify-center transition-all
          ${open ? 'text-fg bg-fg/10' : 'text-fg-2 hover:text-fg hover:bg-fg/5'}`}>
        <Bell size={16} />
        <AnimatePresence>
          {unread > 0 && (
            <motion.span key="badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white leading-none"
              style={{ background: 'linear-gradient(135deg, var(--brand-light), var(--brand-dark))', boxShadow: '0 0 0 2px var(--bg)' }}>
              {unread}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            style={{ transformOrigin: 'top right', background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: '0 20px 60px var(--shadow)' }}
            className="absolute left-3 right-3 top-[64px] sm:left-auto sm:right-0 sm:top-full sm:mt-2.5 sm:w-[380px] z-50 rounded-2xl overflow-hidden"
            role="dialog" aria-label="Notifications"
          >
            {/* Header */}
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-[15px] font-semibold text-fg" style={{ fontFamily: 'Inter, sans-serif' }}>Notifications</h2>
                  {unread > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                      style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}>
                      {unread} new
                    </span>
                  )}
                </div>
                <button onClick={markAllRead} disabled={!unread}
                  className="flex items-center gap-1.5 text-[12px] font-medium transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80"
                  style={{ color: 'var(--brand)' }}>
                  <CheckCheck size={14} /> Mark all read
                </button>
              </div>

              {/* Tabs */}
              <div className="mt-3 grid grid-cols-2 gap-1 p-1 rounded-xl bg-fg/5">
                {[['all', 'All', items.length], ['unread', 'Unread', unread]].map(([key, label, count]) => (
                  <button key={key} onClick={() => setTab(key)}
                    className={`py-1.5 rounded-lg text-[12.5px] font-medium transition-all flex items-center justify-center gap-1.5
                      ${tab === key ? 'text-fg shadow-sm' : 'text-fg-muted hover:text-fg-2'}`}
                    style={tab === key ? { background: 'var(--panel)' } : undefined}>
                    {label}
                    <span className={`text-[10.5px] px-1.5 rounded-md ${tab === key ? 'bg-fg/10' : 'bg-fg/5'}`}>{count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="max-h-[min(420px,60vh)] overflow-y-auto border-t border-line">
              {groups.length === 0 ? (
                <div className="py-12 px-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center bg-fg/5 text-fg-muted">
                    <BellOff size={20} />
                  </div>
                  <p className="text-[13.5px] font-semibold text-fg">You're all caught up</p>
                  <p className="text-[12px] text-fg-muted mt-1">
                    {tab === 'unread' ? 'No unread notifications right now.' : 'New activity will show up here.'}
                  </p>
                </div>
              ) : groups.map(([group, list]) => (
                <div key={group}>
                  <p className="section-label px-4 pt-3 pb-1.5">{group}</p>
                  <AnimatePresence initial={false}>
                    {list.map(n => {
                      const { icon: Icon, cls } = typeStyle[n.type]
                      return (
                        <motion.div key={n.id} layout
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
                          className="group relative">
                          <button onClick={() => markRead(n.id)}
                            className="w-full text-left flex gap-3 px-4 py-3 pr-10 hover:bg-fg/[0.04] transition-colors"
                            style={n.unread ? { background: 'linear-gradient(90deg, var(--brand-soft), transparent 70%)' } : undefined}>
                            <span className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cls}`}>
                              <Icon size={16} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className={`block text-[13px] leading-snug ${n.unread ? 'font-semibold text-fg' : 'font-medium text-fg-2'}`}>
                                {n.title}
                              </span>
                              <span className="block text-[12.5px] text-fg-2 leading-snug mt-0.5 line-clamp-2">{n.body}</span>
                              <span className="block text-[11px] text-fg-muted mt-1">{n.time}</span>
                            </span>
                          </button>
                          {n.unread && (
                            <span className="absolute right-4 top-4 w-2 h-2 rounded-full group-hover:opacity-0 transition-opacity"
                              style={{ background: 'var(--brand)' }} />
                          )}
                          <button onClick={() => dismiss(n.id)} aria-label="Dismiss notification"
                            className="absolute right-2.5 top-2.5 w-6 h-6 rounded-lg flex items-center justify-center text-fg-muted hover:text-fg hover:bg-fg/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all">
                            <X size={13} />
                          </button>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Footer */}
            <Link to="/dashboard/settings" onClick={onClose}
              className="flex items-center justify-center gap-2 py-3 text-[12.5px] font-medium text-fg-2 hover:text-fg hover:bg-fg/[0.04] border-t border-line transition-colors">
              <Settings size={13} /> Notification preferences
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
