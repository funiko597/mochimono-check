import { useState, useEffect, useCallback } from 'react'
import type { AppData, ChildType, CheckState, CustomItem, EventItem } from '../types/index.ts'
import { loadData, saveData, getToday } from '../utils/storage.ts'

export function useAppData() {
  const [data, setData] = useState<AppData>(() => {
    const loaded = loadData()
    const today = getToday()
    if (loaded.lastDate !== today) {
      return {
        ...loaded,
        nurseryChecks: {},
        kindergartenChecks: {},
        lastDate: today,
      }
    }
    return loaded
  })

  useEffect(() => {
    saveData(data)
  }, [data])

  // 日付変更チェック
  useEffect(() => {
    const interval = setInterval(() => {
      const today = getToday()
      if (data.lastDate !== today) {
        setData(prev => ({
          ...prev,
          nurseryChecks: {},
          kindergartenChecks: {},
          lastDate: today,
        }))
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [data.lastDate])

  const toggleCheck = useCallback((child: ChildType, itemId: string) => {
    setData(prev => {
      const key = child === 'nursery' ? 'nurseryChecks' : 'kindergartenChecks'
      const checks = { ...prev[key] }
      checks[itemId] = !checks[itemId]
      return { ...prev, [key]: checks }
    })
  }, [])

  const getChecks = useCallback((child: ChildType): CheckState => {
    return child === 'nursery' ? data.nurseryChecks : data.kindergartenChecks
  }, [data.nurseryChecks, data.kindergartenChecks])

  const getCustomItems = useCallback((child: ChildType): CustomItem[] => {
    return child === 'nursery' ? data.nurseryCustomItems : data.kindergartenCustomItems
  }, [data.nurseryCustomItems, data.kindergartenCustomItems])

  const addCustomItem = useCallback((child: ChildType, name: string, emoji: string) => {
    const item: CustomItem = {
      id: `custom-${Date.now()}`,
      name,
      emoji,
    }
    setData(prev => {
      const key = child === 'nursery' ? 'nurseryCustomItems' : 'kindergartenCustomItems'
      return { ...prev, [key]: [...prev[key], item] }
    })
  }, [])

  const removeCustomItem = useCallback((child: ChildType, itemId: string) => {
    setData(prev => {
      const key = child === 'nursery' ? 'nurseryCustomItems' : 'kindergartenCustomItems'
      return { ...prev, [key]: prev[key].filter(i => i.id !== itemId) }
    })
  }, [])

  const addEvent = useCallback((event: Omit<EventItem, 'id'>) => {
    setData(prev => ({
      ...prev,
      events: [...prev.events, { ...event, id: `event-${Date.now()}` }],
    }))
  }, [])

  const removeEvent = useCallback((eventId: string) => {
    setData(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== eventId),
    }))
  }, [])

  const getTodayEvents = useCallback((): EventItem[] => {
    const today = getToday()
    return data.events.filter(e => e.date === today)
  }, [data.events])

  return {
    data,
    toggleCheck,
    getChecks,
    getCustomItems,
    addCustomItem,
    removeCustomItem,
    addEvent,
    removeEvent,
    getTodayEvents,
  }
}
