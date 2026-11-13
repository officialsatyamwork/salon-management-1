import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const cols = [
  { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
  { title: 'Solutions', links: ['Salons', 'Spas', 'Clinics', 'Wellness'] },
  { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
]

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(8,8,14,0.8)' }} className="py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #c9973a, #a87828)' }}>
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="text-[17px] font-bold text-white tracking-tight">Velura</span>
          </Link>
          <p className="text-[13.5px] text-gray-500 leading-relaxed max-w-[240px]">
            The all-in-one platform for salons, spas, and wellness businesses.
          </p>
        </div>

        {cols.map(col => (
          <div key={col.title}>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-gray-600 mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map(link => (
                <li key={link}>
                  <a href="#" className="text-[13.5px] text-gray-500 hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[12.5px] text-gray-600">© 2025 Velura Technologies. All rights reserved.</p>
        <div className="flex gap-6">
          {['Privacy', 'Terms', 'Security'].map(l => (
            <a key={l} href="#" className="text-[12.5px] text-gray-600 hover:text-white transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}
