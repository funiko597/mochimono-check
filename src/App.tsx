import { useState, useMemo, useEffect } from 'react'
import type { ChildType, Weather } from './types/index.ts'
import { nurseryItems, kindergartenItems } from './data/items.ts'
import { getDayOfWeek } from './utils/storage.ts'
import { useAppData } from './hooks/useAppData.ts'
import { useWeatherForecast } from './hooks/useWeatherForecast.ts'
import { TabSwitcher } from './components/TabSwitcher.tsx'
import { WeatherSelector } from './components/WeatherSelector.tsx'
import { ProgressBar } from './components/ProgressBar.tsx'
import { CheckList } from './components/CheckList.tsx'
import { CompletionCelebration } from './components/CompletionCelebration.tsx'
import { EventManager } from './components/EventManager.tsx'
import { CustomItemManager } from './components/CustomItemManager.tsx'
import { WeatherForecastCard } from './components/WeatherForecastCard.tsx'
import { AiAssistantCard } from './components/AiAssistantCard.tsx'

const COLORS = {
  nursery: '#FF8B94',
  kindergarten: '#7EC8E3',
} as const

function App() {
  const [activeChild, setActiveChild] = useState<ChildType>('nursery')
  const [weather, setWeather] = useState<Weather>('sunny')
  const [showCelebration, setShowCelebration] = useState(false)

  const {
    data,
    toggleCheck,
    getChecks,
    getCustomItems,
    addCustomItem,
    removeCustomItem,
    addEvent,
    removeEvent,
    getTodayEvents,
  } = useAppData()

  const { forecast, status: weatherStatus, error: weatherError, retry: weatherRetry } = useWeatherForecast()

  const accentColor = COLORS[activeChild]
  const checks = getChecks(activeChild)
  const customItems = getCustomItems(activeChild)
  const todayEvents = getTodayEvents()
  const dayOfWeek = getDayOfWeek()

  // 今日の持ち物リストを構築
  const baseItems = activeChild === 'nursery' ? nurseryItems : kindergartenItems

  const todayItems = useMemo(() => {
    const items = baseItems.filter(item => {
      if (item.everyday) return true
      if (item.weather && item.weather.includes(weather)) return true
      if (item.dayOfWeek && item.dayOfWeek.includes(dayOfWeek as 0|1|2|3|4|5|6)) return true
      return false
    })

    // カスタム持ち物を追加
    const customMapped = customItems.map(ci => ({
      id: ci.id,
      name: ci.name,
      emoji: ci.emoji,
    }))

    // イベント持ち物を追加
    const eventMapped = todayEvents.flatMap(event =>
      event.items.map((itemName, i) => ({
        id: `${event.id}-item-${i}`,
        name: `${itemName}（${event.name}）`,
        emoji: '🎪',
      }))
    )

    return [
      ...items.map(i => ({ id: i.id, name: i.name, emoji: i.emoji })),
      ...customMapped,
      ...eventMapped,
    ]
  }, [baseItems, weather, dayOfWeek, customItems, todayEvents])

  const checkedCount = todayItems.filter(item => checks[item.id]).length
  const totalCount = todayItems.length
  const allDone = totalCount > 0 && checkedCount === totalCount

  // 全完了演出
  useEffect(() => {
    if (allDone) {
      setShowCelebration(true)
      const timer = setTimeout(() => setShowCelebration(false), 2500)
      return () => clearTimeout(timer)
    }
  }, [allDone])

  const handleToggle = (itemId: string) => {
    toggleCheck(activeChild, itemId)
  }

  const dayNames = ['日', '月', '火', '水', '木', '金', '土']
  const today = new Date()
  const dateStr = `${today.getMonth() + 1}/${today.getDate()}（${dayNames[today.getDay()]}）`

  return (
    <div className="min-h-screen pb-8" style={{ backgroundColor: '#FFF5F5' }}>
      <CompletionCelebration show={showCelebration} />

      <div className="max-w-[480px] mx-auto px-4 pt-4">
        {/* ヘッダー */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-gray-700">🎒 もちものチェック</h1>
          <p className="text-sm text-gray-400 mt-1">{dateStr}</p>
        </div>

        {/* タブ切り替え */}
        <TabSwitcher active={activeChild} onChange={setActiveChild} />

        {/* 天気予報・服装アドバイス */}
        <WeatherForecastCard
          forecast={forecast}
          status={weatherStatus}
          error={weatherError}
          retry={weatherRetry}
          accentColor={accentColor}
        />

        {/* AIお支度アシスタント */}
        <AiAssistantCard
          forecast={forecast}
          childType={activeChild}
          todayEvents={todayEvents}
          accentColor={accentColor}
        />

        {/* 天気選択 */}
        <WeatherSelector selected={weather} onChange={setWeather} accentColor={accentColor} />

        {/* プログレスバー */}
        <ProgressBar checked={checkedCount} total={totalCount} color={accentColor} />

        {/* チェックリスト */}
        <CheckList
          items={todayItems}
          checks={checks}
          onToggle={handleToggle}
          accentColor={accentColor}
          title="📋 今日の持ち物"
        />

        {/* カスタム持ち物 */}
        <CustomItemManager
          child={activeChild}
          items={customItems}
          onAdd={addCustomItem}
          onRemove={removeCustomItem}
          accentColor={accentColor}
        />

        {/* イベント管理 */}
        <EventManager
          events={data.events}
          onAdd={addEvent}
          onRemove={removeEvent}
          accentColor={accentColor}
        />
      </div>
    </div>
  )
}

export default App
