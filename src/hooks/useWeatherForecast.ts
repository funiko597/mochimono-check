import { useState, useEffect, useCallback } from 'react'

export interface WeatherForecast {
  temperature: number
  maxTemp: number
  minTemp: number
  weatherCode: number
  precipitation: number
  windSpeed: number
  humidity: number
  locationName: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const WMO_WEATHER: Record<number, { label: string; emoji: string }> = {
  0: { label: '快晴', emoji: '☀️' },
  1: { label: 'ほぼ晴れ', emoji: '🌤️' },
  2: { label: '一部曇り', emoji: '⛅' },
  3: { label: '曇り', emoji: '☁️' },
  45: { label: '霧', emoji: '🌫️' },
  48: { label: '霧氷', emoji: '🌫️' },
  51: { label: '小雨', emoji: '🌦️' },
  53: { label: '雨', emoji: '🌧️' },
  55: { label: '強い雨', emoji: '🌧️' },
  61: { label: '小雨', emoji: '🌦️' },
  63: { label: '雨', emoji: '🌧️' },
  65: { label: '大雨', emoji: '🌧️' },
  71: { label: '小雪', emoji: '🌨️' },
  73: { label: '雪', emoji: '❄️' },
  75: { label: '大雪', emoji: '❄️' },
  80: { label: 'にわか雨', emoji: '🌦️' },
  81: { label: 'にわか雨', emoji: '🌧️' },
  82: { label: '激しいにわか雨', emoji: '⛈️' },
  95: { label: '雷雨', emoji: '⛈️' },
  96: { label: '雹を伴う雷雨', emoji: '⛈️' },
  99: { label: '激しい雷雨', emoji: '⛈️' },
}

export function getWeatherInfo(code: number) {
  return WMO_WEATHER[code] ?? { label: '不明', emoji: '❓' }
}

export function getClothingAdvice(forecast: WeatherForecast): string[] {
  const { maxTemp, minTemp, precipitation, windSpeed, weatherCode } = forecast
  const avgTemp = (maxTemp + minTemp) / 2
  const advice: string[] = []

  // 気温ベースのアドバイス
  if (maxTemp >= 30) {
    advice.push('🩳 半袖・短パンなど涼しい服装で')
    advice.push('🧢 帽子を忘れずに！熱中症に注意')
    advice.push('💧 水筒に多めの水を入れましょう')
  } else if (maxTemp >= 25) {
    advice.push('👕 半袖でOK！薄手の羽織りもあると安心')
    advice.push('🧢 帽子があると良いです')
  } else if (avgTemp >= 20) {
    advice.push('👔 長袖シャツ1枚でちょうど良い気温')
  } else if (avgTemp >= 15) {
    advice.push('🧥 薄手の上着があると安心')
    advice.push('👖 長ズボンがおすすめ')
  } else if (avgTemp >= 10) {
    advice.push('🧥 しっかり上着を着ましょう')
    advice.push('👖 暖かいズボンがおすすめ')
  } else if (avgTemp >= 5) {
    advice.push('🧣 コート＋マフラーで防寒を')
    advice.push('🧤 手袋があると暖かいです')
  } else {
    advice.push('🧣 厚手のコート・マフラー必須！')
    advice.push('🧤 手袋・耳あてなどしっかり防寒を')
    advice.push('🌡️ カイロもあると安心')
  }

  // 雨のアドバイス
  if (precipitation > 0 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode)) {
    advice.push('☔ 傘・レインコートを持ちましょう')
    advice.push('👟 長靴や防水の靴がおすすめ')
  }

  // 風のアドバイス
  if (windSpeed > 10) {
    advice.push('🌬️ 風が強いので飛ばされにくい帽子を')
  }

  // 寒暖差
  if (maxTemp - minTemp >= 10) {
    advice.push('🔄 寒暖差が大きいので脱ぎ着しやすい服を')
  }

  return advice
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ja`
    )
    const data = await res.json()
    const addr = data.address
    return addr.city || addr.town || addr.village || addr.suburb || '現在地'
  } catch {
    return '現在地'
  }
}

export function useWeatherForecast() {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string>('')

  const fetchWeather = useCallback(async () => {
    setStatus('loading')
    setError('')

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 600000, // 10分キャッシュ
        })
      })

      const { latitude, longitude } = position.coords

      const [weatherRes, locationName] = await Promise.all([
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
          `&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m` +
          `&daily=temperature_2m_max,temperature_2m_min&timezone=Asia/Tokyo&forecast_days=1`
        ),
        reverseGeocode(latitude, longitude),
      ])

      const weatherData = await weatherRes.json()

      setForecast({
        temperature: weatherData.current.temperature_2m,
        maxTemp: weatherData.daily.temperature_2m_max[0],
        minTemp: weatherData.daily.temperature_2m_min[0],
        weatherCode: weatherData.current.weather_code,
        precipitation: weatherData.current.precipitation,
        windSpeed: weatherData.current.wind_speed_10m,
        humidity: weatherData.current.relative_humidity_2m,
        locationName,
      })
      setStatus('success')
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('位置情報の許可が必要です')
            break
          case err.POSITION_UNAVAILABLE:
            setError('位置情報を取得できません')
            break
          case err.TIMEOUT:
            setError('位置情報の取得がタイムアウトしました')
            break
        }
      } else {
        setError('天気情報の取得に失敗しました')
      }
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    fetchWeather()
  }, [fetchWeather])

  return { forecast, status, error, retry: fetchWeather }
}
