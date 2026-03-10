import { useState } from 'react'
import type { CheckState } from '../types/index.ts'

interface CheckItem {
  id: string
  name: string
  emoji: string
}

interface Props {
  items: CheckItem[]
  checks: CheckState
  onToggle: (itemId: string) => void
  accentColor: string
  title: string
}

export function CheckList({ items, checks, onToggle, accentColor, title }: Props) {
  const [bouncingId, setBouncingId] = useState<string | null>(null)

  if (items.length === 0) return null

  const handleToggle = (id: string) => {
    setBouncingId(id)
    onToggle(id)
    setTimeout(() => setBouncingId(null), 250)
  }

  return (
    <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      <p className="text-sm text-gray-500 mb-3 font-medium">{title}</p>
      <div className="space-y-2">
        {items.map(item => {
          const checked = !!checks[item.id]
          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                checked ? 'bg-gray-50' : 'bg-gray-50/50'
              } ${bouncingId === item.id ? 'animate-check-bounce' : ''}`}
            >
              <span
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all text-sm ${
                  checked ? 'text-white' : ''
                }`}
                style={{
                  borderColor: accentColor,
                  backgroundColor: checked ? accentColor : 'transparent',
                }}
              >
                {checked && '✓'}
              </span>
              <span className="text-xl">{item.emoji}</span>
              <span
                className={`flex-1 font-medium transition-all ${
                  checked ? 'line-through text-gray-400' : 'text-gray-700'
                }`}
              >
                {item.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
