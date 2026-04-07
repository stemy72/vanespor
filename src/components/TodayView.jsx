import { useState, useCallback } from 'react'
import { fmt, STREAK_MILESTONES } from '../lib/constants'

const TODAY = new Date()

// ── Konfetti-animasjon ────────────────────────────────────────────────────────
function triggerConfetti(habitId, color) {
  const row = document.getElementById(`habit-row-${habitId}`)
  if (!row) return

  // Fjern evt. gammel overlay
  row.querySelectorAll('.confetti-overlay').forEach(el => el.remove())

  const overlay = document.createElement('div')
  overlay.className = 'confetti-overlay'
  overlay.style.cssText =
    'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden;border-radius:inherit;z-index:20'
  row.style.position = 'relative'
  row.appendChild(overlay)

  const lightColor = color + '33'
  const particles = [color, lightColor, '#ffffff', '#EF9F27', color]

  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div')
    const size = 5 + Math.random() * 5
    const x = Math.random() * 100
    const delay = Math.random() * 250
    const dur = 450 + Math.random() * 350
    const endY = -(25 + Math.random() * 55)
    const endX = (Math.random() - 0.5) * 90
    const c = particles[i % particles.length]

    p.style.cssText = `
      position:absolute;
      left:${x}%;bottom:8px;
      width:${size}px;height:${size}px;
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      background:${c};
      opacity:0;
      transition:all ${dur}ms ease-out;
      transform:translate(0,0) rotate(0deg)
    `
    overlay.appendChild(p)

    setTimeout(() => {
      p.style.opacity = '1'
      p.style.transform = `translate(${endX}px,${endY}px) rotate(${Math.random() * 400}deg)`
      setTimeout(() => {
        p.style.opacity = '0'
      }, dur * 0.55)
    }, delay)
  }

  setTimeout(() => overlay.remove(), 1400)
}

// ── Milepæl-banner ────────────────────────────────────────────────────────────
function MilestoneBanner({ habit, streak, onDismiss }) {
  return (
    <div className="mb-3 rounded-2xl border border-forest-300 dark:border-forest-700 bg-forest-50 dark:bg-forest-950 px-4 py-3 flex gap-3 items-start animate-fade-up">
      <span className="text-2xl mt-0.5">🏆</span>
      <div className="flex-1">
        <p className="font-semibold text-[14px] text-forest-800 dark:text-forest-200">
          {streak} dager! Fantastisk!
        </p>
        <p className="text-[13px] text-forest-700 dark:text-forest-300 mt-0.5">
          Du har fullført «{habit.name}» {streak} dager på rad. Hold det gående!
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="text-forest-500 hover:text-forest-700 dark:hover:text-forest-300 transition-colors mt-0.5"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  )
}

// ── Streak-advarsel banner ────────────────────────────────────────────────────
function StreakWarningBanner({ habits }) {
  if (habits.length === 0) return null
  const names = habits.map(h => `${h.icon} ${h.name}`).join(', ')
  return (
    <div className="mb-3 rounded-2xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950 px-4 py-3 flex gap-3 items-start animate-fade-up">
      <span className="text-xl mt-0.5">⚠️</span>
      <div>
        <p className="font-semibold text-[13px] text-amber-900 dark:text-amber-200">
          Ikke gå glipp av to dager på rad
        </p>
        <p className="text-[12px] text-amber-800 dark:text-amber-300 mt-0.5">
          Du gikk glipp av {names} i går. Fullfør i dag for å holde streaken i live!
        </p>
      </div>
    </div>
  )
}

export default function TodayView({ habits, logs, onToggle, onEdit, onAdd }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [milestones, setMilestones] = useState([]) // [{habitId, streak}]

  const dateStr = fmt(selectedDate)
  const isToday = dateStr === fmt(TODAY)

  const completed = habits.filter((h) => logs.isLogged(h.id, selectedDate)).length
  const total = habits.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  // Vaner som gikk glipp av i går OG ikke er fullført i dag OG har aktiv streak
  const atRisk = isToday
    ? habits.filter(h => {
        const streak = logs.getStreak(h.id)
        return streak > 0 && logs.missedYesterday(h.id) && !logs.isLogged(h.id, selectedDate)
      })
    : []

  function prevDay() {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() - 1)
    setSelectedDate(d)
  }

  function nextDay() {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + 1)
    if (d <= TODAY) setSelectedDate(d)
  }

  const handleToggle = useCallback((habit, date) => {
    const wasLogged = logs.isLogged(habit.id, date)
    onToggle(habit.id, date)

    // Sjekk for feiring kun ved fullføring av dagens vaner
    if (!wasLogged && fmt(date) === fmt(TODAY)) {
      const newStreak = logs.getStreak(habit.id) + 1
      if (STREAK_MILESTONES.includes(newStreak)) {
        setMilestones(prev => [...prev, { habitId: habit.id, streak: newStreak }])
        setTimeout(() => triggerConfetti(habit.id, habit.color), 80)
      } else {
        triggerConfetti(habit.id, habit.color)
      }
    }
  }, [logs, onToggle])

  function dismissMilestone(habitId) {
    setMilestones(prev => prev.filter(m => m.habitId !== habitId))
  }

  return (
    <>
      {/* Datonavigasjon */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevDay}
          className="p-2 text-warm-500 hover:text-warm-700 dark:hover:text-warm-300 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="text-center">
          <div className="font-display text-[22px] font-bold tracking-tight">
            {isToday ? 'I dag' : selectedDate.toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          {isToday && (
            <div className="text-xs text-warm-400 mt-0.5">
              {selectedDate.toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          )}
        </div>
        <button
          onClick={nextDay}
          className="p-2 text-warm-500 hover:text-warm-700 dark:hover:text-warm-300 transition-colors"
          style={{ opacity: isToday ? 0.25 : 1, pointerEvents: isToday ? 'none' : 'auto' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* Samlet dagsoversikt */}
      <div className="bg-white dark:bg-warm-800 rounded-2xl p-4 mb-4 shadow-sm border border-warm-200 dark:border-warm-700">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-medium text-warm-500 mb-0.5">Dagens oversikt</p>
            <p className="font-display text-[28px] font-bold leading-none">{completed}/{total}</p>
            <p className="text-xs text-warm-400 mt-0.5">vaner fullført</p>
          </div>
          <div className="text-right">
            <p
              className="font-display text-[32px] font-bold leading-none"
              style={{ color: pct >= 80 ? '#5B8C5A' : pct >= 50 ? '#D4764E' : '#9B9B8E' }}
            >
              {pct}%
            </p>
            <p className="text-xs text-warm-400 mt-0.5">fullføringsrate</p>
          </div>
        </div>

        {/* Fremdriftslinje */}
        <div className="h-1.5 rounded-full bg-warm-100 dark:bg-warm-700 overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: pct >= 80 ? '#5B8C5A' : pct >= 50 ? '#D4764E' : '#B4B2A9',
            }}
          />
        </div>

        {/* Prikker per vane */}
        <div className="flex flex-wrap gap-1.5">
          {habits.map(h => {
            const done = logs.isLogged(h.id, selectedDate)
            return (
              <div key={h.id} className="flex items-center gap-1.5 text-xs text-warm-500">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    background: done ? h.color : h.color + '22',
                    border: `1px solid ${h.color}55`,
                  }}
                />
                {h.icon} {h.name}
              </div>
            )
          })}
        </div>
      </div>

      {/* Milepæl-bannere */}
      {milestones.map(m => {
        const habit = habits.find(h => h.id === m.habitId)
        if (!habit) return null
        return (
          <MilestoneBanner
            key={`${m.habitId}-${m.streak}`}
            habit={habit}
            streak={m.streak}
            onDismiss={() => dismissMilestone(m.habitId)}
          />
        )
      })}

      {/* Streak-advarsel */}
      <StreakWarningBanner habits={atRisk} />

      {/* Vaneliste */}
      {habits.map((habit, i) => {
        const done = logs.isLogged(habit.id, selectedDate)
        const streak = logs.getStreak(habit.id)
        const isAtRisk = atRisk.some(h => h.id === habit.id)

        return (
          <div
            key={habit.id}
            id={`habit-row-${habit.id}`}
            className="flex items-center gap-3 bg-white dark:bg-warm-800 rounded-2xl px-4 py-3.5 mb-2.5 shadow-sm border transition-all duration-200 animate-fade-up cursor-pointer select-none active:scale-[0.98]"
            style={{
              animationDelay: `${i * 40}ms`,
              borderColor: done
                ? habit.color + '55'
                : isAtRisk
                ? '#EF9F27'
                : undefined,
              background: done ? habit.color + '12' : undefined,
            }}
            onClick={() => handleToggle(habit, selectedDate)}
          >
            {/* Ikon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: habit.color + '20' }}
            >
              {habit.icon}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p
                className="font-semibold text-[15px] leading-snug"
                style={done ? { textDecoration: 'line-through', opacity: 0.55 } : {}}
              >
                {habit.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {streak > 0 && (
                  <span className="text-xs font-medium" style={{ color: habit.color }}>
                    🔥 {streak} dager
                  </span>
                )}
                {isAtRisk && (
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                    ⚠️ Ikke to på rad!
  </span>
                )}
              </div>
            </div>

            {/* Hakeknapp */}
            <div
              className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200"
              style={
                done
                  ? { background: habit.color, border: `2px solid ${habit.color}` }
                  : { border: '1.5px solid #C8C5BC' }
              }
            >
              {done && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>

            {/* Rediger-knapp */}
            <button
              className="p-1 text-warm-400 hover:text-warm-600 transition-colors"
              onClick={(e) => { e.stopPropagation(); onEdit(habit) }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>
        )
      })}

      {/* Tom tilstand */}
      {habits.length === 0 && (
        <div className="text-center text-warm-400 py-14">
          <div className="text-4xl mb-3">🌱</div>
          <p className="font-semibold text-warm-600 dark:text-warm-300 mb-1">Ingen vaner ennå</p>
          <p className="text-sm">Opprett din første vane og kom i gang!</p>
        </div>
      )}

      {/* Legg til vane */}
      <button
        onClick={onAdd}
        className="w-full mt-2 py-3.5 rounded-2xl border-2 border-dashed border-warm-300 dark:border-warm-600 text-warm-400 dark:text-warm-500 text-[14px] font-medium flex items-center justify-center gap-2 hover:border-terra-400 hover:text-terra-500 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Legg til ny vane
      </button>
    </>
  )
}
