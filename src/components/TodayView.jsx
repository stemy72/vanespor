import { useState } from 'react'
import { fmt } from '../lib/constants'

const TODAY = new Date()

export default function TodayView({ habits, logs, onToggle, onEdit, onAdd }) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const dateStr = fmt(selectedDate)
  const isToday = dateStr === fmt(TODAY)

  const completed = habits.filter((h) => logs.isLogged(h.id, selectedDate)).length
  const total = habits.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

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

  return (
    <>
      {/* Date nav */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={prevDay} className="p-2 text-warm-500 hover:text-warm-700 dark:hover:text-warm-300 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="text-center">
          <div className="font-display text-[22px] font-bold tracking-tight">
            {isToday ? 'I dag' : selectedDate.toLocaleDateString('nb-NO', { weekday: 'long' })}
          </div>
          <div className="text-[13px] text-warm-500 mt-0.5">
            {selectedDate.toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <button
          onClick={nextDay}
          className={`p-2 transition-colors ${isToday ? 'text-warm-300 dark:text-warm-700 cursor-default' : 'text-warm-500 hover:text-warm-700 dark:hover:text-warm-300'}`}
          disabled={isToday}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-warm-800 rounded-2xl p-5 mb-5 shadow-sm border border-warm-200 dark:border-warm-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-warm-500 font-medium">Dagens fremgang</span>
          <span className={`font-display text-2xl font-bold ${pct === 100 ? 'text-forest-500' : ''}`}>
            {pct}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-warm-200 dark:bg-warm-700 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${pct}%`,
              background: pct === 100
                ? 'linear-gradient(90deg, #5B8C5A, #7AB87A)'
                : 'linear-gradient(90deg, #D4764E, #B85A35)',
            }}
          />
        </div>
        <div className="text-xs text-warm-400 mt-2">
          {completed} av {total} vaner fullført
        </div>
      </div>

      {/* Habit list */}
      {habits.map((habit, i) => {
        const done = logs.isLogged(habit.id, selectedDate)
        const streak = logs.getStreak(habit.id)
        return (
          <div
            key={habit.id}
            className={`flex items-center gap-3.5 p-4 rounded-2xl mb-2.5 shadow-sm border cursor-pointer transition-all duration-200 ${
              done
                ? 'bg-forest-500/5 dark:bg-forest-500/10 border-forest-500/20'
                : 'bg-white dark:bg-warm-800 border-warm-200 dark:border-warm-700 hover:border-warm-300'
            }`}
            style={{ animationDelay: `${i * 60}ms` }}
            onClick={() => onToggle(habit.id, selectedDate)}
          >
            {/* Icon/check */}
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-250 ${done ? 'animate-check' : ''}`}
              style={{
                background: done ? habit.color : `${habit.color}18`,
              }}
            >
              {done ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <span className="text-[22px]">{habit.icon}</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className={`text-[15px] font-semibold ${done ? 'text-forest-500' : ''}`}>
                {habit.name}
              </div>
              {streak > 0 && (
                <div className="flex items-center gap-1 mt-0.5 text-terra-500 text-xs font-semibold">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 23c-4.97 0-9-3.58-9-8 0-3.19 2.13-6.38 4-8 0 3 2 5 3 5 0-4 3-8 5-10 1 2 2 4 2 6 1-1 2-2.5 2-4 2.5 3 4 6 4 9 0 4.42-4.03 8-9 8h-2z"/>
                  </svg>
                  {streak} {streak === 1 ? 'dag' : 'dager'} på rad
                </div>
              )}
            </div>

            {/* Edit button */}
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(habit) }}
              className="p-1.5 rounded-lg text-warm-400 hover:text-warm-600 dark:hover:text-warm-300 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>
        )
      })}

      {/* Add button */}
      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border-2 border-dashed border-warm-300 dark:border-warm-600 text-warm-500 text-sm font-semibold mt-2 hover:border-terra-500 hover:text-terra-500 transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Legg til ny vane
      </button>
    </>
  )
}
