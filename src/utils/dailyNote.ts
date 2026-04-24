import type { ChildProfile, EventItem, Weather } from '../types/index.ts'

interface NoteItem {
  id: string
  name: string
  emoji: string
}

interface BuildNoteParams {
  date: Date
  profile: ChildProfile | null
  weather: Weather
  items: NoteItem[]
  checks: Record<string, boolean>
  events: EventItem[]
}

const weatherLabel: Record<Weather, string> = {
  sunny: '☀️ 晴れ',
  cloudy: '☁️ くもり',
  rainy: '🌧 雨',
  hot: '🥵 暑い日',
  cold: '🥶 寒い日',
}

const dayNames = ['日', '月', '火', '水', '木', '金', '土']

export function buildDailyNote({ date, profile, weather, items, checks, events }: BuildNoteParams): string {
  const dateStr = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}（${dayNames[date.getDay()]}）`

  const checked = items.filter(i => checks[i.id])
  const unchecked = items.filter(i => !checks[i.id])
  const total = items.length
  const allDone = total > 0 && checked.length === total

  const lines: string[] = []
  lines.push(`📋 ${dateStr} の持ち物記録`)
  if (profile) {
    lines.push(`👶 ${profile.name}${profile.gardenName ? `（${profile.gardenName}）` : ''}`)
  }
  lines.push(`🌤 天気: ${weatherLabel[weather]}`)
  lines.push(`✅ 完了: ${checked.length}/${total}${allDone ? ' 🎉 全部OK!' : ''}`)
  lines.push('')

  if (events.length > 0) {
    lines.push('🎪 今日のイベント')
    for (const event of events) {
      lines.push(`・${event.name}`)
    }
    lines.push('')
  }

  if (checked.length > 0) {
    lines.push('✔️ 持った物')
    for (const item of checked) {
      lines.push(`${item.emoji} ${item.name}`)
    }
    lines.push('')
  }

  if (unchecked.length > 0) {
    lines.push('⚠️ 未チェック')
    for (const item of unchecked) {
      lines.push(`${item.emoji} ${item.name}`)
    }
    lines.push('')
  }

  lines.push('#もちものチェック')

  return lines.join('\n').trimEnd()
}
