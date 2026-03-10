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

export interface AppData {
  nurseryChecks: CheckState
  kindergartenChecks: CheckState
  nurseryCustomItems: CustomItem[]
  kindergartenCustomItems: CustomItem[]
  events: EventItem[]
  lastDate: string
}
