import type { ChildType, ItemDefinition } from '../types/index.ts'

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

// 年齢別の追加アイテム
export function getAgeSpecificItems(age: number, childType: ChildType): ItemDefinition[] {
  const prefix = childType === 'nursery' ? 'na' : 'ka'
  const items: ItemDefinition[] = []

  if (age <= 1) {
    items.push(
      { id: `${prefix}-age-1`, name: 'ミルク・哺乳瓶', emoji: '🍼', everyday: true },
      { id: `${prefix}-age-2`, name: 'よだれかけ', emoji: '🧸', everyday: true },
      { id: `${prefix}-age-3`, name: 'おむつ（多め）', emoji: '👶', everyday: true },
      { id: `${prefix}-age-4`, name: 'おしゃぶり', emoji: '😮', everyday: true },
    )
  } else if (age === 2) {
    items.push(
      { id: `${prefix}-age-5`, name: 'トレーニングパンツ', emoji: '🩲', everyday: true },
      { id: `${prefix}-age-6`, name: '着替え（多め）', emoji: '👕', everyday: true },
    )
  } else if (age === 3) {
    items.push(
      { id: `${prefix}-age-7`, name: 'お箸セット', emoji: '🥢', everyday: true },
      { id: `${prefix}-age-8`, name: 'ハンカチ', emoji: '🤧', everyday: true },
    )
  } else if (age === 4) {
    items.push(
      { id: `${prefix}-age-9`, name: 'お箸セット', emoji: '🥢', everyday: true },
      { id: `${prefix}-age-10`, name: 'なわとび', emoji: '⭕', everyday: false, dayOfWeek: [2, 4] },
    )
  } else if (age >= 5) {
    items.push(
      { id: `${prefix}-age-11`, name: 'お箸セット', emoji: '🥢', everyday: true },
      { id: `${prefix}-age-12`, name: 'ピアニカ', emoji: '🎹', everyday: false, dayOfWeek: [3] },
    )
  }

  return items
}

export const weatherLabels: Record<string, { emoji: string; label: string }> = {
  sunny: { emoji: '☀️', label: '晴れ' },
  cloudy: { emoji: '☁️', label: '曇り' },
  rainy: { emoji: '🌧️', label: '雨' },
  hot: { emoji: '🥵', label: '猛暑' },
  cold: { emoji: '🥶', label: '寒い' },
}
