import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Mail, Phone, MapPin, CheckCircle
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import logoBlack from '../../assets/logo-blacks.png'
import logoWhite from '../../assets/logo-whites.png'

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features',    to: '/features'  },
      { label: 'Solutions',   to: '/solutions' },
      { label: 'Pricing',     to: '/pricing'   },
      { label: 'Changelog',   to: '#'          },
      { label: 'Roadmap',     to: '#'          },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Hair Salons',     to: '/solutions#salons'      },
      { label: 'Spas & Wellness', to: '/solutions#spas'        },
      { label: 'Beauty Clinics',  to: '/solutions#clinics'     },
      { label: 'Makeup Studios',  to: '/solutions#studios'     },
      { label: 'Salon Chains',    to: '/solutions#chains'      },
      { label: 'Solo Stylists',   to: '/solutions#independent' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us',  to: '/about' },
      { label: 'Blog',      to: '#'      },
      { label: 'Careers',   to: '#'      },
      { label: 'Press',     to: '#'      },
      { label: 'Contact',   to: '#'      },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Centre',      to: '#' },
      { label: 'Documentation',    to: '#' },
      { label: 'API Reference',    to: '#' },
      { label: 'Status Page',      to: '#' },
      { label: 'Privacy Policy',   to: '#' },
      { label: 'Terms of Service', to: '#' },
    ],
  },
]

// Social links as plain styled anchors (lucide-react v1.72 has no social icons)
const socials = [
  { label: 'IG',  title: 'Instagram', href: '#' },
  { label: 'X',   title: 'Twitter / X', href: '#' },
  { label: 'in',  title: 'LinkedIn', href: '#' },
  { label: 'YT',  title: 'YouTube', href: '#' },
]

const contact = [
  { icon: Mail,    value: 'hello@keeng.in'   },
  { icon: Phone,   value: '+91 80 4567 8900'  },
  { icon: MapPin,  value: 'Bangalore, India'  },
]

const badges = ['SOC 2 Type II', 'GDPR Ready', 'ISO 27001', 'GST Compliant']

export default function Footer() {
  const { theme } = useTheme()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  // Footer always uses a deep/dark base regardless of page theme
  // Dark: deep plum almost black. Light: dark slate so it contrasts against ivory body.
  const footerBg      = theme === 'dark' ? '#0c0810' : '#1a0f16'
  const footerBg2     = theme === 'dark' ? '#100a0e' : '#160c12'
  const footerText    = 'rgba(245,237,240,0.5)'
  const footerTextHi  = 'rgba(245,237,240,0.85)'
  const footerMuted   = 'rgba(245,237,240,0.28)'
  const footerBorder  = 'rgba(196,96,122,0.14)'

  return (
    <footer style={{ background: footerBg, position: 'relative', overflow: 'hidden' }}>

      {/* Top glow accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, var(--brand-dark) 20%, var(--brand) 50%, var(--brand-dark) 80%, transparent 100%)',
        opacity: 0.7,
      }} />

      {/* Subtle background radial glow */}
      <div style={{
        position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(196,96,122,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Newsletter strip */}
      <div className="px-6 py-10 relative" style={{ borderBottom: `1px solid ${footerBorder}` }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-bold text-base" style={{ color: footerTextHi }}>
              Stay in the loop
            </p>
            <p className="text-sm mt-0.5" style={{ color: footerText }}>
              Product updates, tips for salon owners, and industry news — straight to your inbox.
            </p>
          </div>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--brand-soft)', color: 'var(--brand-light)', border: '1px solid var(--border-brand)' }}
            >
              <CheckCircle size={16} />
              You're subscribed!
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full md:w-64 px-4 py-2.5 text-sm rounded-xl outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: `1px solid ${footerBorder}`,
                  color: footerTextHi,
                  borderRadius: '12px',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--brand-soft)' }}
                onBlur={e => { e.currentTarget.style.borderColor = footerBorder; e.currentTarget.style.boxShadow = 'none' }}
              />
              <button
                type="submit"
                className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0"
              >
                Subscribe <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main footer grid */}
      <div className="px-6 py-16 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-10">

          {/* Brand col — 2 cols wide */}
          <div className="col-span-2">
            <Link to="/" className="inline-block mb-5">
              {/* Always use white logo on dark footer */}
              <img
                src={logoWhite}
                alt="Keeng"
                className="logo-img h-14"
                style={{ opacity: 0.92 }}
              />
            </Link>

            <p className="text-sm leading-relaxed mb-6" style={{ color: footerText }}>
              The all-in-one management platform for salons, spas, and wellness businesses across India.
            </p>

            {/* Contact */}
            <ul className="space-y-2.5 mb-7">
              {contact.map(c => (
                <li key={c.value} className="flex items-center gap-2.5">
                  <c.icon size={14} style={{ color: 'var(--brand-light)', flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: footerText }}>{c.value}</span>
                </li>
              ))}
            </ul>

            {/* Social icons */}
            <div className="flex gap-2">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.title}
                  title={s.title}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all text-[11px] font-bold"
                  style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${footerBorder}`, color: footerText }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--brand-soft)'
                    e.currentTarget.style.borderColor = 'var(--border-brand)'
                    e.currentTarget.style.color = 'var(--brand-light)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.borderColor = footerBorder
                    e.currentTarget.style.color = footerText
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map(col => (
            <div key={col.title}>
              <h4
                className="text-xs font-bold uppercase tracking-widest mb-5"
                style={{ color: 'var(--brand-light)', opacity: 0.7 }}
              >
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors duration-150"
                      style={{ color: footerText }}
                      onMouseEnter={e => { e.currentTarget.style.color = footerTextHi }}
                      onMouseLeave={e => { e.currentTarget.style.color = footerText }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 py-5" style={{ background: footerBg2, borderTop: `1px solid ${footerBorder}` }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-xs" style={{ color: footerMuted }}>
            © {new Date().getFullYear()} Keeng Technologies Pvt. Ltd. All rights reserved. Made with ♥ in India.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-2 justify-center">
            {badges.map(b => (
              <span
                key={b}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-md"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${footerBorder}`,
                  color: footerMuted,
                }}
              >
                {b}
              </span>
            ))}
          </div>

          {/* Legal links */}
          <div className="flex gap-5">
            {['Privacy', 'Terms', 'Security', 'Cookies'].map(l => (
              <a
                key={l}
                href="#"
                className="text-xs transition-colors"
                style={{ color: footerMuted }}
                onMouseEnter={e => { e.currentTarget.style.color = footerTextHi }}
                onMouseLeave={e => { e.currentTarget.style.color = footerMuted }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  )
}
