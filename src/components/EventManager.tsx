import { useState } from 'react'
import type { EventItem } from '../types/index.ts'

interface Props {
  events: EventItem[]
  onAdd: (event: Omit<EventItem, 'id'>) => void
  onRemove: (eventId: string) => void
  accentColor: string
}

export function EventManager({ events, onAdd, onRemove, accentColor }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState('')
  const [name, setName] = useState('')
  const [itemsText, setItemsText] = useState('')

  const handleAdd = () => {
    if (!date || !name) return
    const items = itemsText
      .split(/[,、\n]/)
      .map(s => s.trim())
      .filter(Boolean)
    onAdd({ date, name, items })
    setDate('')
    setName('')
    setItemsText('')
  }

  return (
    <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between"
      >
        <span className="text-sm text-gray-500 font-medium">📅 イベント管理</span>
        <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3">
          {events.length > 0 && (
            <div className="space-y-2">
              {events.map(event => (
                <div key={event.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700">
                      {event.date} - {event.name}
                    </p>
                    {event.items.length > 0 && (
                      <p className="text-xs text-gray-500 truncate">
                        {event.items.join('、')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onRemove(event.id)}
                    className="text-gray-400 hover:text-red-400 text-sm px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-3 space-y-2">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="イベント名"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={itemsText}
              onChange={e => setItemsText(e.target.value)}
              placeholder="持ち物（カンマ区切り）"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
            />
            <button
              onClick={handleAdd}
              disabled={!date || !name}
              className="w-full py-2 rounded-xl text-white text-sm font-medium disabled:opacity-40"
              style={{ backgroundColor: accentColor }}
            >
              追加する
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
