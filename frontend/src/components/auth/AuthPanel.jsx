import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TrendingUp, Calendar, Users, Star, CheckCircle, Bell, CreditCard } from 'lucide-react'
import logoWhite from '../../assets/logo-whites.png'

const fadeUp  = { hidden:{ opacity:0, y:20 }, show:{ opacity:1, y:0, transition:{ duration:0.6, ease:[0.22,1,0.36,1] } } }
const stagger = { show:{ transition:{ staggerChildren:0.09 } } }

const kpis = [
  { icon:TrendingUp, label:'Revenue',      val:'₹42.8K', chg:'+12%' },
  { icon:Calendar,   label:'Appointments', val:'38',      chg:'+5'   },
  { icon:Users,      label:'Customers',    val:'7 new',   chg:'+3'   },
  { icon:CreditCard, label:'Avg ticket',   val:'₹1,126',  chg:'+8%'  },
]

const schedule = [
  { name:'Priya Sharma', time:'10:00 AM', dot:'#4ade80' },
  { name:'Rahul Mehta',  time:'11:30 AM', dot:'#facc15' },
  { name:'Anita Nair',   time:'01:00 PM', dot:'#4ade80' },
  { name:'Suresh K.',    time:'02:30 PM', dot:'#94a3b8' },
]

const bars = [45,70,55,85,60,95,75]

const reviews = [
  { initials:'PS', color:'#c4607a', text:'Revenue up 35% in 3 months.'  },
  { initials:'RM', color:'#7c3aed', text:'No-shows dropped by 60%.'      },
  { initials:'AN', color:'#059669', text:'Best software for salons.'     },
]

function DashWindow() {
  return (
    <motion.div
      initial={{ opacity:0, y:28, scale:0.97 }}
      animate={{ opacity:1, y:0,  scale:1    }}
      transition={{ delay:0.3, duration:0.8, ease:[0.22,1,0.36,1] }}
      style={{
        borderRadius:'16px', overflow:'hidden',
        background:'rgba(15,10,13,0.88)',
        border:'1px solid rgba(196,96,122,0.2)',
        backdropFilter:'blur(20px)',
        boxShadow:'0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(196,96,122,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Chrome bar */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 14px', borderBottom:'1px solid rgba(196,96,122,0.1)', background:'rgba(255,255,255,0.025)' }}>
        <div style={{ display:'flex', gap:'5px' }}>
          {['#ff5f57','#febc2e','#28c840'].map(c=>(
            <div key={c} style={{ width:'9px', height:'9px', borderRadius:'50%', background:c }}/>
          ))}
        </div>
        <div style={{ flex:1, margin:'0 10px', height:'18px', borderRadius:'6px', display:'flex', alignItems:'center', paddingLeft:'8px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize:'8px', color:'rgba(245,237,240,0.28)' }}>app.keeng.in/dashboard</span>
        </div>
      </div>

      <div style={{ padding:'14px' }}>
        {/* KPIs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px', marginBottom:'12px' }}>
          {kpis.map(k=>(
            <div key={k.label} style={{ borderRadius:'10px', padding:'10px 8px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(196,96,122,0.09)' }}>
              <k.icon size={9} style={{ color:'#e07a90', marginBottom:'5px' }}/>
              <div style={{ fontSize:'12px', fontWeight:900, color:'#f5edf0', letterSpacing:'-0.02em', lineHeight:1 }}>{k.val}</div>
              <div style={{ fontSize:'7.5px', color:'rgba(245,237,240,0.32)', marginTop:'2px' }}>{k.label}</div>
              <div style={{ fontSize:'7.5px', fontWeight:700, color:'#4ade80', marginTop:'3px' }}>{k.chg}</div>
            </div>
          ))}
        </div>

        {/* Chart + schedule */}
        <div style={{ display:'grid', gridTemplateColumns:'2fr 3fr', gap:'10px' }}>
          <div style={{ borderRadius:'10px', padding:'10px', background:'rgba(255,255,255,0.025)', border:'1px solid rgba(196,96,122,0.09)' }}>
            <div style={{ fontSize:'8px', fontWeight:600, color:'rgba(245,237,240,0.38)', marginBottom:'8px' }}>This Week</div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:'3px', height:'48px' }}>
              {bars.map((h,i)=>(
                <motion.div key={i}
                  initial={{ height:0 }} animate={{ height:`${h}%` }}
                  transition={{ delay:0.6+i*0.05, duration:0.5, ease:[0.22,1,0.36,1] }}
                  style={{ flex:1, borderRadius:'2px 2px 0 0', background:`linear-gradient(to top, rgba(196,96,122,0.55), rgba(224,122,144,${0.28+i*0.07}))` }}
                />
              ))}
            </div>
            <div style={{ display:'flex', marginTop:'4px' }}>
              {['M','T','W','T','F','S','S'].map((d,i)=>(
                <span key={i} style={{ flex:1, textAlign:'center', fontSize:'6.5px', color:'rgba(245,237,240,0.2)' }}>{d}</span>
              ))}
            </div>
          </div>

          <div style={{ borderRadius:'10px', padding:'10px', background:'rgba(255,255,255,0.025)', border:'1px solid rgba(196,96,122,0.09)' }}>
            <div style={{ fontSize:'8px', fontWeight:600, color:'rgba(245,237,240,0.38)', marginBottom:'8px' }}>Today's Schedule</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
              {schedule.map(a=>(
                <div key={a.name} style={{ display:'flex', alignItems:'center', gap:'7px' }}>
                  <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:a.dot, flexShrink:0 }}/>
                  <div style={{ fontSize:'8.5px', fontWeight:500, color:'rgba(245,237,240,0.68)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.name}</div>
                  <div style={{ fontSize:'7.5px', color:'rgba(245,237,240,0.28)' }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function AuthPanel({ variant='login' }) {
  const isLogin = variant === 'login'

  return (
    <div
      className="hidden lg:flex flex-col relative overflow-hidden"
      style={{ width: isLogin ? '52%' : '45%', flexShrink:0, minHeight:'100vh' }}
    >
      {/* Background */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(155deg,#2a0916 0%,#1a0d14 28%,#120c10 58%,#0b080a 100%)' }}/>

      {/* Mesh */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.06 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="g" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M56 0 L0 0 0 56" fill="none" stroke="rgba(196,96,122,1)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
      </svg>

      {/* Orbs */}
      <motion.div animate={{ scale:[1,1.3,1], opacity:[0.3,0.6,0.3] }} transition={{ duration:7, repeat:Infinity, ease:'easeInOut' }}
        style={{ position:'absolute', top:'-20%', left:'-15%', width:'72%', height:'65%', borderRadius:'50%', background:'radial-gradient(circle,rgba(196,96,122,0.3) 0%,transparent 70%)', pointerEvents:'none' }}/>
      <motion.div animate={{ scale:[1,1.2,1], opacity:[0.2,0.4,0.2] }} transition={{ duration:9, repeat:Infinity, ease:'easeInOut', delay:2 }}
        style={{ position:'absolute', bottom:'-15%', right:'-10%', width:'65%', height:'60%', borderRadius:'50%', background:'radial-gradient(circle,rgba(201,151,58,0.22) 0%,transparent 70%)', pointerEvents:'none' }}/>
      <motion.div animate={{ scale:[1,1.15,1], opacity:[0.1,0.25,0.1] }} transition={{ duration:11, repeat:Infinity, ease:'easeInOut', delay:4 }}
        style={{ position:'absolute', top:'40%', right:'0%', width:'50%', height:'50%', borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)', pointerEvents:'none' }}/>

      {/* Decorative rings */}
      <div style={{ position:'absolute', top:'12%', left:'-14%', width:'360px', height:'360px', borderRadius:'50%', border:'1px solid rgba(196,96,122,0.09)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', top:'7%',  left:'-20%', width:'500px', height:'500px', borderRadius:'50%', border:'1px solid rgba(196,96,122,0.04)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'4%', right:'-10%', width:'300px', height:'300px', borderRadius:'50%', border:'1px solid rgba(201,151,58,0.08)', pointerEvents:'none' }}/>

      {/* Edge fades */}
      <div style={{ position:'absolute', top:0, right:0, bottom:0, width:'90px', background:'linear-gradient(to right,transparent,rgba(11,8,10,0.75))', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'100px', background:'linear-gradient(to bottom,transparent,rgba(11,8,10,0.6))', pointerEvents:'none' }}/>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-10 py-9">

        {/* Logo */}
        <motion.div initial={{ opacity:0, x:-14 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6 }}>
          <Link to="/"><img src={logoWhite} alt="Keeng" style={{ height:'36px', width:'auto', objectFit:'contain', opacity:0.9 }}/></Link>
        </motion.div>

        {/* Headline */}
        <motion.div variants={stagger} initial="hidden" animate="show" style={{ marginTop:'36px' }}>
          <motion.div variants={fadeUp}
            style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'5px 12px', borderRadius:'999px', fontSize:'11px', fontWeight:600, marginBottom:'18px', background:'rgba(196,96,122,0.12)', border:'1px solid rgba(196,96,122,0.28)', color:'#e07a90' }}>
            <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#e07a90', animation:'pulse 2s infinite' }}/>
            {isLogin ? 'Trusted by 10,000+ businesses' : '14-day free trial — no credit card'}
          </motion.div>

          <motion.h2 variants={fadeUp}
            style={{ fontWeight:900, lineHeight:1.07, marginBottom:'14px', color:'#f5edf0', letterSpacing:'-0.028em', fontSize: isLogin ? 'clamp(2.2rem,3.4vw,3.1rem)' : 'clamp(2rem,2.9vw,2.75rem)' }}>
            {isLogin ? <>Your salon,<br/>
              <span style={{ background:'linear-gradient(118deg,#e8c98a 0%,#f4a8ba 42%,#c4607a 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                beautifully<br/>managed.
              </span>
            </> : <>Start free.<br/>
              <span style={{ background:'linear-gradient(118deg,#e8c98a 0%,#f4a8ba 42%,#c4607a 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Grow further.
              </span>
            </>}
          </motion.h2>

          <motion.p variants={fadeUp}
            style={{ fontSize:'14px', lineHeight:1.65, color:'rgba(245,237,240,0.42)', maxWidth:'290px', marginBottom:'0' }}>
            {isLogin
              ? 'Appointments, billing, staff, inventory — all in one place, built for Indian beauty businesses.'
              : 'Join 10,000+ salons and spas already using Keeng to manage their entire business.'}
          </motion.p>
        </motion.div>

        {/* Dashboard window */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', paddingTop:'28px', paddingBottom:'8px' }}>
          <DashWindow/>

          {/* Floating chips */}
          <div style={{ position:'relative', height:0 }}>
            <motion.div
              animate={{ y:[0,-7,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
              style={{ position:'absolute', bottom:'18px', left:'-12px', display:'flex', alignItems:'center', gap:'7px', padding:'8px 12px', borderRadius:'12px', fontSize:'11px', fontWeight:600, background:'rgba(15,10,13,0.92)', border:'1px solid rgba(74,222,128,0.3)', backdropFilter:'blur(16px)', boxShadow:'0 8px 28px rgba(0,0,0,0.45)', whiteSpace:'nowrap' }}>
              <CheckCircle size={13} style={{ color:'#4ade80' }}/>
              <span style={{ color:'rgba(245,237,240,0.85)' }}>Payment received</span>
              <span style={{ color:'#4ade80', fontWeight:800 }}>₹3,200</span>
            </motion.div>

            <motion.div
              animate={{ y:[0,7,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut', delay:1 }}
              style={{ position:'absolute', bottom:'54px', right:'-4px', display:'flex', alignItems:'center', gap:'7px', padding:'8px 12px', borderRadius:'12px', fontSize:'11px', fontWeight:600, background:'rgba(15,10,13,0.92)', border:'1px solid rgba(201,151,58,0.3)', backdropFilter:'blur(16px)', boxShadow:'0 8px 28px rgba(0,0,0,0.45)', whiteSpace:'nowrap' }}>
              <Bell size={12} style={{ color:'#e8c98a' }}/>
              <span style={{ color:'rgba(245,237,240,0.75)' }}>Reminder sent</span>
              <span style={{ color:'#e8c98a', fontWeight:800 }}>24 clients</span>
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7 }}
          style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', paddingTop:'20px', borderTop:'1px solid rgba(196,96,122,0.1)', marginBottom:'16px' }}>
          {[{ val:'10,000+',lbl:'Businesses' },{ val:'2.5M+',lbl:'Appointments' },{ val:'40%',lbl:'Revenue growth' }].map(s=>(
            <div key={s.lbl} style={{ textAlign:'center' }}>
              <div style={{ fontSize:'17px', fontWeight:900, color:'#f5edf0', letterSpacing:'-0.02em', lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:'10px', color:'rgba(245,237,240,0.3)', marginTop:'3px' }}>{s.lbl}</div>
            </div>
          ))}
        </motion.div>

        {/* Reviews */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
          style={{ display:'flex', flexDirection:'column', gap:'9px' }}>
          {reviews.map(r=>(
            <div key={r.initials} style={{ display:'flex', alignItems:'center', gap:'9px' }}>
              <div style={{ width:'24px', height:'24px', borderRadius:'50%', background:r.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'9px', fontWeight:900, color:'#fff', flexShrink:0 }}>{r.initials}</div>
              <div style={{ fontSize:'11px', color:'rgba(245,237,240,0.44)', fontStyle:'italic', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>"{r.text}"</div>
              <div style={{ display:'flex', gap:'2px', flexShrink:0 }}>
                {[...Array(5)].map((_,i)=><Star key={i} size={8} fill="#f59e0b" color="#f59e0b"/>)}
              </div>
            </div>
          ))}
        </motion.div>

        <Link to="/" style={{ marginTop:'16px', fontSize:'11px', color:'rgba(245,237,240,0.22)', transition:'color 0.2s' }}
          onMouseEnter={e=>{e.currentTarget.style.color='rgba(245,237,240,0.55)'}}
          onMouseLeave={e=>{e.currentTarget.style.color='rgba(245,237,240,0.22)'}}>
          ← Back to keeng.in
        </Link>
      </div>
    </div>
  )
}
