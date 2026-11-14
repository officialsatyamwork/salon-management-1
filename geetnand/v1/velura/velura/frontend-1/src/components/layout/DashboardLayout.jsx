import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Info } from 'lucide-react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { LIVE_MODULES, MODULE_RELEASE } from '../../store/auth'

const titles = {
  '/dashboard': 'Dashboard',
  '/dashboard/appointments': 'Appointments',
  '/dashboard/customers': 'Customers',
  '/dashboard/billing': 'Billing & POS',
  '/dashboard/staff': 'Staff Management',
  '/dashboard/services': 'Services',
  '/dashboard/inventory': 'Inventory',
  '/dashboard/membership': 'Membership & Loyalty',
  '/dashboard/marketing': 'Marketing',
  '/dashboard/reports': 'Reports & Analytics',
  '/dashboard/branches': 'Branch Management',
  '/dashboard/settings': 'Settings',
}

export default function DashboardLayout() {
  // On phones the sidebar starts as the narrow icon rail so content has room.
  const [collapsed, setCollapsed] = useState(() => window.matchMedia('(max-width: 767px)').matches)
  const location = useLocation()
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = e => setCollapsed(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  const moduleKey = location.pathname.split('/')[2] || 'dashboard'
  const isPreview = !LIVE_MODULES.has(moduleKey) && MODULE_RELEASE[moduleKey]

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0b0e18' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title={titles[location.pathname] || 'Dashboard'} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {isPreview && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-[13px]"
              style={{ background: 'rgba(201,151,58,0.08)', border: '1px solid rgba(201,151,58,0.2)', color: '#e8c97a' }}>
              <Info size={15} className="flex-shrink-0" />
              Preview with sample data. This module goes live in {MODULE_RELEASE[moduleKey]}; changes here are not saved.
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
