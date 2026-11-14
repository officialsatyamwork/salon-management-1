import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { ROLES, initials } from '../../store/auth'
import { TONES, inr } from './chart'

function greeting(hour) {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function WelcomeHeader({ user, subtitle, actions }) {
  const [now] = useState(() => new Date())
  const role = ROLES[user.role]
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
            style={{ background: `${role.color}1f`, color: role.color }}>
            {role.label}
          </span>
          <span className="text-[12px] text-fg-muted">
            {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
        <h2 className="text-[22px] sm:text-[24px] font-bold text-fg leading-tight">
          {greeting(now.getHours())}, {user.name.split(' ')[0]}
        </h2>
        {subtitle && <p className="text-[13px] text-fg-2 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function StatCard({ icon: Icon, label, value, change, trend = 'up', tone = 'violet', delay = 0 }) {
  const color = TONES[tone]
  const TrendIcon = trend === 'down' ? ArrowDownRight : ArrowUpRight
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
      className="stat-card">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}1f` }}>
          <Icon size={17} style={{ color }} />
        </div>
        {change && (
          <span className="flex items-center gap-0.5 text-[11.5px] font-medium text-right"
            style={{ color: trend === 'neutral' ? 'var(--text-muted)' : trend === 'down' ? 'var(--danger)' : 'var(--success)' }}>
            {trend !== 'neutral' && <TrendIcon size={11} className="flex-shrink-0" />} {change}
          </span>
        )}
      </div>
      <p className="text-[22px] font-bold text-fg tracking-tight leading-none mb-1">{value}</p>
      <p className="text-[12.5px] text-fg-muted">{label}</p>
    </motion.div>
  )
}

export function Panel({ title, subtitle, action, children, className = '', bodyClassName = 'p-4 sm:p-5 pt-0 sm:pt-0', delay = 0.2 }) {
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className={`glass-card rounded-2xl overflow-hidden flex flex-col ${className}`}>
      <div className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold text-fg" style={{ fontFamily: 'Inter, sans-serif' }}>{title}</h3>
          {subtitle && <p className="text-[12.5px] text-fg-muted mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className={`flex-1 ${bodyClassName}`}>{children}</div>
    </motion.section>
  )
}

export function ChartTooltip({ active, payload, label, format = v => inr.format(v) }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: '0 4px 16px var(--shadow)', borderRadius: 10, padding: '8px 12px' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 99, background: p.color || p.fill }} />
          {payload.length > 1 && <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{p.name}</span>}
          {format(p.value)}
        </p>
      ))}
    </div>
  )
}

const STATUS = {
  completed: ['Completed', 'green'],
  done: ['Done', 'green'],
  ongoing: ['In progress', 'blue'],
  upcoming: ['Upcoming', 'amber'],
  cancelled: ['Cancelled', 'red'],
  active: ['Active', 'green'],
  inactive: ['Inactive', 'gray'],
  suspended: ['Suspended', 'red'],
  pending: ['Pending approval', 'amber'],
  rejected: ['Rejected', 'red'],
  invited: ['Invite sent', 'amber'],
  busy: ['With client', 'violet'],
  available: ['Available', 'green'],
  break: ['On break', 'amber'],
  leave: ['On leave', 'red'],
}

export function StatusPill({ status }) {
  const [label, tone] = STATUS[status]
  const color = TONES[tone]
  return (
    <span className="badge whitespace-nowrap" style={{ background: `${color}1f`, color }}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 inline-block" style={{ background: color }} />
      {label}
    </span>
  )
}

export function Avatar({ name, tone = 'violet', size = 32 }) {
  const color = TONES[tone]
  return (
    <span className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.36, background: `${color}26`, color }}>
      {initials(name)}
    </span>
  )
}

export function Meter({ value, max, tone = 'rose' }) {
  return (
    <div className="h-1.5 rounded-full bg-fg/10 overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: TONES[tone] }} />
    </div>
  )
}
