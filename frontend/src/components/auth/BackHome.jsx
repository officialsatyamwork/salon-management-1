import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function BackHome() {
  return (
    <Link to="/"
      className="fixed top-4 left-4 sm:top-6 sm:left-6 z-20 btn-ghost rounded-full pl-3 pr-4 py-2 text-[13px] font-medium flex items-center gap-1.5 group"
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
      <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
      Back to home
    </Link>
  )
}
