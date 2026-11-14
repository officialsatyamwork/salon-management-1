import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Eye, Wrench } from 'lucide-react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { useAuth, useScope } from '../../store/auth'
import { usePlatform } from '../../store/platform'

const titles = {
  '/dashboard': 'Dashboard',
  '/dashboard/appointments': 'Appointments',
  '/dashboard/customers': 'Customers',
  '/dashboard/billing': 'Billing & POS',
  '/dashboard/staff': 'Staff & Commission',
  '/dashboard/calendar': 'Calendar',
  '/dashboard/services': 'Services',
  '/dashboard/inventory': 'Inventory',
  '/dashboard/membership': 'Membership & Loyalty',
  '/dashboard/marketing': 'Marketing',
  '/dashboard/reports': 'Reports & Analytics',
  '/dashboard/branches': 'Branch Management',
  '/dashboard/settings': 'Settings',
  '/dashboard/salons': 'Salons',
  '/dashboard/plans': 'Subscription Plans',
  '/dashboard/platform-settings': 'Platform Settings',
}

function titleFor(path) {
  if (titles[path]) return titles[path]
  if (path.startsWith('/dashboard/salons/')) return 'Salon Details'
  if (path.startsWith('/dashboard/branches/')) return 'Branch Dashboard'
  return 'Dashboard'
}

function ImpersonationBanner({ business }) {
  const impersonator = useAuth(s => s.impersonator)
  const stop = useAuth(s => s.stopImpersonating)
  const navigate = useNavigate()
  if (!impersonator) return null
  const exit = () => { stop(); navigate(`/dashboard/salons/${business?.id || ''}`) }
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-[12.5px] text-white"
      style={{ background: 'linear-gradient(90deg, #9a3a54, #c4607a)' }}>
      <Eye size={14} />
      <span>Viewing <strong>{business?.name}</strong> as its owner ({impersonator.name}, Super Admin)</span>
      <button onClick={exit} className="px-2.5 py-0.5 rounded-md bg-white/20 hover:bg-white/30 font-semibold transition-colors">
        Back to platform
      </button>
    </div>
  )
}

function Maintenance({ message }) {
  const logout = useAuth(s => s.logout)
  return (
    <div className="glass-card rounded-2xl p-10 text-center max-w-md mx-auto mt-10">
      <Wrench size={26} className="mx-auto mb-3 text-fg-muted" />
      <h2 className="text-[18px] font-bold text-fg mb-1">Down for maintenance</h2>
      <p className="text-[13px] text-fg-2 mb-5">{message}</p>
      <button onClick={logout} className="btn-ghost px-4 py-2 rounded-xl text-[13px] font-medium">Sign out</button>
    </div>
  )
}

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { user, business } = useScope()
  const impersonator = useAuth(s => s.impersonator)
  const settings = usePlatform(s => s.settings)
  const blocked = settings.maintenanceMode && user.role !== 'super-admin' && !impersonator

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const close = e => { if (e.matches) setMobileOpen(false) }
    desktop.addEventListener('change', close)
    return () => desktop.removeEventListener('change', close)
  }, [])

  return (
    <div className="dashboard flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <ImpersonationBanner business={business} />
      <div className="flex flex-1 min-h-0">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}
          mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <TopBar title={titleFor(location.pathname)} onMenu={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 lg:p-6">
            {blocked ? <Maintenance message={settings.maintenanceMessage} /> : <Outlet />}
          </main>
        </div>
      </div>
    </div>
  )
}
