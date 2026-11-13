import { Bell, Search } from 'lucide-react'

export default function TopBar({ title }) {
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
      <div className="flex items-center gap-3">
        <h1 className="text-[15px] font-semibold text-white tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            placeholder="Search anything..."
            className="input-field pl-8 pr-4 py-[7px] w-52 text-[13px] rounded-xl"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all">
          <Bell size={16} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: '#c9973a' }}
          />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[12px] font-bold"
            style={{ background: 'linear-gradient(135deg, #c9973a, #e8c97a)', color: '#0b0e18' }}
          >
            G
          </div>
          <div className="hidden md:block">
            <p className="text-[12.5px] font-semibold text-white leading-tight">Glow Salon</p>
            <p className="text-[11px] text-gray-500 leading-tight">Owner</p>
          </div>
        </div>
      </div>
    </header>
  )
}
