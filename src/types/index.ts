export type ChildType = 'nursery' | 'kindergarten'

export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'hot' | 'cold'

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface ItemDefinition {
  id: string
  name: string
  emoji: string
  everyday: boolean
  weather?: Weather[]
  dayOfWeek?: DayOfWeek[]
}

export interface CheckState {
  [itemId: string]: boolean
}

export interface EventItem {
  id: string
  date: string // YYYY-MM-DD
  name: string
  items: string[]
}

export interface CustomItem {
  id: string
  name: string
  emoji: string
}

export interface ChildProfile {
  id: string
  name: string
  age: number // 年齢
  type: ChildType // 保育園 or 幼稚園
  gardenName: string // 園の名前
  allergies: string[] // アレルギー
  notes: string // メモ
}

export interface AppData {
  nurseryChecks: CheckState
  kindergartenChecks: CheckState
  nurseryCustomItems: CustomItem[]
  kindergartenCustomItems: CustomItem[]
  events: EventItem[]
  lastDate: string
  profiles: ChildProfile[]
  activeProfileId: string | null
}
