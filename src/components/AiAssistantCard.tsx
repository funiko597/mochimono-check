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

const priorityStyles = {
  high: 'border-l-4 border-red-300 bg-red-50',
  medium: 'border-l-4 border-yellow-300 bg-yellow-50',
  low: 'border-l-4 border-blue-200 bg-blue-50',
}

function SuggestionItem({ suggestion }: { suggestion: AiSuggestion }) {
  return (
    <div className={`rounded-lg p-2.5 ${priorityStyles[suggestion.priority]}`}>
      <p className="text-sm text-gray-700">
        <span className="mr-1">{suggestion.emoji}</span>
        {suggestion.message}
      </p>
    </div>
  )
}

export function AiAssistantCard({ forecast, childType, todayEvents, profile, accentColor }: Props) {
  const suggestions = useMemo(
    () => generateSuggestions(forecast, childType, todayEvents, profile),
    [forecast, childType, todayEvents, profile]
  )

  if (suggestions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
        <p className="text-sm text-gray-500 font-medium mb-2">🤖 AIお支度アシスタント</p>
        <p className="text-sm text-gray-400 text-center py-2">
          今日は特別なアドバイスはありません。いつも通りでOK！
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🤖</span>
        <p className="text-sm text-gray-500 font-medium">AIお支度アシスタント</p>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-full text-white"
          style={{ backgroundColor: accentColor }}
        >
          {suggestions.length}件
        </span>
      </div>
      <div className="space-y-2">
        {suggestions.map((suggestion, i) => (
          <SuggestionItem key={i} suggestion={suggestion} />
        ))}
      </div>
    </div>
  )
}
