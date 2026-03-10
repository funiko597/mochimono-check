import type { Weather } from '../types/index.ts'
import { weatherLabels } from '../data/items.ts'

interface Props {
  selected: Weather
  onChange: (weather: Weather) => void
  accentColor: string
}

const weathers: Weather[] = ['sunny', 'cloudy', 'rainy', 'hot', 'cold']

export function WeatherSelector({ selected, onChange, accentColor }: Props) {
  return (
    <div className="bg-white rounded-2xl p-3 mb-4 shadow-sm">
      <p className="text-sm text-gray-500 mb-2 font-medium">今日の天気</p>
      <div className="flex gap-1.5">
        {weathers.map(w => {
          const { emoji, label } = weatherLabels[w]
          const isActive = selected === w
          return (
            <button
              key={w}
              onClick={() => onChange(w)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? `text-white shadow-md scale-105`
                  : 'bg-gray-50 text-gray-600'
              }`}
              style={isActive ? { backgroundColor: accentColor } : undefined}
            >
              <span className="block text-lg">{emoji}</span>
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
