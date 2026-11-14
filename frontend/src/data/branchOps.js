// Sample branch staff, services and bookings shared by the calendar and the
// staff & commission page.

export const BRANCH_STAFF = [
  { id: 's1', name: 'Anita Nair', role: 'Senior Stylist', phone: '9876501001', email: 'anita@glowsalon.in', services: ['Haircut', 'Hair Color', 'Keratin'], appointments: 52, revenue: 86400, rating: 4.9, commissionRate: 15, payout: 'pending', tone: 'violet', status: 'active' },
  { id: 's2', name: 'Sunita Patel', role: 'Skin Specialist', phone: '9876501002', email: 'sunita@glowsalon.in', services: ['Facial', 'Cleanup'], appointments: 38, revenue: 61200, rating: 4.7, commissionRate: 12, payout: 'pending', tone: 'rose', status: 'active' },
  { id: 's3', name: 'Pooja Mehta', role: 'Nail Technician', phone: '9876501003', email: 'pooja@glowsalon.in', services: ['Manicure', 'Pedicure'], appointments: 44, revenue: 39600, rating: 4.8, commissionRate: 10, payout: 'paid', tone: 'gold', status: 'active' },
  { id: 's4', name: 'Meena Rao', role: 'Massage Therapist', phone: '9876501004', email: 'meena@glowsalon.in', services: ['Massage'], appointments: 30, revenue: 66000, rating: 4.9, commissionRate: 12, payout: 'pending', tone: 'cyan', status: 'active' },
  { id: 's5', name: 'Rakesh Kumar', role: 'Stylist', phone: '9876501005', email: 'rakesh@glowsalon.in', services: ['Haircut', 'Beard Styling'], appointments: 47, revenue: 28200, rating: 4.6, commissionRate: 10, payout: 'paid', tone: 'blue', status: 'active' },
  { id: 's6', name: 'Divya Nair', role: 'Receptionist', phone: '9876501006', email: 'divya@glowsalon.in', services: [], appointments: 0, revenue: 0, rating: 0, commissionRate: 0, payout: 'none', tone: 'green', status: 'active' },
]

export const SERVICES = [
  { name: 'Haircut', duration: 45, price: 600 },
  { name: 'Hair Color', duration: 90, price: 2800 },
  { name: 'Keratin', duration: 120, price: 4500 },
  { name: 'Facial', duration: 60, price: 1800 },
  { name: 'Cleanup', duration: 45, price: 900 },
  { name: 'Manicure', duration: 45, price: 700 },
  { name: 'Pedicure', duration: 60, price: 900 },
  { name: 'Massage', duration: 60, price: 2400 },
  { name: 'Beard Styling', duration: 30, price: 350 },
]

const CUSTOMERS = [
  ['Priya Sharma', '9876543210'], ['Neha Gupta', '9876543211'], ['Kavya Nair', '9876543212'],
  ['Deepa Rao', '9876543213'], ['Sonal Joshi', '9876543214'], ['Ritu Malhotra', '9876543215'],
  ['Ananya Iyer', '9876543216'], ['Farah Khan', '9876543217'], ['Meera Pillai', '9876543218'],
  ['Ishita Bose', '9876543219'], ['Tanvi Desai', '9876543220'], ['Aditi Rao', '9876543221'],
]

export const OPEN_HOUR = 9
export const CLOSE_HOUR = 21

export const dateKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function startOfWeek(d) {
  const s = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  s.setDate(s.getDate() - ((s.getDay() + 6) % 7))
  return s
}

// Small deterministic PRNG so the sample calendar looks the same on every load.
function rng(seed) {
  let x = seed >>> 0
  return () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 2 ** 32 }
}

// Bookings for the previous, current and next week around `now`.
export function buildAppointments(now) {
  const start = startOfWeek(now)
  start.setDate(start.getDate() - 7)
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const todayKey = dateKey(now)
  const list = []
  let id = 1

  for (let day = 0; day < 21; day++) {
    const date = new Date(start)
    date.setDate(start.getDate() + day)
    const key = dateKey(date)
    const isPast = date < new Date(now.getFullYear(), now.getMonth(), now.getDate())

    BRANCH_STAFF.filter(s => s.services.length).forEach((staff, si) => {
      const rand = rng(day * 97 + si * 13 + 7)
      let cursor = OPEN_HOUR * 60 + 30 + Math.floor(rand() * 4) * 30
      const count = 2 + Math.floor(rand() * 3)
      for (let n = 0; n < count && cursor < (CLOSE_HOUR - 1) * 60; n++) {
        const serviceName = staff.services[Math.floor(rand() * staff.services.length)]
        const service = SERVICES.find(sv => sv.name === serviceName)
        const [customer, phone] = CUSTOMERS[Math.floor(rand() * CUSTOMERS.length)]
        const startMin = cursor
        const endMin = startMin + service.duration
        let status = 'confirmed'
        if (isPast || (key === todayKey && endMin <= nowMin)) status = rand() < 0.1 ? 'cancelled' : 'completed'
        else if (key === todayKey && startMin <= nowMin) status = 'ongoing'
        list.push({ id: id++, date: key, start: startMin, duration: service.duration, staffId: staff.id, service: service.name, price: service.price, customer, phone, status })
        cursor = endMin + 30 + Math.floor(rand() * 4) * 30
      }
    })
  }
  return list
}

export const fmtTime = min => {
  const h = Math.floor(min / 60), m = min % 60
  const hh = ((h + 11) % 12) + 1
  return `${hh}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}
