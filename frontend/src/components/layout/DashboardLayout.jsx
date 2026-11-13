import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

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
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0b0e18' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title={titles[location.pathname] || 'Dashboard'} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
