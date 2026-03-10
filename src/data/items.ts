import type { ItemDefinition } from '../types/index.ts'

// 持ち物データ（仮）- あとで差し替え予定
export const nurseryItems: ItemDefinition[] = [
  { id: 'n-1', name: 'おむつ', emoji: '👶', everyday: true },
  { id: 'n-2', name: 'おしりふき', emoji: '🧻', everyday: true },
  { id: 'n-3', name: '着替え', emoji: '👕', everyday: true },
  { id: 'n-4', name: 'エプロン', emoji: '🍽️', everyday: true },
  { id: 'n-5', name: 'タオル', emoji: '🫧', everyday: true },
  { id: 'n-6', name: '連絡帳', emoji: '📒', everyday: true },
  { id: 'n-7', name: '水筒', emoji: '🫗', everyday: true },
  { id: 'n-8', name: '帽子', emoji: '🧢', everyday: true },
  { id: 'n-9', name: 'レインコート', emoji: '🌧️', everyday: false, weather: ['rainy'] },
  { id: 'n-10', name: '長靴', emoji: '🥾', everyday: false, weather: ['rainy'] },
  { id: 'n-11', name: '布団カバー', emoji: '🛏️', everyday: false, dayOfWeek: [1] },
  { id: 'n-12', name: 'シーツ持ち帰り', emoji: '🧺', everyday: false, dayOfWeek: [5] },
]

export const kindergartenItems: ItemDefinition[] = [
  { id: 'k-1', name: 'リュック', emoji: '🎒', everyday: true },
  { id: 'k-2', name: '水筒', emoji: '🫗', everyday: true },
  { id: 'k-3', name: 'お弁当', emoji: '🍱', everyday: true },
  { id: 'k-4', name: 'ハンカチ', emoji: '🤧', everyday: true },
  { id: 'k-5', name: 'ティッシュ', emoji: '🧻', everyday: true },
  { id: 'k-6', name: '連絡帳', emoji: '📒', everyday: true },
  { id: 'k-7', name: '帽子', emoji: '🧢', everyday: true },
  { id: 'k-8', name: 'レインコート', emoji: '🌧️', everyday: false, weather: ['rainy'] },
  { id: 'k-9', name: '長靴', emoji: '🥾', everyday: false, weather: ['rainy'] },
  { id: 'k-10', name: '上履き', emoji: '👟', everyday: false, dayOfWeek: [1] },
  { id: 'k-11', name: '体操服持ち帰り', emoji: '🏃', everyday: false, dayOfWeek: [5] },
  { id: 'k-12', name: '絵本バッグ', emoji: '📚', everyday: false, dayOfWeek: [5] },
]

export const weatherLabels: Record<string, { emoji: string; label: string }> = {
  sunny: { emoji: '☀️', label: '晴れ' },
  cloudy: { emoji: '☁️', label: '曇り' },
  rainy: { emoji: '🌧️', label: '雨' },
  hot: { emoji: '🥵', label: '猛暑' },
  cold: { emoji: '🥶', label: '寒い' },
}
