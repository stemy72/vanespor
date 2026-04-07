export const COLORS = [
  '#D4764E', '#5B8C5A', '#6B89A5', '#C4955A', '#9B6B8E',
  '#7AA37A', '#B07050', '#5A7A9B', '#A08050', '#8B6080',
]

export const ICONS = [
  '🏃', '📖', '💧', '🧘', '🏋️', '🎯', '💤', '🥗',
  '✍️', '🎵', '🧹', '📱', '🚶', '🍎', '🧠', '☀️',
]

export const WEEKDAYS_NO = ['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø']

export const MONTHS_NO = [
  'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Desember',
]

export function fmt(d) {
  return d.toISOString().split('T')[0]
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export const STREAK_MILESTONES = [3, 7, 10, 14, 21, 30, 50, 66, 100]
