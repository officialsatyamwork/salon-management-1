import { Bell, Search, Store } from 'lucide-react'
import { useAuth, ROLE_LABELS } from '../../store/auth'

export default function TopBar({ title }) {
  const user = useAuth(s => s.user)
  const salonId = useAuth(s => s.salonId)
  const setSalon = useAuth(s => s.setSalon)
  const salons = user?.salons || []
  // The spec's salon switcher: owners and admins with more than one salon, plus "All my salons".
  const showSwitcher = ['master_admin', 'super_admin'].includes(user?.role) && salons.length > 1
  const initial = (user?.fullName?.[0] || '?').toUpperCase()

  return (
    <header
      className="h-[60px] flex items-center justify-between px-6 sticky top-0 z-30 flex-shrink-0"
      style={{
        background: 'rgba(12,15,26,0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201,151,58,0.1)',
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-[15px] font-semibold text-white tracking-tight truncate">{title}</h1>
        {showSwitcher && (
          <label className="flex items-center gap-1.5 text-[12.5px] text-gray-400">
            <Store size={13} />
            <span className="sr-only">Salon</span>
            <select
              value={salonId || ''}
              onChange={e => setSalon(e.target.value || null)}
              className="input-field py-[5px] pl-2 pr-6 text-[12.5px] rounded-lg max-w-[200px]"
            >
              <option value="" className="bg-[#13131a]">All my salons</option>
              {salons.map(s => <option key={s.id} value={s.id} className="bg-[#13131a]">{s.name}</option>)}
            </select>
          </label>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            placeholder="Search anything..."
            className="input-field pl-8 pr-4 py-[7px] w-52 text-[13px] rounded-xl"
          />
        </div>

        <button className="relative w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all" aria-label="Notifications">
          <Bell size={16} />
        </button>

        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[12px] font-bold"
            style={{ background: 'linear-gradient(135deg, #c9973a, #e8c97a)', color: '#0b0e18' }}
          >
            {initial}
          </div>
          <div className="hidden md:block">
            <p className="text-[12.5px] font-semibold text-white leading-tight">{user?.fullName}</p>
            <p className="text-[11px] text-gray-500 leading-tight">{ROLE_LABELS[user?.role]}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
