import { Link, useLocation } from 'react-router-dom'
import {
  Sparkles, LayoutDashboard, Calendar, Users, CreditCard,
  UserCheck, Scissors, Package, Star, Megaphone, BarChart3,
  GitBranch, Settings, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react'

const groups = [
  {
    label: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    ]
  },
  {
    label: 'Operations',
    items: [
      { icon: Calendar, label: 'Appointments', path: '/dashboard/appointments' },
      { icon: Users, label: 'Customers', path: '/dashboard/customers' },
      { icon: CreditCard, label: 'Billing & POS', path: '/dashboard/billing' },
      { icon: UserCheck, label: 'Staff', path: '/dashboard/staff' },
    ]
  },
  {
    label: 'Catalogue',
    items: [
      { icon: Scissors, label: 'Services', path: '/dashboard/services' },
      { icon: Package, label: 'Inventory', path: '/dashboard/inventory' },
    ]
  },
  {
    label: 'Growth',
    items: [
      { icon: Star, label: 'Membership', path: '/dashboard/membership' },
      { icon: Megaphone, label: 'Marketing', path: '/dashboard/marketing' },
      { icon: BarChart3, label: 'Reports', path: '/dashboard/reports' },
    ]
  },
  {
    label: 'Business',
    items: [
      { icon: GitBranch, label: 'Branches', path: '/dashboard/branches' },
      { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ]
  },
]

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation()

  return (
    <aside
      className={`${collapsed ? 'w-[64px]' : 'w-[220px]'} transition-all duration-300 ease-in-out flex flex-col h-screen sticky top-0 flex-shrink-0`}
      style={{ background: '#0c0f1a', borderRight: '1px solid rgba(201,151,58,0.1)' }}
    >
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'justify-center px-0' : 'justify-between px-4'} py-[18px]`}
        style={{ borderBottom: '1px solid rgba(201,151,58,0.1)' }}>
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #c9973a, #a87828)' }}>
              <Sparkles size={15} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-[15px] tracking-tight">Velura</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #c9973a, #a87828)' }}>
            <Sparkles size={15} className="text-white" />
          </div>
        )}
        {!collapsed && (
          <button onClick={() => setCollapsed(true)}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-all">
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {collapsed && (
        <button onClick={() => setCollapsed(false)}
          className="flex justify-center py-2.5 text-gray-600 hover:text-gray-300 transition-colors">
          <ChevronRight size={14} />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {groups.map((group, gi) => (
          <div key={group.label} className={gi > 0 ? 'mt-4' : ''}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-gray-600">
                {group.label}
              </p>
            )}
            {group.items.map(item => {
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 mb-0.5 ${
                    active
                      ? 'nav-active'
                      : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <item.icon
                    size={16}
                    className="flex-shrink-0"
                    style={active ? { color: '#c9973a' } : {}}
                  />
                  {!collapsed && (
                    <span className="text-[13px] font-medium" style={active ? { color: '#e8c97a' } : {}}>
                      {item.label}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User / Logout */}
      <div className="px-2 py-3" style={{ borderTop: '1px solid rgba(201,151,58,0.1)' }}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #c9973a, #e8c97a)', color: '#0b0e18' }}>
              G
            </div>
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-white truncate leading-tight">Glow Salon</p>
              <p className="text-[11px] text-gray-500 leading-tight">Owner</p>
            </div>
          </div>
        )}
        <Link to="/login"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/8 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <LogOut size={15} />
          {!collapsed && <span className="text-[13px] font-medium">Logout</span>}
        </Link>
      </div>
    </aside>
  )
}
