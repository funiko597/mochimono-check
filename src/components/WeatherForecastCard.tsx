import type { WeatherForecast } from '../hooks/useWeatherForecast'
import { getWeatherInfo, getClothingAdvice } from '../hooks/useWeatherForecast'

interface Props {
  forecast: WeatherForecast | null
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string
  retry: () => void
  accentColor: string
}

export function WeatherForecastCard({ forecast, status, error, retry }: Props) {
  if (status === 'idle' || status === 'loading') {
    return (
      <div className="card p-4 mb-4">
        <p className="section-label mb-2">weather</p>
        <div className="flex items-center justify-center py-4">
          <span className="text-lg animate-spin">⏳</span>
          <span className="text-xs text-[#8a8583] ml-2">取得中...</span>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="card p-4 mb-4">
        <p className="section-label mb-2">weather</p>
        <div className="text-center py-3">
          <p className="text-xs text-[#8a8583] mb-2">{error}</p>
          <button
            onClick={retry}
            className="text-xs text-white px-4 py-1.5 rounded-lg bg-[#7c6d8e]"
          >
            再取得
          </button>
        </div>
      </div>
    )
  }

  if (!forecast) return null

  const weatherInfo = getWeatherInfo(forecast.weatherCode)
  const advice = getClothingAdvice(forecast)

  return (
    <div className="card p-4 mb-4">
      <p className="section-label mb-3">weather</p>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{weatherInfo.emoji}</span>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-[#3d3a38] font-number">
              {Math.round(forecast.temperature)}°
            </span>
            <span className="text-xs text-[#8a8583]">{weatherInfo.label}</span>
          </div>
          <div className="flex gap-3 text-xs text-[#8a8583] mt-0.5 font-number">
            <span>{forecast.locationName}</span>
            <span>↑{Math.round(forecast.maxTemp)}°</span>
            <span>↓{Math.round(forecast.minTemp)}°</span>
          </div>
        </div>
      </div>

      <div className="border-t border-[#ebe7e3] pt-3">
        <p className="text-xs text-[#8a8583] font-medium mb-2">服装アドバイス</p>
        <ul className="space-y-1">
          {advice.map((item, i) => (
            <li key={i} className="text-xs text-[#3d3a38] leading-relaxed">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
