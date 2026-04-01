import { useState } from 'react'
import { WEEKDAYS_NO, MONTHS_NO, getDaysInMonth, fmt } from '../lib/constants'

const TODAY = new Date()

export default function CalendarView({ habits, logs, onToggle }) {
  const [month, setMonth] = useState(TODAY.getMonth())
  const [year, setYear] = useState(TODAY.getFullYear())

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(year - 1) }
    else setMonth(month - 1)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(year + 1) }
    else setMonth(month + 1)
  }

  return (
    <>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={prevMonth} className="p-2 text-warm-500 hover:text-warm-700 dark:hover:text-warm-300 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="font-display text-xl font-bold tracking-tight">
          {MONTHS_NO[month]} {year}
        </div>
        <button onClick={nextMonth} className="p-2 text-warm-500 hover:text-warm-700 dark:hover:text-warm-300 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* Per-habit calendar */}
      {habits.map((habit) => {
        const daysInMonth = getDaysInMonth(year, month)
        const firstDay = new Date(year, month, 1).getDay()
        const offset = firstDay === 0 ? 6 : firstDay - 1

        return (
          <div key={habit.id} className="bg-white dark:bg-warm-800 rounded-2xl p-4 mb-3.5 shadow-sm border border-warm-200 dark:border-warm-700">
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="text-lg">{habit.icon}</span>
              <span className="font-semibold text-[15px]">{habit.name}</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {WEEKDAYS_NO.map((d) => (
                <div key={d} className="text-center text-[10px] text-warm-400 font-semibold pb-1">
                  {d}
                </div>
              ))}
              {Array.from({ length: offset }).map((_, i) => (
                <div key={`e${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = new Date(year, month, i + 1)
                const done = logs.isLogged(habit.id, d)
                const isFuture = d > TODAY
                const isTodayCell = fmt(d) === fmt(TODAY)
                return (
                  <button
                    key={i}
                    disabled={isFuture}
                    onClick={() => onToggle(habit.id, d)}
                    className="aspect-square rounded-md flex items-center justify-center text-[10px] transition-all"
                    style={{
                      background: isFuture ? 'transparent' : done ? habit.color : `${habit.color}12`,
                      opacity: isFuture ? 0.2 : done ? 1 : 0.5,
                      color: done ? '#fff' : undefined,
                      fontWeight: isTodayCell ? 700 : 400,
                      border: isTodayCell ? `2px solid ${habit.color}` : 'none',
                      cursor: isFuture ? 'default' : 'pointer',
                    }}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </>
  )
}
