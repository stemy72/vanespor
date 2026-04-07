import { useState } from 'react'
import { WEEKDAYS_NO, MONTHS_NO, getDaysInMonth, fmt } from '../lib/constants'

const TODAY = new Date()

export default function CalendarView({ habits, logs }) {
  const [month, setMonth] = useState(TODAY.getMonth())
  const [year, setYear] = useState(TODAY.getFullYear())

  const todayStr = fmt(TODAY)

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7 // 0=ma

  return (
    <>
      {/* Måned-navigasjon */}
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

      {/* ── Aggregert månedsoversikt ── */}
      <div className="bg-white dark:bg-warm-800 rounded-2xl p-4 mb-4 shadow-sm border border-warm-200 dark:border-warm-700">
        <p className="text-xs font-medium text-warm-500 mb-3">Samlet — alle vaner</p>

        {/* Ukedags-header */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS_NO.map(d => (
            <div key={d} className="text-center text-[10px] font-medium text-warm-400 py-0.5">{d}</div>
          ))}
        </div>

        {/* Dage-grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Tomme celler for første uke */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const d = new Date(year, month, day)
            const s = fmt(d)
            const isFuture = s > todayStr
            const isToday = s === todayStr

            const doneCnt = habits.filter(h => logs.isLogged(h.id, d)).length
            const pct = habits.length > 0 ? doneCnt / habits.length : 0

            let bg = 'bg-warm-100 dark:bg-warm-700'
            let textColor = 'text-warm-400'
            if (!isFuture && doneCnt > 0) {
              if (pct >= 1)       { bg = ''; textColor = '' }
              else if (pct >= 0.5) { bg = ''; textColor = '' }
              else                 { bg = ''; textColor = '' }
            }

            const bgStyle = isFuture
              ? {}
              : doneCnt === 0
              ? {}
              : pct >= 1
              ? { background: '#D4764E', color: '#fff' }
              : pct >= 0.5
              ? { background: '#EF9F27', color: '#633806' }
              : { background: '#FAEEDA', color: '#633806' }

            return (
              <div
                key={day}
                className={`aspect-square rounded-lg flex items-center justify-center text-[11px] font-medium transition-opacity ${isFuture ? 'opacity-25' : ''} ${isToday ? 'ring-2 ring-terra-500' : ''}`}
                style={{
                  background: doneCnt > 0 && !isFuture ? bgStyle.background : undefined,
                  color: doneCnt > 0 && !isFuture ? bgStyle.color : undefined,
                  fontWeight: isToday ? 700 : 400,
                }}
                title={!isFuture && doneCnt > 0 ? `${doneCnt}/${habits.length} vaner` : undefined}
              >
                {day}
              </div>
            )
          })}
        </div>

        {/* Forklaring */}
        <div className="flex gap-3 mt-3">
          {[
            { bg: '#FAEEDA', text: '#633806', label: '1–49%' },
            { bg: '#EF9F27', text: '#633806', label: '50–99%' },
            { bg: '#D4764E', text: '#fff',    label: '100%' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: l.bg }} />
              <span className="text-[11px] text-warm-400">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Per vane kalender ── */}
      {habits.map((habit) => {
        return (
          <div
            key={habit.id}
            className="bg-white dark:bg-warm-800 rounded-2xl p-4 mb-3.5 shadow-sm border border-warm-200 dark:border-warm-700"
          >
            {/* Vane-header */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: `${habit.color}20` }}
              >
                {habit.icon}
              </div>
              <span className="font-semibold text-[14px]">{habit.name}</span>
              {logs.getStreak(habit.id) > 0 && (
                <span className="text-xs font-medium ml-auto" style={{ color: habit.color }}>
                  🔥 {logs.getStreak(habit.id)} dager
                </span>
              )}
            </div>

            {/* Ukedags-header */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS_NO.map(d => (
                <div key={d} className="text-center text-[9px] font-medium text-warm-300 py-0.5">{d}</div>
              ))}
            </div>

            {/* Dage-grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`e-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const d = new Date(year, month, day)
                const s = fmt(d)
                const isFuture = s > todayStr
                const isToday = s === todayStr
                const done = logs.isLogged(habit.id, d)

                return (
                  <div
                    key={day}
                    className={`aspect-square rounded flex items-center justify-center text-[10px] transition-opacity ${isFuture ? 'opacity-20' : ''} ${isToday ? 'ring-1.5' : ''}`}
                    style={{
                      background: isFuture ? 'transparent' : done ? habit.color : `${habit.color}18`,
                      color: done ? '#fff' : undefined,
                      fontWeight: isToday ? 700 : 400,
                      ringColor: isToday ? habit.color : undefined,
                      outline: isToday ? `1.5px solid ${habit.color}` : undefined,
                    }}
                  >
                    {day}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {habits.length === 0 && (
        <div className="text-center text-warm-400 py-12">
          <p className="text-lg mb-2">Ingen vaner ennå</p>
          <p className="text-sm">Opprett din første vane for å se kalendervisning</p>
        </div>
      )}
    </>
  )
}
