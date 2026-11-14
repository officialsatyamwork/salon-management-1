import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Clock, Phone, Scissors, UserRound, IndianRupee, Play, Check, X } from 'lucide-react'
import { TONES, inr } from '../../components/dashboard/chart'
import { Modal, Field, TextInput, Select, ModalActions } from '../../components/ui/Modal'
import {
  BRANCH_STAFF, SERVICES, OPEN_HOUR, CLOSE_HOUR,
  buildAppointments, dateKey, startOfWeek, fmtTime,
} from '../../data/branchOps'

const HOUR_H = 60
const HOURS = Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, i) => OPEN_HOUR + i)
const GRID_H = HOURS.length * HOUR_H
const BOOKABLE = BRANCH_STAFF.filter(s => s.services.length)
const staffById = Object.fromEntries(BRANCH_STAFF.map(s => [s.id, s]))

const STATUS = {
  confirmed: ['Upcoming', 'amber'],
  ongoing: ['In progress', 'blue'],
  completed: ['Completed', 'green'],
  cancelled: ['Cancelled', 'red'],
}

const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
const dayLabel = d => d.toLocaleDateString('en-IN', { weekday: 'short' })
const fullDate = d => d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

// Splits overlapping bookings in one column into side-by-side lanes.
function layoutLanes(items) {
  const sorted = [...items].sort((a, b) => a.start - b.start || b.duration - a.duration)
  const out = []
  let cluster = [], laneEnds = [], clusterEnd = -Infinity
  const flush = () => { cluster.forEach(c => out.push({ ...c, lanes: laneEnds.length })); cluster = []; laneEnds = [] }
  for (const a of sorted) {
    if (cluster.length && a.start >= clusterEnd) { flush(); clusterEnd = -Infinity }
    let lane = laneEnds.findIndex(end => end <= a.start)
    if (lane === -1) { lane = laneEnds.length; laneEnds.push(0) }
    laneEnds[lane] = a.start + a.duration
    clusterEnd = Math.max(clusterEnd, a.start + a.duration)
    cluster.push({ ...a, lane })
  }
  flush()
  return out
}

function Block({ a, compact, onOpen }) {
  const staff = staffById[a.staffId]
  const color = TONES[staff.tone]
  const top = ((a.start - OPEN_HOUR * 60) / 60) * HOUR_H
  const height = Math.max(22, (a.duration / 60) * HOUR_H - 3)
  const width = 100 / (a.lanes || 1)
  return (
    <button onClick={e => { e.stopPropagation(); onOpen(a) }}
      className={`absolute rounded-lg px-2 py-1 text-left overflow-hidden transition-all hover:z-10 hover:shadow-lg ${a.status === 'cancelled' ? 'opacity-50' : ''}`}
      style={{
        top: top + 1, height, left: `calc(${(a.lane || 0) * width}% + 2px)`, width: `calc(${width}% - 4px)`,
        background: `${color}${a.status === 'completed' ? '14' : '24'}`, borderLeft: `3px solid ${color}`,
      }}>
      <p className={`text-[11px] font-semibold text-fg truncate ${a.status === 'cancelled' ? 'line-through' : ''}`}>{a.customer}</p>
      {height > 34 && <p className="text-[10.5px] text-fg-2 truncate">{a.service}{compact ? '' : ` · ${fmtTime(a.start)}`}</p>}
      {height > 52 && compact && <p className="text-[10.5px] text-fg-muted truncate">{staff.name.split(' ')[0]}</p>}
    </button>
  )
}

function DetailsModal({ appointment: a, onUpdate, onClose }) {
  const staff = staffById[a.staffId]
  const [label, tone] = STATUS[a.status]
  const set = status => { onUpdate(a.id, status); onClose() }
  return (
    <Modal title={a.customer} subtitle={`${a.service} with ${staff.name}`} onClose={onClose}>
      <span className="badge mb-4" style={{ background: `${TONES[tone]}1f`, color: TONES[tone] }}>{label}</span>
      <ul className="space-y-2.5 text-[13px] mb-5">
        {[
          [Clock, `${new Date(a.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · ${fmtTime(a.start)} – ${fmtTime(a.start + a.duration)}`],
          [Scissors, `${a.service} · ${a.duration} min`],
          [UserRound, `${staff.name} (${staff.role})`],
          [Phone, a.phone],
          [IndianRupee, inr.format(a.price)],
        ].map(([Icon, text]) => (
          <li key={text} className="flex items-center gap-3 text-fg"><Icon size={15} className="text-fg-muted flex-shrink-0" />{text}</li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        {a.status === 'confirmed' && (
          <button onClick={() => set('ongoing')} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center gap-1.5"><Play size={14} /> Start</button>
        )}
        {['confirmed', 'ongoing'].includes(a.status) && (
          <>
            <button onClick={() => set('completed')} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-1.5"><Check size={14} /> Complete</button>
            <button onClick={() => set('cancelled')} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-line text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-1.5"><X size={14} /> Cancel</button>
          </>
        )}
        {['completed', 'cancelled'].includes(a.status) && (
          <button onClick={onClose} className="flex-1 glass py-2.5 rounded-xl text-fg-2 text-sm font-medium">Close</button>
        )}
      </div>
    </Modal>
  )
}

function BookModal({ initial, onBook, onClose }) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }
  const staffForService = BOOKABLE.filter(s => s.services.includes(form.service))

  const submit = ev => {
    ev.preventDefault()
    const e = {}
    if (!form.customer.trim()) e.customer = 'Required'
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a 10-digit number'
    if (!form.staffId) e.staffId = 'Pick a staff member'
    if (Object.keys(e).length) { setErrors(e); return }
    const service = SERVICES.find(s => s.name === form.service)
    const [h, m] = form.time.split(':').map(Number)
    onBook({ ...form, customer: form.customer.trim(), start: h * 60 + m, duration: service.duration, price: service.price, status: 'confirmed' })
    onClose()
  }

  return (
    <Modal title="Book appointment" onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Customer" error={errors.customer} className="col-span-2">
            <TextInput value={form.customer} onChange={e => set('customer', e.target.value)} error={errors.customer} placeholder="Full name" autoFocus />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <TextInput value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} error={errors.phone} placeholder="10-digit number" />
          </Field>
          <Field label="Service">
            <Select value={form.service} onChange={e => {
              const service = e.target.value
              setForm(f => ({ ...f, service, staffId: BOOKABLE.find(s => s.id === f.staffId)?.services.includes(service) ? f.staffId : '' }))
            }}>
              {SERVICES.map(s => <option key={s.name} value={s.name}>{s.name} · {s.duration} min · ₹{s.price}</option>)}
            </Select>
          </Field>
          <Field label="Staff" error={errors.staffId} className="col-span-2">
            <Select value={form.staffId} onChange={e => set('staffId', e.target.value)} error={errors.staffId}>
              <option value="">Select staff</option>
              {staffForService.map(s => <option key={s.id} value={s.id}>{s.name} · {s.role}</option>)}
            </Select>
          </Field>
          <Field label="Date">
            <TextInput type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          </Field>
          <Field label="Time">
            <TextInput type="time" step={900} min={`${OPEN_HOUR}:00`} max={`${CLOSE_HOUR - 1}:30`} value={form.time} onChange={e => set('time', e.target.value)} />
          </Field>
        </div>
        <ModalActions onCancel={onClose} submitLabel="Book" />
      </form>
    </Modal>
  )
}

export default function CalendarPage() {
  const [now] = useState(() => new Date())
  const [appointments, setAppointments] = useState(() => buildAppointments(now))
  const [cursor, setCursor] = useState(now)
  const [view, setView] = useState('day')
  const [hidden, setHidden] = useState([])
  const [open, setOpen] = useState(null)
  const [booking, setBooking] = useState(null)

  const days = view === 'day' ? [cursor] : Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(cursor), i))
  const keys = days.map(dateKey)
  const visibleStaff = BOOKABLE.filter(s => !hidden.includes(s.id))
  const inRange = appointments.filter(a => keys.includes(a.date) && !hidden.includes(a.staffId))
  const todayKey = dateKey(now)
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const nowTop = ((nowMin - OPEN_HOUR * 60) / 60) * HOUR_H
  const showNow = nowMin >= OPEN_HOUR * 60 && nowMin <= CLOSE_HOUR * 60

  const step = dir => setCursor(c => addDays(c, dir * (view === 'day' ? 1 : 7)))
  const title = view === 'day' ? fullDate(cursor)
    : `${days[0].toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${days[6].toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`

  const toggleStaff = id => setHidden(h => h.includes(id) ? h.filter(x => x !== id) : [...h, id])
  const update = (id, status) => setAppointments(list => list.map(a => a.id === id ? { ...a, status } : a))
  const book = a => setAppointments(list => [...list, { ...a, id: Date.now() }])

  const slotClick = (e, date, staffId = '') => {
    const y = e.clientY - e.currentTarget.getBoundingClientRect().top
    const min = Math.min((CLOSE_HOUR - 1) * 60 + 30, OPEN_HOUR * 60 + Math.floor(y / (HOUR_H / 2)) * 30)
    const staff = staffById[staffId]
    setBooking({
      customer: '', phone: '', date: dateKey(date), staffId,
      service: staff ? staff.services[0] : SERVICES[0].name,
      time: `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`,
    })
  }

  const stats = [
    ['Bookings', inRange.filter(a => a.status !== 'cancelled').length],
    ['Completed', inRange.filter(a => a.status === 'completed').length],
    ['Upcoming', inRange.filter(a => ['confirmed', 'ongoing'].includes(a.status)).length],
    ['Booked value', inr.format(inRange.filter(a => a.status !== 'cancelled').reduce((s, a) => s + a.price, 0))],
  ]

  const columns = view === 'day'
    ? visibleStaff.map(s => ({ key: s.id, date: cursor, staffId: s.id, items: inRange.filter(a => a.staffId === s.id) }))
    : days.map(d => ({ key: dateKey(d), date: d, items: inRange.filter(a => a.date === dateKey(d)) }))

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setCursor(now)} className="btn-ghost px-3.5 py-2 rounded-xl text-[13px] font-medium">Today</button>
          <div className="flex">
            <button onClick={() => step(-1)} aria-label="Previous" className="w-9 h-9 rounded-l-xl border border-line flex items-center justify-center text-fg-2 hover:text-fg hover:bg-fg/5"><ChevronLeft size={16} /></button>
            <button onClick={() => step(1)} aria-label="Next" className="w-9 h-9 rounded-r-xl border border-l-0 border-line flex items-center justify-center text-fg-2 hover:text-fg hover:bg-fg/5"><ChevronRight size={16} /></button>
          </div>
          <h2 className="text-[16px] sm:text-[18px] font-bold text-fg ml-1">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-xl bg-fg/5">
            {[['day', 'Day'], ['week', 'Week']].map(([k, label]) => (
              <button key={k} onClick={() => setView(k)}
                className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${view === k ? 'bg-violet-600 text-white' : 'text-fg-2 hover:text-fg'}`}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={() => setBooking({ customer: '', phone: '', date: dateKey(cursor), staffId: '', service: SERVICES[0].name, time: '11:00' })}
            className="btn-primary px-3.5 py-2 rounded-xl text-[13px] flex items-center gap-1.5">
            <Plus size={15} /> <span className="hidden sm:inline">Book</span>
          </button>
        </div>
      </div>

      {/* Summary + staff filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {BOOKABLE.map(s => {
            const off = hidden.includes(s.id)
            return (
              <button key={s.id} onClick={() => toggleStaff(s.id)} aria-pressed={!off}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[12.5px] font-medium border transition-all ${off ? 'border-line text-fg-muted opacity-60' : 'border-transparent text-fg'}`}
                style={off ? undefined : { background: `${TONES[s.tone]}1f` }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: off ? 'var(--text-muted)' : TONES[s.tone] }} />
                {s.name.split(' ')[0]}
              </button>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12.5px]">
          {stats.map(([k, v]) => <span key={k} className="text-fg-muted">{k} <span className="font-semibold text-fg">{v}</span></span>)}
        </div>
      </div>

      {/* Grid */}
      <div className="glass-card rounded-2xl overflow-x-auto">
        <div style={{ minWidth: view === 'day' ? Math.max(560, columns.length * 150 + 64) : 820 }}>
          {/* Column headers */}
          <div className="flex border-b border-line sticky top-0 z-20" style={{ background: 'var(--card-bg)' }}>
            <div className="w-16 flex-shrink-0" />
            {columns.map(c => {
              const staff = c.staffId && staffById[c.staffId]
              const isToday = dateKey(c.date) === todayKey
              return (
                <div key={c.key} className="flex-1 min-w-0 px-2 py-3 text-center border-l border-line">
                  {staff ? (
                    <>
                      <p className="text-[13px] font-semibold text-fg truncate flex items-center justify-center gap-1.5">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: TONES[staff.tone] }} />{staff.name}
                      </p>
                      <p className="text-[11px] text-fg-muted">{c.items.filter(a => a.status !== 'cancelled').length} bookings</p>
                    </>
                  ) : (
                    <>
                      <p className="text-[11px] uppercase tracking-wider text-fg-muted">{dayLabel(c.date)}</p>
                      <p className={`text-[18px] font-bold mx-auto w-9 h-9 rounded-full flex items-center justify-center ${isToday ? 'bg-violet-600 text-white' : 'text-fg'}`}>{c.date.getDate()}</p>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* Time grid */}
          <div className="flex relative">
            <div className="w-16 flex-shrink-0">
              {HOURS.map(h => (
                <div key={h} className="relative text-[11px] text-fg-muted text-right pr-2" style={{ height: HOUR_H }}>
                  <span className="relative -top-2">{fmtTime(h * 60).replace(':00', '')}</span>
                </div>
              ))}
            </div>
            {columns.map(c => {
              const isToday = dateKey(c.date) === todayKey
              const items = view === 'week' ? layoutLanes(c.items) : c.items.map(a => ({ ...a, lane: 0, lanes: 1 }))
              return (
                <div key={c.key} onClick={e => slotClick(e, c.date, c.staffId)}
                  className={`flex-1 min-w-0 relative border-l border-line cursor-pointer ${isToday && view === 'week' ? 'bg-violet-500/[0.03]' : ''}`}
                  style={{ height: GRID_H, backgroundImage: `repeating-linear-gradient(to bottom, var(--border) 0, var(--border) 1px, transparent 1px, transparent ${HOUR_H / 2}px)` }}>
                  {items.map(a => <Block key={a.id} a={a} compact={view === 'week'} onOpen={setOpen} />)}
                  {isToday && showNow && (
                    <div className="absolute left-0 right-0 z-10 pointer-events-none" style={{ top: nowTop }}>
                      <div className="h-[2px] bg-red-500" />
                      <span className="absolute -left-1 -top-[4px] w-2.5 h-2.5 rounded-full bg-red-500" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {open && <DetailsModal appointment={appointments.find(a => a.id === open.id)} onUpdate={update} onClose={() => setOpen(null)} />}
      {booking && <BookModal initial={booking} onBook={book} onClose={() => setBooking(null)} />}
    </div>
  )
}
