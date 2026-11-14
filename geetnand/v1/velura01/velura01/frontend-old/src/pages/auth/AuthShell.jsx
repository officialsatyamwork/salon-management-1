import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

// Shared frame for the smaller auth pages (forgot / reset / invite).
export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0b0e18' }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl" style={{ background: 'rgba(201,151,58,0.06)' }} />
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#c9973a,#a87828)' }}>
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Velura</span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">{title}</h1>
          {subtitle && <p className="text-gray-400">{subtitle}</p>}
        </div>
        <div className="glass rounded-2xl p-8">{children}</div>
      </motion.div>
    </div>
  )
}

export const inputClass = (hasError) =>
  `w-full bg-white/5 border ${hasError ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#c9973a]/60 transition-colors`

export const goldButton = { background: 'linear-gradient(135deg,#c9973a,#a87828)', color: '#0b0e18' }

export function Alert({ kind = 'error', children }) {
  const style = kind === 'error'
    ? { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }
    : { background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }
  return <div role={kind === 'error' ? 'alert' : 'status'} className="text-sm rounded-xl px-4 py-3" style={style}>{children}</div>
}
