import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Gem, Star, Check, Play } from 'lucide-react'
import BackgroundPattern from './BackgroundPattern'
import PhoneMockup from './PhoneMockup'
import NotificationCard from './NotificationCard'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } }
}
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L.057 23.571a.5.5 0 0 0 .612.612l5.726-1.471A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.5-5.24-1.375l-.374-.215-3.876.995.995-3.876-.215-.374A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
  )
}

const perks = ['14-day free trial', 'No credit card needed', 'Setup in 5 minutes']

const heroStats = [
  { value: '10K+',  label: 'Salons & Spas' },
  { value: '98%',   label: 'Satisfaction'  },
  { value: '40%',   label: 'Revenue Boost' },
]

export default function HeroSection() {
  return (
    <section className="hero-section">
      <BackgroundPattern />

      <div className="hero-inner">

        {/* ── COL 1: Text ── */}
        <motion.div className="hero-text-col" variants={stagger} initial="hidden" animate="show">

          <motion.div variants={fadeUp}>
            <span className="hero-eyebrow">
              <Gem size={11} />
              Premium Salon Management Software
            </span>
          </motion.div>

          <motion.h1 className="hero-heading" variants={fadeUp}>
            Your Salon,<br />
            <span className="hero-heading-accent">Beautifully</span><br />
            Managed.
          </motion.h1>

          <motion.p className="hero-subtext" variants={fadeUp}>
            The all-in-one platform built for salons, spas & wellness studios. Smart appointments, seamless billing, loyal clients — all from one elegant dashboard.
          </motion.p>

          <motion.div className="hero-cta-row" variants={fadeUp}>
            <Link to="/register" className="hero-btn-primary">
              Start Free Trial <ArrowRight size={16} />
            </Link>
            <Link to="/dashboard" className="hero-btn-ghost">
              <Play size={14} fill="currentColor" />
              Watch Demo
            </Link>
          </motion.div>

          <motion.div className="hero-perks" variants={fadeUp}>
            {perks.map(p => (
              <span key={p} className="hero-perk-item">
                <Check size={10} strokeWidth={3} />
                {p}
              </span>
            ))}
          </motion.div>

          {/* Stats row */}
          <motion.div className="hero-stats-strip" variants={fadeUp}>
            {heroStats.map((s, i) => (
              <div key={s.label} className="hero-stats-item">
                {i > 0 && <div className="hero-stats-divider" />}
                <p className="hero-stats-val">{s.value}</p>
                <p className="hero-stats-lbl">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Social proof */}
          <motion.div className="hero-social-proof" variants={fadeUp}>
            <div className="hero-avatars">
              {[
                'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=64&h=64&fit=crop&crop=face&auto=format',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face&auto=format',
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=face&auto=format',
                'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=64&h=64&fit=crop&crop=face&auto=format',
                'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=64&h=64&fit=crop&crop=face&auto=format',
              ].map((src, i) => (
                <img key={i} src={src} alt="" className="hero-avatar-bubble" style={{ zIndex: 5 - i }} />
              ))}
            </div>
            <div className="hero-proof-text">
              <div className="hero-proof-stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#c9a96e" color="#c9a96e" />)}
              </div>
              <span>Loved by <strong>10,000+</strong> beauty professionals</span>
            </div>
          </motion.div>

        </motion.div>

        {/* ── COL 2: Phone ── */}
        <motion.div
          className="hero-phone-col"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-phone-glow" />

          <NotificationCard
            className="notif-top"
            icon={<WhatsAppIcon />}
            iconBg="linear-gradient(135deg,#25D366,#128C7E)"
            badge="LIVE"
            title="WhatsApp reminder sent"
            desc="Ritika · Hair spa at 4:00 PM, Bandra"
            time="Just now"
            delay={0.9}
          />

          <motion.div
            className="hero-phone-wrap"
            animate={{ y: [0, -13, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <PhoneMockup />
          </motion.div>

          <NotificationCard
            className="notif-bottom"
            icon={<BellIcon />}
            iconBg="linear-gradient(135deg,#c9a96e,#a07840)"
            title="New booking confirmed"
            desc="Keratin with Sana · Sat 11:00 AM"
            time="2 min ago"
            delay={1.15}
          />
        </motion.div>

        {/* ── COL 3: Portrait ── */}
        <motion.div
          className="hero-portrait-col"
          initial={{ opacity: 0, x: 56 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-portrait-glow" />
          <div className="hero-portrait-ring" />
          <div className="hero-portrait-ring-2" />

          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&auto=format&fit=crop&q=90&crop=faces,top"
            alt="Salon professional"
            className="hero-portrait-img"
          />

          {/* Rating card */}
          <motion.div
            className="hero-rating-card"
            initial={{ opacity: 0, x: 24, scale: 0.88 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-rating-stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#c9a96e" color="#c9a96e" />)}
            </div>
            <p className="hero-rating-text">"Revenue up 35% in 3 months!"</p>
            <p className="hero-rating-author">— Priya S., Glow Salon Mumbai</p>
          </motion.div>

          {/* Revenue badge */}
          <motion.div
            className="hero-stat-badge"
            initial={{ opacity: 0, x: -24, scale: 0.88 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 1.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-stat-badge-icon">💰</div>
            <div>
              <p className="hero-stat-badge-val">₹1,14,900</p>
              <p className="hero-stat-badge-lbl">Monthly Revenue</p>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  )
}
