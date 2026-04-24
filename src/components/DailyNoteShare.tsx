import { useMemo, useState } from 'react'
import type { ChildProfile, EventItem, Weather } from '../types/index.ts'
import { buildDailyNote } from '../utils/dailyNote.ts'

interface NoteItem {
  id: string
  name: string
  emoji: string
}

interface Props {
  profile: ChildProfile | null
  weather: Weather
  items: NoteItem[]
  checks: Record<string, boolean>
  events: EventItem[]
  accentColor: string
}

type FeedbackState = 'idle' | 'shared' | 'copied' | 'error'

export function DailyNoteShare({ profile, weather, items, checks, events }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackState>('idle')

  const note = useMemo(
    () =>
      buildDailyNote({
        date: new Date(),
        profile,
        weather,
        items,
        checks,
        events,
      }),
    [profile, weather, items, checks, events]
  )

  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const flash = (state: FeedbackState) => {
    setFeedback(state)
    setTimeout(() => setFeedback('idle'), 1800)
  }

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(note)
      } else {
        const ta = document.createElement('textarea')
        ta.value = note
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      flash('copied')
    } catch {
      flash('error')
    }
  }

  const handleShare = async () => {
    if (!canShare) {
      await copyToClipboard()
      return
    }
    try {
      await navigator.share({
        title: '今日のもちものチェック',
        text: note,
      })
      flash('shared')
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      await copyToClipboard()
    }
  }

  const feedbackLabel =
    feedback === 'shared' ? 'シェアしました ✓'
      : feedback === 'copied' ? 'コピーしました ✓'
      : feedback === 'error' ? '失敗しました'
      : ''

  if (items.length === 0) return null

  return (
    <div className="card p-4 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between"
      >
        <p className="section-label">share note</p>
        <span className={`text-[#d4cdc6] text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3">
          <pre className="whitespace-pre-wrap text-xs text-[#3d3a38] leading-relaxed bg-[#faf8f5] border border-[#ebe7e3] rounded-xl p-3 font-sans max-h-60 overflow-auto">
            {note}
          </pre>

          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex-1 px-4 py-2 rounded-lg text-white text-sm font-medium bg-[#7c6d8e]"
            >
              {canShare ? '📤 シェア' : '📋 コピー'}
            </button>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 rounded-lg text-[#7c6d8e] text-sm font-medium border border-[#7c6d8e] bg-white/80"
            >
              コピー
            </button>
          </div>

          {feedbackLabel && (
            <p className="text-xs text-[#8a8583] text-center">{feedbackLabel}</p>
          )}
        </div>
      )}
    </div>
  )
}
