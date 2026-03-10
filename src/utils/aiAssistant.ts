import type { WeatherForecast } from '../hooks/useWeatherForecast'
import type { ChildType, EventItem } from '../types/index.ts'

export interface AiSuggestion {
  emoji: string
  message: string
  priority: 'high' | 'medium' | 'low'
}

export function generateSuggestions(
  forecast: WeatherForecast | null,
  childType: ChildType,
  todayEvents: EventItem[],
): AiSuggestion[] {
  const suggestions: AiSuggestion[] = []
  const now = new Date()
  const month = now.getMonth() + 1
  const hour = now.getHours()
  const dayOfWeek = now.getDay()

  // --- 天気ベースの提案 ---
  if (forecast) {
    const { maxTemp, minTemp, precipitation, weatherCode, windSpeed, humidity } = forecast
    const tempDiff = maxTemp - minTemp

    // 急な雨対策
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode) || precipitation > 0) {
      suggestions.push({
        emoji: '👕',
        message: '雨の日は着替えが汚れやすいので、替えの服を多めに入れておくと安心です',
        priority: 'high',
      })
      if (childType === 'nursery') {
        suggestions.push({
          emoji: '🧦',
          message: '靴下の替えも入れておきましょう。濡れると風邪をひきやすいです',
          priority: 'medium',
        })
      }
      suggestions.push({
        emoji: '🛍️',
        message: '濡れた服を入れるビニール袋があると便利です',
        priority: 'medium',
      })
    }

    // 雷雨
    if ([95, 96, 99].includes(weatherCode)) {
      suggestions.push({
        emoji: '⚡',
        message: '雷雨の予報です！お迎えの時間帯に注意してください',
        priority: 'high',
      })
    }

    // 猛暑対策
    if (maxTemp >= 30) {
      suggestions.push({
        emoji: '🧊',
        message: '猛暑日です！水筒に氷を多めに入れ、凍らせたペットボトルも持たせると◎',
        priority: 'high',
      })
      suggestions.push({
        emoji: '🧴',
        message: '日焼け止めを塗ってあげましょう',
        priority: 'medium',
      })
      if (maxTemp >= 35) {
        suggestions.push({
          emoji: '🌡️',
          message: '35°C超えの危険な暑さです。冷感タオルや塩分タブレットも検討を',
          priority: 'high',
        })
      }
    }

    // 寒さ対策
    if (minTemp <= 5) {
      suggestions.push({
        emoji: '🧣',
        message: 'とても寒い日です。マフラー・手袋を忘れずに！',
        priority: 'high',
      })
      if (childType === 'kindergarten') {
        suggestions.push({
          emoji: '🫖',
          message: '水筒に温かいお茶を入れてあげると喜びます',
          priority: 'low',
        })
      }
    }

    // 寒暖差
    if (tempDiff >= 12) {
      suggestions.push({
        emoji: '🔄',
        message: `今日は${Math.round(minTemp)}°→${Math.round(maxTemp)}°と寒暖差が大きいです。脱ぎ着しやすい服を選びましょう`,
        priority: 'high',
      })
    }

    // 乾燥
    if (humidity < 30) {
      suggestions.push({
        emoji: '💧',
        message: '空気がとても乾燥しています。リップクリームやハンドクリームがあると良いです',
        priority: 'low',
      })
    }

    // 強風
    if (windSpeed > 15) {
      suggestions.push({
        emoji: '🌪️',
        message: '風がとても強いです。帽子はゴム付きのものにしましょう',
        priority: 'medium',
      })
    }
  }

  // --- 季節ベースの提案 ---
  // 花粉シーズン
  if (month >= 2 && month <= 5) {
    suggestions.push({
      emoji: '🤧',
      message: '花粉シーズンです。マスクやティッシュを多めに持たせましょう',
      priority: 'medium',
    })
  }

  // プール・水遊びシーズン
  if (month >= 6 && month <= 8) {
    suggestions.push({
      emoji: '🏊',
      message: 'プール・水遊びの季節です。水着セットの確認を忘れずに！',
      priority: 'medium',
    })
  }

  // 感染症シーズン
  if (month >= 11 || month <= 2) {
    suggestions.push({
      emoji: '😷',
      message: '感染症が流行しやすい時期です。予備のマスクを入れておくと安心',
      priority: 'medium',
    })
  }

  // 年度始め
  if (month === 4 && now.getDate() <= 10) {
    suggestions.push({
      emoji: '🌸',
      message: '新年度！名前シールの貼り忘れがないか最終チェックしましょう',
      priority: 'high',
    })
  }

  // --- 曜日ベースの提案 ---
  // 週明け
  if (dayOfWeek === 1) {
    suggestions.push({
      emoji: '📋',
      message: '週明けは持ち物が多い日です。リストを丁寧にチェックしましょう',
      priority: 'medium',
    })
  }

  // 金曜日
  if (dayOfWeek === 5) {
    suggestions.push({
      emoji: '🧺',
      message: '週末前です！持ち帰りの荷物が入る大きめのバッグがあると便利',
      priority: 'medium',
    })
  }

  // --- イベントベースの提案 ---
  if (todayEvents.length > 0) {
    todayEvents.forEach(event => {
      suggestions.push({
        emoji: '🎪',
        message: `今日は「${event.name}」があります。特別な持ち物を忘れずに！`,
        priority: 'high',
      })
    })
  }

  // --- 時間帯ベースの提案 ---
  if (hour >= 7 && hour <= 8) {
    suggestions.push({
      emoji: '⏰',
      message: 'お支度の時間です！一つずつ確認していきましょう',
      priority: 'low',
    })
  }

  if (hour >= 20) {
    suggestions.push({
      emoji: '🌙',
      message: '明日の準備は今のうちに！前の晩に準備すると朝が楽です',
      priority: 'low',
    })
  }

  // 優先度でソートして返す
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  // 最大5つまで
  return suggestions.slice(0, 5)
}
