import { useState } from 'react'
import type { EventItem } from '../types/index.ts'

interface Props {
  events: EventItem[]
  onAdd: (event: Omit<EventItem, 'id'>) => void
  onRemove: (eventId: string) => void
  accentColor: string
}

export function EventManager({ events, onAdd, onRemove }: Props) {
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
    <div className="card p-4 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between"
      >
        <p className="section-label">events</p>
        <span className={`text-[#d4cdc6] text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3">
          {events.length > 0 && (
            <div className="space-y-2">
              {events.map(event => (
                <div key={event.id} className="flex items-start gap-2 p-2.5 bg-[#faf8f5] rounded-xl border border-[#ebe7e3]">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#3d3a38]">
                      <span className="font-number">{event.date}</span> - {event.name}
                    </p>
                    {event.items.length > 0 && (
                      <p className="text-xs text-[#8a8583] truncate mt-0.5">
                        {event.items.join('、')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onRemove(event.id)}
                    className="text-[#d4cdc6] hover:text-rose-400 text-sm px-1 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-[#ebe7e3] pt-3 space-y-2">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-[#ebe7e3] rounded-lg px-3 py-2 text-sm bg-white/80 focus:outline-none focus:border-[#7c6d8e] font-number"
            />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="イベント名"
              className="w-full border border-[#ebe7e3] rounded-lg px-3 py-2 text-sm bg-white/80 focus:outline-none focus:border-[#7c6d8e]"
            />
            <input
              type="text"
              value={itemsText}
              onChange={e => setItemsText(e.target.value)}
              placeholder="持ち物（カンマ区切り）"
              className="w-full border border-[#ebe7e3] rounded-lg px-3 py-2 text-sm bg-white/80 focus:outline-none focus:border-[#7c6d8e]"
            />
            <button
              onClick={handleAdd}
              disabled={!date || !name}
              className="w-full py-2 rounded-lg text-white text-sm font-medium disabled:opacity-30 bg-[#7c6d8e]"
            >
              追加する
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
