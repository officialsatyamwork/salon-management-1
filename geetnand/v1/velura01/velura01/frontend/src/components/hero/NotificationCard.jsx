import { motion } from 'framer-motion'

export default function NotificationCard({ icon, iconBg, badge, title, desc, time, delay = 0, className = '' }) {
  return (
    <motion.div
      className={`notif-card ${className}`}
      initial={{ opacity: 0, scale: 0.88, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="notif-icon-wrap" style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="notif-body">
        <div className="notif-title-row">
          <span className="notif-title">{title}</span>
          {badge && (
            <span className="notif-live">
              <span className="notif-live-dot" />
              {badge}
            </span>
          )}
        </div>
        <p className="notif-desc">{desc}</p>
        {time && <p className="notif-time">{time}</p>}
      </div>
    </motion.div>
  )
}
