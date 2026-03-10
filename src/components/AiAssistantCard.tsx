import { useMemo } from 'react'
import type { WeatherForecast } from '../hooks/useWeatherForecast'
import type { ChildType, ChildProfile, EventItem } from '../types/index.ts'
import { generateSuggestions, type AiSuggestion } from '../utils/aiAssistant'

interface Props {
  forecast: WeatherForecast | null
  childType: ChildType
  todayEvents: EventItem[]
  profile: ChildProfile | null
  accentColor: string
}

const priorityDot = {
  high: 'bg-rose-300',
  medium: 'bg-amber-300',
  low: 'bg-[#a8c4b8]',
}

function SuggestionItem({ suggestion }: { suggestion: AiSuggestion }) {
  return (
    <div className="flex items-start gap-2.5 py-2">
      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${priorityDot[suggestion.priority]}`} />
      <p className="text-xs text-[#3d3a38] leading-relaxed">
        <span className="mr-1">{suggestion.emoji}</span>
        {suggestion.message}
      </p>
    </div>
  )
}

export function AiAssistantCard({ forecast, childType, todayEvents, profile }: Props) {
  const suggestions = useMemo(
    () => generateSuggestions(forecast, childType, todayEvents, profile),
    [forecast, childType, todayEvents, profile]
  )

  if (suggestions.length === 0) return null

  return (
    <div className="card p-4 mb-4">
      <div className="flex items-center gap-2 mb-1">
        <p className="section-label">assistant</p>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f5f0ff] text-[#7c6d8e] font-number">
          {suggestions.length}
        </span>
      </div>
      <div className="divide-y divide-[#ebe7e3]">
        {suggestions.map((suggestion, i) => (
          <SuggestionItem key={i} suggestion={suggestion} />
        ))}
      </div>
    </div>
  )
}
