import { useState } from 'react'
import type { ChildType, CustomItem } from '../types/index.ts'

interface Props {
  child: ChildType
  items: CustomItem[]
  onAdd: (child: ChildType, name: string, emoji: string) => void
  onRemove: (child: ChildType, itemId: string) => void
  accentColor: string
}

export function CustomItemManager({ child, items, onAdd, onRemove, accentColor }: Props) {
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
    <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between"
      >
        <span className="text-sm text-gray-500 font-medium">✏️ カスタム持ち物</span>
        <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3">
          {items.length > 0 && (
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                  <span className="text-lg">{item.emoji}</span>
                  <span className="flex-1 text-sm font-medium text-gray-700">{item.name}</span>
                  <button
                    onClick={() => onRemove(child, item.id)}
                    className="text-gray-400 hover:text-red-400 text-sm px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-3 flex gap-2">
            <input
              type="text"
              value={emoji}
              onChange={e => setEmoji(e.target.value)}
              className="w-12 border border-gray-200 rounded-xl px-2 py-2 text-center text-lg"
              maxLength={2}
            />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="持ち物名"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <button
              onClick={handleAdd}
              disabled={!name}
              className="px-4 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-40"
              style={{ backgroundColor: accentColor }}
            >
              追加
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
