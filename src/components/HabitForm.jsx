import { useState } from 'react'
import { COLORS, ICONS } from '../lib/constants'

export default function HabitForm({ habit, onSave, onArchive, onClose }) {
  const [name, setName] = useState(habit?.name || '')
  const [color, setColor] = useState(habit?.color || COLORS[0])
  const [icon, setIcon] = useState(habit?.icon || ICONS[0])
  const [freq, setFreq] = useState(habit?.target_frequency || 'daily')

  function handleSubmit() {
    if (!name.trim()) return
    onSave({
      ...(habit || {}),
      name: name.trim(),
      color,
      icon,
      target_frequency: freq,
      target_count: 1,
    })
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-[200] p-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-warm-800 rounded-3xl p-7 w-full max-w-md max-h-[80vh] overflow-auto animate-scale-in shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold">
            {habit ? 'Rediger vane' : 'Ny vane'}
          </h3>
          <button onClick={onClose} className="p-1 text-warm-400 hover:text-warm-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Name */}
        <label className="text-[13px] font-semibold text-warm-500 block mb-1.5">Navn</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="F.eks. Trening, Les 30 min..."
          className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-warm-300 dark:border-warm-600 bg-warm-50 dark:bg-warm-900 text-warm-900 dark:text-warm-100 text-[15px] outline-none focus:border-terra-500 transition-colors mb-5 font-body"
        />

        {/* Icons */}
        <label className="text-[13px] font-semibold text-warm-500 block mb-2">Ikon</label>
        <div className="flex flex-wrap gap-2 mb-5">
          {ICONS.map((ic) => (
            <button
              key={ic}
              onClick={() => setIcon(ic)}
              className={`w-10 h-10 rounded-xl border-[1.5px] flex items-center justify-center text-lg transition-all ${
                icon === ic
                  ? 'border-terra-500 bg-terra-500/10'
                  : 'border-warm-300 dark:border-warm-600 bg-warm-50 dark:bg-warm-900'
              }`}
            >
              {ic}
            </button>
          ))}
        </div>

        {/* Colors */}
        <label className="text-[13px] font-semibold text-warm-500 block mb-2">Farge</label>
        <div className="flex flex-wrap gap-2 mb-5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className="w-9 h-9 rounded-xl transition-transform hover:scale-110"
              style={{
                background: c,
                border: color === c ? '3px solid currentColor' : '3px solid transparent',
              }}
            />
          ))}
        </div>

        {/* Frequency */}
        <label className="text-[13px] font-semibold text-warm-500 block mb-2">Frekvens</label>
        <div className="flex gap-2 mb-7">
          {[
            { id: 'daily', label: 'Daglig' },
            { id: 'weekly', label: 'Ukentlig' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFreq(f.id)}
              className={`flex-1 py-2.5 rounded-xl border-[1.5px] font-semibold text-sm transition-all ${
                freq === f.id
                  ? 'border-terra-500 bg-terra-500/10 text-terra-500'
                  : 'border-warm-300 dark:border-warm-600 text-warm-500'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-br from-terra-500 to-terra-600 text-white font-bold text-[15px] shadow-lg shadow-terra-500/25 hover:-translate-y-0.5 transition-transform"
        >
          {habit ? 'Lagre endringer' : 'Opprett vane'}
        </button>

        {/* Archive */}
        {onArchive && (
          <button
            onClick={onArchive}
            className="w-full py-3 mt-2.5 rounded-2xl text-red-500 font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Arkiver vane
          </button>
        )}
      </div>
    </div>
  )
}
