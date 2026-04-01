import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useHabits() {
  const { user } = useAuth()
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchHabits = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('is_archived', false)
      .order('sort_order', { ascending: true })
    if (!error) setHabits(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  async function createHabit({ name, color, icon, targetFrequency, targetCount }) {
    const sortOrder = habits.length
    const newHabit = {
      user_id: user.id,
      name,
      color: color || '#D4764E',
      icon: icon || '🎯',
      target_frequency: targetFrequency || 'daily',
      target_count: targetCount || 1,
      sort_order: sortOrder,
    }

    // Optimistic
    const tempId = crypto.randomUUID()
    setHabits((prev) => [...prev, { ...newHabit, id: tempId }])

    const { data, error } = await supabase
      .from('habits')
      .insert(newHabit)
      .select()
      .single()

    if (error) {
      console.error('Feil ved opprettelse:', error)
      setHabits((prev) => prev.filter((h) => h.id !== tempId))
    } else {
      setHabits((prev) => prev.map((h) => (h.id === tempId ? data : h)))
    }
    return data
  }

  async function updateHabit(id, updates) {
    // Optimistic
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)))

    const { error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Feil ved oppdatering:', error)
      fetchHabits()
    }
  }

  async function archiveHabit(id) {
    setHabits((prev) => prev.filter((h) => h.id !== id))

    const { error } = await supabase
      .from('habits')
      .update({ is_archived: true })
      .eq('id', id)

    if (error) {
      console.error('Feil ved arkivering:', error)
      fetchHabits()
    }
  }

  return { habits, loading, createHabit, updateHabit, archiveHabit, refetch: fetchHabits }
}
