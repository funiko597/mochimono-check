import { useState } from 'react'
import type { ChildType, CustomItem } from '../types/index.ts'

interface Props {
  child: ChildType
  items: CustomItem[]
  onAdd: (child: ChildType, name: string, emoji: string) => void
  onRemove: (child: ChildType, itemId: string) => void
  accentColor: string
}

export function CustomItemManager({ child, items, onAdd, onRemove }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('📦')

  const handleAdd = () => {
    if (!name) return
    onAdd(child, name, emoji)
    setName('')
    setEmoji('📦')
  }

  return (
    <div className="card p-4 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between"
      >
        <p className="section-label">custom items</p>
        <span className={`text-[#d4cdc6] text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3">
          {items.length > 0 && (
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-2 p-2.5 bg-[#faf8f5] rounded-xl border border-[#ebe7e3]">
                  <span className="text-lg">{item.emoji}</span>
                  <span className="flex-1 text-sm text-[#3d3a38]">{item.name}</span>
                  <button
                    onClick={() => onRemove(child, item.id)}
                    className="text-[#d4cdc6] hover:text-rose-400 text-sm px-1 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-[#ebe7e3] pt-3 flex gap-2">
            <input
              type="text"
              value={emoji}
              onChange={e => setEmoji(e.target.value)}
              className="w-12 border border-[#ebe7e3] rounded-lg px-2 py-2 text-center text-lg bg-white/80 focus:outline-none focus:border-[#7c6d8e]"
              maxLength={2}
            />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="持ち物名"
              className="flex-1 border border-[#ebe7e3] rounded-lg px-3 py-2 text-sm bg-white/80 focus:outline-none focus:border-[#7c6d8e]"
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <button
              onClick={handleAdd}
              disabled={!name}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-30 bg-[#7c6d8e]"
            >
              追加
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
