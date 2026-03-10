import type { WeatherForecast } from '../hooks/useWeatherForecast'
import { getWeatherInfo, getClothingAdvice } from '../hooks/useWeatherForecast'

interface Props {
  forecast: WeatherForecast | null
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string
  retry: () => void
  accentColor: string
}

export function WeatherForecastCard({ forecast, status, error, retry, accentColor }: Props) {
  if (status === 'idle' || status === 'loading') {
    return (
      <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
        <p className="text-sm text-gray-500 font-medium mb-2">🌤️ 天気予報</p>
        <div className="flex items-center justify-center py-4">
          <span className="text-2xl animate-spin">⏳</span>
          <span className="text-sm text-gray-400 ml-2">現在地の天気を取得中...</span>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
        <p className="text-sm text-gray-500 font-medium mb-2">🌤️ 天気予報</p>
        <div className="text-center py-3">
          <p className="text-sm text-gray-400 mb-2">{error}</p>
          <button
            onClick={retry}
            className="text-sm text-white px-4 py-1.5 rounded-full"
            style={{ backgroundColor: accentColor }}
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
    <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      <p className="text-sm text-gray-500 font-medium mb-3">🌤️ 天気予報</p>

      {/* 天気情報 */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl">{weatherInfo.emoji}</span>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-700">
              {Math.round(forecast.temperature)}°C
            </span>
            <span className="text-sm text-gray-400">{weatherInfo.label}</span>
          </div>
          <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
            <span>📍 {forecast.locationName}</span>
            <span className="text-red-400">↑{Math.round(forecast.maxTemp)}°</span>
            <span className="text-blue-400">↓{Math.round(forecast.minTemp)}°</span>
          </div>
        </div>
      </div>

      {/* 服装アドバイス */}
      <div
        className="rounded-xl p-3"
        style={{ backgroundColor: `${accentColor}10` }}
      >
        <p
          className="text-xs font-bold mb-2"
          style={{ color: accentColor }}
        >
          👗 今日の服装アドバイス
        </p>
        <ul className="space-y-1">
          {advice.map((item, i) => (
            <li key={i} className="text-sm text-gray-600">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
