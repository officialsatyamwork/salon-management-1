import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, ArrowRight, Sparkles } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import logoBlack from '../../assets/logo-blacks.png'
import logoWhite from '../../assets/logo-whites.png'

const links = [
  { label: 'Home',      href: '/',          isRoute: true  },
  { label: 'About',     href: '/about',     isRoute: true  },
  { label: 'Features',  href: '/features',  isRoute: true  },
  { label: 'Solutions', href: '/solutions', isRoute: true  },
  { label: 'Pricing',   href: '/pricing',   isRoute: true  },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggle } = useTheme()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(32px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(32px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.12)' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Gradient line at the very top when scrolled */}
      {scrolled && (
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, var(--brand-light) 30%, var(--gold-light) 50%, var(--brand-light) 70%, transparent 100%)',
            opacity: 0.6,
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 h-[76px] flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="relative"
          >
            <img
              src={theme === 'dark' ? logoWhite : logoBlack}
              alt="Keeng"
              className="logo-img h-12 transition-all duration-300"
              style={{ filter: 'drop-shadow(0 0 0px var(--brand-glow))' }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'drop-shadow(0 2px 12px var(--brand-glow))' }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'drop-shadow(0 0 0px var(--brand-glow))' }}
            />
          </motion.div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(item => {
            const isActive = location.pathname === item.href
            const sharedClass = "relative px-4 py-2 rounded-xl text-[13.5px] font-medium transition-all duration-200 group"
            const inner = (
              <>
                <span
                  className="relative z-10 transition-colors duration-200"
                  style={{ color: isActive ? 'var(--brand-light)' : 'var(--text-secondary)' }}
                >
                  {item.label}
                </span>
                {/* Hover bg */}
                {!isActive && (
                  <span
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: 'var(--surface)' }}
                  />
                )}
                {/* Active pill */}
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'var(--brand-soft)', border: '1px solid var(--border-brand)' }}
                  />
                )}
              </>
            )

            return item.isRoute ? (
              <Link key={item.label} to={item.href} className={sharedClass}>
                {inner}
              </Link>
            ) : (
              <a key={item.label} href={item.href} className={sharedClass}>
                {inner}
              </a>
            )
          })}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {/* Soft divider */}
          <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />

          {/* Sign in */}
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-[13.5px] font-medium transition-all duration-200"
            style={{ color: 'var(--text-secondary)', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            Sign in
          </Link>

          {/* CTA button */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/register"
              className="btn-primary px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white flex items-center gap-2"
            >
              <Sparkles size={14} />
              Start Free Trial
              <ArrowRight size={13} className="opacity-70" />
            </Link>
          </motion.div>

          {/* Theme toggle */}
          <button className="theme-toggle" onClick={toggle} title="Toggle theme">
            <motion.div
              key={theme}
              initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </motion.div>
          </button>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <button className="theme-toggle" onClick={toggle}>
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ color: 'var(--text-secondary)', background: 'var(--surface)', border: '1px solid var(--border)' }}
            onClick={() => setOpen(!open)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={open ? 'x' : 'menu'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {open ? <X size={17} /> : <Menu size={17} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden px-5 pb-5 flex flex-col gap-1 overflow-hidden"
            style={{ borderTop: '1px solid var(--border)', background: 'var(--nav-bg)', backdropFilter: 'blur(28px)' }}
          >
            <div className="pt-3 space-y-1">
              {links.map((item, i) => {
                const isActive = location.pathname === item.href
                const inner = (
                  <span
                    className="block py-2.5 px-3 rounded-xl text-[14px] font-medium transition-all"
                    style={{
                      color: isActive ? 'var(--brand-light)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--brand-soft)' : 'transparent',
                      border: isActive ? '1px solid var(--border-brand)' : '1px solid transparent',
                    }}
                  >
                    {item.label}
                  </span>
                )

                return item.isRoute ? (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link to={item.href} onClick={() => setOpen(false)}>{inner}</Link>
                  </motion.div>
                ) : (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setOpen(false)}
                  >
                    {inner}
                  </motion.a>
                )
              })}
            </div>

            <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl text-[13.5px] font-medium btn-ghost"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl text-[13.5px] font-semibold btn-primary text-white flex items-center justify-center gap-1.5"
              >
                <Sparkles size={13} />
                Free Trial
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
