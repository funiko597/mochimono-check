import type { AppData } from '../types/index.ts'

const STORAGE_KEY = 'mochimono-check-data'

const defaultData: AppData = {
  nurseryChecks: {},
  kindergartenChecks: {},
  nurseryCustomItems: [],
  kindergartenCustomItems: [],
  events: [],
  lastDate: new Date().toISOString().split('T')[0],
  profiles: [],
  activeProfileId: null,
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultData }
    return JSON.parse(raw) as AppData
  } catch {
    return { ...defaultData }
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export function getDayOfWeek(): number {
  return new Date().getDay()
}
