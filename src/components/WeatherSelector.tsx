import type { Weather } from '../types/index.ts'
import { weatherLabels } from '../data/items.ts'

interface Props {
  selected: Weather
  onChange: (weather: Weather) => void
  accentColor: string
}

const weathers: Weather[] = ['sunny', 'cloudy', 'rainy', 'hot', 'cold']

export function WeatherSelector({ selected, onChange }: Props) {
  return (
    <div className="card p-3 mb-4">
      <p className="section-label mb-2">weather</p>
      <div className="flex gap-1.5">
        {weathers.map(w => {
          const { emoji, label } = weatherLabels[w]
          const isActive = selected === w
          return (
            <button
              key={w}
              onClick={() => onChange(w)}
              className={`flex-1 py-2 rounded-xl text-xs transition-all ${
                isActive
                  ? 'bg-[#7c6d8e] text-white font-medium'
                  : 'bg-[#faf8f5] text-[#8a8583]'
              }`}
            >
              <span className="block text-base">{emoji}</span>
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
