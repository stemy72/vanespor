import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { useHabits } from './hooks/useHabits'
import { useHabitLogs } from './hooks/useHabitLogs'
import LoginPage from './components/LoginPage'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import TodayView from './components/TodayView'
import CalendarView from './components/CalendarView'
import StatsView from './components/StatsView'
import HabitForm from './components/HabitForm'

function AppContent() {
  const { user, loading: authLoading } = useAuth()
  const { habits, loading: habitsLoading, createHabit, updateHabit, archiveHabit } = useHabits()
  const habitLogs = useHabitLogs()

  const [view, setView] = useState('today')
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-100 dark:bg-warm-950">
        <div className="text-center animate-fade-up">
          <div className="text-4xl mb-4">🎯</div>
          <div className="font-display text-xl font-bold text-warm-900 dark:text-warm-100">
            Vanespor
          </div>
          <div className="text-sm text-warm-500 mt-1">Laster...</div>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return <LoginPage />
  }

  function handleSave(data) {
    if (data.id) {
      updateHabit(data.id, {
        name: data.name,
        color: data.color,
        icon: data.icon,
        target_frequency: data.target_frequency,
        target_count: data.target_count,
      })
    } else {
      createHabit({
        name: data.name,
        color: data.color,
        icon: data.icon,
        targetFrequency: data.target_frequency,
        targetCount: data.target_count,
      })
    }
    setShowForm(false)
    setEditingHabit(null)
  }

  function handleArchive() {
    if (editingHabit) {
      archiveHabit(editingHabit.id)
      setShowForm(false)
      setEditingHabit(null)
    }
  }

  return (
    <div className="min-h-screen bg-warm-100 dark:bg-warm-950 text-warm-900 dark:text-warm-100 transition-colors duration-300">
      <Header />

      <main className="max-w-xl mx-auto px-5 pt-4 pb-24">
        {view === 'today' && (
          <TodayView
            habits={habits}
            logs={habitLogs}
            onToggle={habitLogs.toggleLog}
            onEdit={(h) => { setEditingHabit(h); setShowForm(true) }}
            onAdd={() => { setEditingHabit(null); setShowForm(true) }}
          />
        )}
        {view === 'calendar' && (
          <CalendarView
            habits={habits}
            logs={habitLogs}
            onToggle={habitLogs.toggleLog}
          />
        )}
        {view === 'stats' && (
          <StatsView habits={habits} logs={habitLogs} />
        )}
      </main>

      <BottomNav view={view} setView={setView} />

      {showForm && (
        <HabitForm
          habit={editingHabit}
          onSave={handleSave}
          onArchive={editingHabit ? handleArchive : null}
          onClose={() => { setShowForm(false); setEditingHabit(null) }}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}
