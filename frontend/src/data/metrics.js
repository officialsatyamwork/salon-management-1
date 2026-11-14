// Derives day/week figures from a branch's monthly totals so every dashboard
// shows numbers that agree with each other.

export const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const WEEK_SHAPE = [0.78, 0.85, 0.82, 0.98, 1.1, 1.38, 1.09]

export function branchWeek(branch) {
  const perDay = branch.revenueMonth / 30
  return WEEK.map((day, i) => ({ day, revenue: Math.round(perDay * WEEK_SHAPE[i] / 10) * 10 }))
}

export function branchToday(branch) {
  const perDay = branch.revenueMonth / 30
  const appointments = Math.round(branch.appointmentsMonth / 30)
  return {
    revenue: Math.round(perDay * WEEK_SHAPE[6] / 10) * 10,
    appointments,
    walkIns: Math.round(appointments * 0.28),
    onDuty: Math.max(0, branch.staff - (branch.staff > 8 ? 2 : 1)),
    customers: Math.round(appointments * 0.9),
  }
}

export function businessTotals(branches) {
  const active = branches.filter(b => b.status === 'active')
  return {
    revenueMonth: active.reduce((s, b) => s + b.revenueMonth, 0),
    appointmentsMonth: active.reduce((s, b) => s + b.appointmentsMonth, 0),
    staff: branches.reduce((s, b) => s + b.staff, 0),
    todayAppointments: active.reduce((s, b) => s + branchToday(b).appointments, 0),
  }
}
