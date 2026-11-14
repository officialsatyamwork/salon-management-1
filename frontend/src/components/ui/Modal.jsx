import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export function Modal({ title, subtitle, onClose, children, width = 'max-w-md' }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onMouseDown={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        onMouseDown={e => e.stopPropagation()} role="dialog" aria-label={title}
        className={`bg-panel border border-line rounded-2xl p-5 sm:p-6 w-full ${width} max-h-[90vh] overflow-y-auto`}
        style={{ boxShadow: '0 24px 80px var(--shadow)' }}>
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <h2 className="text-lg font-bold text-fg">{title}</h2>
            {subtitle && <p className="text-[12.5px] text-fg-muted mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} aria-label="Close" className="text-fg-2 hover:text-fg p-1 -m-1"><X size={20} /></button>
        </div>
        {children}
      </motion.div>
    </div>
  )
}

const inputCls = 'w-full bg-fg/5 border rounded-xl px-4 py-2.5 text-fg text-sm placeholder:text-fg-muted focus:outline-none focus:border-violet-500 transition-colors'

export function Field({ label, error, hint, className = '', children }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm text-fg-2 block mb-1">{label}</span>
      {children}
      {error ? <span className="text-red-400 text-xs mt-1 block">{error}</span>
        : hint ? <span className="text-fg-muted text-xs mt-1 block">{hint}</span> : null}
    </label>
  )
}

export function TextInput({ error, className = '', ...props }) {
  return <input {...props} className={`${inputCls} ${error ? 'border-red-500' : 'border-line'} ${className}`} />
}

export function Select({ error, className = '', children, ...props }) {
  return (
    <select {...props} className={`${inputCls} ${error ? 'border-red-500' : 'border-line'} ${className}`}>
      {children}
    </select>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${checked ? 'bg-violet-600' : 'bg-fg/15'}`}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  )
}

export function ModalActions({ onCancel, submitLabel, danger }) {
  return (
    <div className="flex gap-3 pt-2">
      <button type="button" onClick={onCancel} className="flex-1 glass py-2.5 rounded-xl text-fg-2 text-sm font-medium">Cancel</button>
      <button type="submit"
        className={`flex-1 text-white py-2.5 rounded-xl text-sm font-medium transition-colors ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-violet-600 hover:bg-violet-700'}`}>
        {submitLabel}
      </button>
    </div>
  )
}
