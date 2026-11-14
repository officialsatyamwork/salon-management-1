import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Crown, Building2, Store, ClipboardList, Scissors, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from '../../store/auth'

const PASSWORD = 'Velura@123'

export const DEMO_WORKSPACES = [
  {
    role: 'master_admin',
    email: 'owner@glowsalon.com',
    title: 'Master Admin',
    text: 'Every salon, network revenue, and who can sign in.',
    icon: Crown,
    accent: '#e8c97a',
  },
  {
    role: 'super_admin',
    email: 'admin@glowsalon.com',
    title: 'Super Admin',
    text: 'Assigned salons, a salon switcher, and revenue.',
    icon: Building2,
    accent: '#c4b5fd',
  },
  {
    role: 'admin',
    email: 'salonadmin@glowsalon.com',
    title: 'Admin',
    text: 'One salon. Full desk, including this branch’s revenue.',
    icon: Store,
    accent: '#67e8f9',
  },
  {
    role: 'manager',
    email: 'manager@glowsalon.com',
    title: 'Manager',
    text: 'Today’s floor and the team. Revenue stays hidden.',
    icon: ClipboardList,
    accent: '#6ee7b7',
  },
  {
    role: 'staff',
    email: 'riya@glowsalon.com',
    title: 'Staff',
    text: 'Your chair, commission, and the next 7 days.',
    icon: Scissors,
    accent: '#f9a8d4',
  },
]

export default function RoleWorkspaces() {
  const login = useAuth(s => s.login)
  const navigate = useNavigate()
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')

  const enter = async (workspace) => {
    setBusy(workspace.role)
    setError('')
    try {
      await login(workspace.email, PASSWORD)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Could not open this workspace')
      setBusy('')
    }
  }

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: '#c9973a' }}>
        Demo workspaces
      </p>
      <h2 className="text-xl font-bold text-white mb-1">Sign in as a role</h2>
      <p className="text-gray-500 text-sm mb-4">Each card opens that role’s own dashboard. No password to type.</p>
      <div className="space-y-2.5">
        {DEMO_WORKSPACES.map(workspace => {
          const Icon = workspace.icon
          const loading = busy === workspace.role
          return (
            <button
              key={workspace.role}
              type="button"
              onClick={() => enter(workspace)}
              disabled={Boolean(busy)}
              className="w-full text-left rounded-2xl p-3.5 flex items-center gap-3 transition-all disabled:opacity-70 hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${workspace.accent}22` }}>
                {loading ? <Loader2 size={18} className="animate-spin" style={{ color: workspace.accent }} /> : <Icon size={18} style={{ color: workspace.accent }} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-semibold text-white">{workspace.title}</span>
                <span className="block text-[12px] leading-snug mt-0.5" style={{ color: workspace.accent }}>{workspace.email}</span>
                <span className="block text-[12px] text-gray-500 leading-snug mt-0.5">{workspace.text}</span>
              </span>
              <ArrowRight size={15} className="text-gray-600 flex-shrink-0" />
            </button>
          )
        })}
      </div>
      {error && (
        <p role="alert" className="text-red-400 text-xs mt-3">{error}</p>
      )}
    </div>
  )
}
