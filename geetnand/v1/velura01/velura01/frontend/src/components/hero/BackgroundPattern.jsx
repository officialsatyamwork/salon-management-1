import { motion } from 'framer-motion'

export default function BackgroundPattern() {
  return (
    <div className="hero-bg-pattern">
      <div className="hero-bg-base" />

      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />
      <div className="hero-blob hero-blob-3" />
      <div className="hero-blob hero-blob-4" />

      <svg className="hero-circles-svg" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <circle cx="1100" cy="400" r="380" stroke="rgba(212,96,126,0.08)" strokeWidth="1" />
        <circle cx="1100" cy="400" r="300" stroke="rgba(212,96,126,0.06)" strokeWidth="1" />
        <circle cx="1100" cy="400" r="220" stroke="rgba(212,96,126,0.05)" strokeWidth="0.8" />
        <circle cx="300"  cy="400" r="340" stroke="rgba(199,124,140,0.07)" strokeWidth="1" />
        <circle cx="300"  cy="400" r="260" stroke="rgba(199,124,140,0.05)" strokeWidth="0.8" />
        <circle cx="720"  cy="100" r="200" stroke="rgba(182,95,128,0.06)" strokeWidth="0.8" />
        <circle cx="720"  cy="700" r="180" stroke="rgba(182,95,128,0.05)" strokeWidth="0.8" />
      </svg>

      <motion.div
        className="hero-dashed-ring"
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="hero-dashed-ring-2"
        animate={{ rotate: -360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="hero-dashed-ring-3"
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
      />

      <div className="hero-noise" />
    </div>
  )
}
