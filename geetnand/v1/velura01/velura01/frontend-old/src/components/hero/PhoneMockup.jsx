import { TrendingUp, Users, Receipt, Wifi, Battery, Signal, Home, CalendarDays, BarChart2, MoreHorizontal, Bell, Star } from 'lucide-react'

const branches = [
  { name: 'Bandra W',  value: '₹48.6K', pct: 85, color: '#c4607a' },
  { name: 'Andheri W', value: '₹36.9K', pct: 64, color: '#c9a96e' },
  { name: 'Powai',     value: '₹29.4K', pct: 51, color: '#9a7ab0' },
]

const spark = [28, 45, 35, 58, 48, 70, 56, 78, 64, 88, 72, 92]

const quickStats = [
  { icon: Receipt, val: '142', lbl: 'Bills',       color: '#c4607a' },
  { icon: Users,   val: '31',  lbl: 'New Clients', color: '#c9a96e' },
  { icon: Star,    val: '4.9', lbl: 'Rating',      color: '#9a7ab0' },
]

export default function PhoneMockup() {
  return (
    <div className="phone-outer">
      <div className="phone-frame">
        <div className="phone-shine" />
        <div className="phone-btn-vol-up" />
        <div className="phone-btn-vol-dn" />
        <div className="phone-btn-power" />

        <div className="phone-screen">
          {/* Status bar */}
          <div className="phone-status-bar">
            <span className="phone-status-time">9:41</span>
            <div className="phone-status-icons">
              <Signal size={9} strokeWidth={2.5} />
              <Wifi size={9} strokeWidth={2.5} />
              <Battery size={10} strokeWidth={2.5} />
            </div>
          </div>

          {/* Dynamic island */}
          <div className="phone-island" />

          <div className="phone-app">

            {/* Header */}
            <div className="phone-app-header">
              <div>
                <p className="phone-greeting">Good morning ✨</p>
                <p className="phone-owner">Priya's Salon</p>
              </div>
              <div className="phone-header-right">
                <div className="phone-notif-btn">
                  <Bell size={11} strokeWidth={2} />
                  <span className="phone-notif-dot" />
                </div>
                <div className="phone-avatar">P</div>
              </div>
            </div>

            {/* Revenue card */}
            <div className="phone-revenue-card">
              <div className="phone-rev-bg-circle" />
              <div className="phone-rev-bg-circle-2" />
              <div className="phone-revenue-left">
                <div className="phone-revenue-label">
                  <TrendingUp size={8} />
                  <span>Total Revenue · This Month</span>
                </div>
                <p className="phone-revenue-value">₹1,14,900</p>
                <div className="phone-revenue-badge">
                  <span>↑ 18%</span>
                  <span style={{ opacity: 0.75 }}>vs last month</span>
                </div>
              </div>
              <div className="phone-sparkline">
                {spark.map((h, i) => (
                  <div key={i} className="phone-spark-bar"
                    style={{ height: `${h}%`, opacity: 0.35 + (i / spark.length) * 0.65 }} />
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="phone-stats-row">
              {quickStats.map(s => (
                <div key={s.lbl} className="phone-stat-pill">
                  <div className="phone-stat-icon" style={{ background: `${s.color}18` }}>
                    <s.icon size={10} style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="phone-stat-num">{s.val}</p>
                    <p className="phone-stat-lbl">{s.lbl}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Branch breakdown */}
            <div className="phone-section-header">
              <span className="phone-section-title">Branch Revenue</span>
              <span className="phone-section-link">View all →</span>
            </div>

            <div className="phone-branches">
              {branches.map((b, i) => (
                <div key={b.name} className="phone-branch-row">
                  <div className="phone-branch-rank" style={{ color: b.color, background: `${b.color}14` }}>{i + 1}</div>
                  <div className="phone-branch-info">
                    <div className="phone-branch-top">
                      <span className="phone-branch-name">{b.name}</span>
                      <span className="phone-branch-val" style={{ color: b.color }}>{b.value}</span>
                    </div>
                    <div className="phone-progress-track">
                      <div className="phone-progress-fill"
                        style={{ width: `${b.pct}%`, background: `linear-gradient(90deg, ${b.color}, ${b.color}88)` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom nav */}
            <div className="phone-bottom-nav">
              {[
                { icon: Home,          label: 'Home',    active: true  },
                { icon: CalendarDays,  label: 'Book',    active: false },
                { icon: BarChart2,     label: 'Reports', active: false },
                { icon: MoreHorizontal,label: 'More',    active: false },
              ].map(n => (
                <div key={n.label} className={`phone-nav-item${n.active ? ' active' : ''}`}>
                  <div className={`phone-nav-icon-wrap${n.active ? ' active' : ''}`}>
                    <n.icon size={12} />
                  </div>
                  <span>{n.label}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
