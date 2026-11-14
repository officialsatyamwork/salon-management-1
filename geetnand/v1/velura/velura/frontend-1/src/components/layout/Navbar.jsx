import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import logoBlack from '../../assets/logo-black.jpeg'
import logoWhite from '../../assets/logo-white.jpeg'

const links = [
  { label: 'Home',      href: '/'           },
  { label: 'About',     href: '#about'       },
  { label: 'Features',  href: '#features'    },
  { label: 'Solutions', href: '#solutions'   },
  { label: 'Pricing',   href: '#pricing'     },
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
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(28px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(28px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.4s ease',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img
            src={theme === 'dark' ? logoWhite : logoBlack}
            alt="Velura"
            className="h-10 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map(item => {
            const isActive = item.href === '/' ? location.pathname === '/' : false
            return (
              <a key={item.label} href={item.href}
                className="relative px-4 py-2 rounded-xl text-[13.5px] font-medium transition-all duration-200 group"
                style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                <span className="relative z-10 group-hover:text-[var(--text-primary)] transition-colors" style={{ color: 'inherit' }}>
                  {item.label}
                </span>
                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: 'var(--surface)' }} />
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: 'var(--brand)' }} />
                )}
              </a>
            )
          })}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link to="/login"
            className="px-4 py-2 rounded-xl text-[13.5px] font-medium transition-all duration-200 hover:bg-[var(--surface)]"
            style={{ color: 'var(--text-secondary)' }}>
            Sign in
          </Link>
          <Link to="/register"
            className="btn-primary px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white flex items-center gap-2">
            Start Free Trial
          </Link>
          <button className="theme-toggle" onClick={toggle} title="Toggle theme">
            <motion.div
              key={theme}
              initial={{ rotate: -30, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}>
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </motion.div>
          </button>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <button className="theme-toggle" onClick={toggle}>
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ color: 'var(--text-secondary)', background: 'var(--surface)', border: '1px solid var(--border)' }}
            onClick={() => setOpen(!open)}>
            <AnimatePresence mode="wait">
              <motion.div key={open ? 'x' : 'menu'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
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
            className="md:hidden px-6 pb-5 flex flex-col gap-1 overflow-hidden"
            style={{ borderTop: '1px solid var(--border)', background: 'var(--nav-bg)', backdropFilter: 'blur(28px)' }}
          >
            {links.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="py-2.5 px-3 rounded-xl text-[14px] font-medium transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => setOpen(false)}>
                {item.label}
              </motion.a>
            ))}
            <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
              <Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center py-2.5 rounded-xl text-[13.5px] font-medium btn-ghost">Sign in</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="flex-1 text-center py-2.5 rounded-xl text-[13.5px] font-semibold btn-primary text-white">Start Free Trial</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
