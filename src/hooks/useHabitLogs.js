import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useHabitLogs() {
  const { user } = useAuth()
  const [logs, setLogs] = useState({}) // key: "habitId_YYYY-MM-DD" → true

  const fetchLogs = useCallback(async (startDate, endDate) => {
    if (!user) return
    const { data, error } = await supabase
      .from('habit_logs')
      .select('habit_id, logged_date')
      .gte('logged_date', startDate)
      .lte('logged_date', endDate)

    if (!error && data) {
      const map = {}
      data.forEach((log) => {
        map[`${log.habit_id}_${log.logged_date}`] = true
      })
      setLogs((prev) => ({ ...prev, ...map }))
    }
  }, [user])

  // Load last 90 days on mount
  useEffect(() => {
    if (!user) return
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 90)
    fetchLogs(fmt(start), fmt(end))
  }, [user, fetchLogs])

  async function toggleLog(habitId, date) {
    if (!user) return
    const dateStr = fmt(date)
    const key = `${habitId}_${dateStr}`
    const isCompleted = !!logs[key]

    if (isCompleted) {
      // Optimistic remove
      setLogs((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })

      const { error } = await supabase
        .from('habit_logs')
        .delete()
        .eq('habit_id', habitId)
        .eq('logged_date', dateStr)

      if (error) {
        console.error('Feil ved sletting av logg:', error)
        setLogs((prev) => ({ ...prev, [key]: true }))
      }
    } else {
      // Optimistic add
      setLogs((prev) => ({ ...prev, [key]: true }))

      const { error } = await supabase
        .from('habit_logs')
        .insert({
          habit_id: habitId,
          user_id: user.id,
          logged_date: dateStr,
        })

      if (error) {
        console.error('Feil ved opprettelse av logg:', error)
        setLogs((prev) => {
          const next = { ...prev }
          delete next[key]
          return next
        })
      }
    }
  }

  function isLogged(habitId, date) {
    return !!logs[`${habitId}_${fmt(date)}`]
  }

  function getStreak(habitId) {
    let streak = 0
    const d = new Date()
    if (logs[`${habitId}_${fmt(d)}`]) streak++
    else return 0
    d.setDate(d.getDate() - 1)
    while (logs[`${habitId}_${fmt(d)}`]) {
      streak++
      d.setDate(d.getDate() - 1)
    }
    return streak
  }

  function getCompletionRate(habitId, days) {
    let completed = 0
    for (let i = 0; i < days; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      if (logs[`${habitId}_${fmt(d)}`]) completed++
    }
    return Math.round((completed / days) * 100)
  }

  return { logs, toggleLog, isLogged, getStreak, getCompletionRate, fetchLogs }
}

function fmt(d) {
  return d.toISOString().split('T')[0]
}
