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

export function CheckList({ items, checks, onToggle, title }: Props) {
  const [bouncingId, setBouncingId] = useState<string | null>(null)

  if (items.length === 0) return null

  const handleToggle = (id: string) => {
    setBouncingId(id)
    onToggle(id)
    setTimeout(() => setBouncingId(null), 200)
  }

  return (
    <div className="card p-4 mb-4">
      <p className="section-label mb-3">{title}</p>
      <div className="space-y-0.5">
        {items.map(item => {
          const checked = !!checks[item.id]
          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-left ${
                bouncingId === item.id ? 'animate-check-bounce' : ''
              } ${checked ? 'opacity-50' : ''}`}
            >
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs shrink-0 transition-colors ${
                  checked
                    ? 'bg-[#7c6d8e] border-[#7c6d8e] text-white'
                    : 'border-[#d4cdc6] bg-white'
                }`}
              >
                {checked && '✓'}
              </span>
              <span className="text-base">{item.emoji}</span>
              <span
                className={`flex-1 text-sm ${
                  checked ? 'line-through text-[#8a8583]' : 'text-[#3d3a38]'
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
