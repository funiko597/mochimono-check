import { useState, useMemo, useEffect } from 'react'
import type { ChildType, Weather } from './types/index.ts'
import { nurseryItems, kindergartenItems, getAgeSpecificItems } from './data/items.ts'
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
import { ProfileManager } from './components/ProfileManager.tsx'

const ACCENT = '#7c6d8e'

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
    addProfile,
    updateProfile,
    removeProfile,
    setActiveProfile,
    getActiveProfile,
  } = useAppData()

  const { forecast, status: weatherStatus, error: weatherError, retry: weatherRetry } = useWeatherForecast()

  const activeProfile = getActiveProfile()

  useEffect(() => {
    if (activeProfile) {
      setActiveChild(activeProfile.type)
    }
  }, [activeProfile])

  const checks = getChecks(activeChild)
  const customItems = getCustomItems(activeChild)
  const todayEvents = getTodayEvents()
  const dayOfWeek = getDayOfWeek()

  const baseItems = activeChild === 'nursery' ? nurseryItems : kindergartenItems

  const todayItems = useMemo(() => {
    const items = baseItems.filter(item => {
      if (item.everyday) return true
      if (item.weather && item.weather.includes(weather)) return true
      if (item.dayOfWeek && item.dayOfWeek.includes(dayOfWeek as 0|1|2|3|4|5|6)) return true
      return false
    })

    const ageItems = activeProfile
      ? getAgeSpecificItems(activeProfile.age, activeChild).filter(item => {
          if (item.everyday) return true
          if (item.weather && item.weather.includes(weather)) return true
          if (item.dayOfWeek && item.dayOfWeek.includes(dayOfWeek as 0|1|2|3|4|5|6)) return true
          return false
        })
      : []

    const customMapped = customItems.map(ci => ({
      id: ci.id,
      name: ci.name,
      emoji: ci.emoji,
    }))

    const eventMapped = todayEvents.flatMap(event =>
      event.items.map((itemName, i) => ({
        id: `${event.id}-item-${i}`,
        name: `${itemName}（${event.name}）`,
        emoji: '🎪',
      }))
    )

    return [
      ...items.map(i => ({ id: i.id, name: i.name, emoji: i.emoji })),
      ...ageItems.map(i => ({ id: i.id, name: i.name, emoji: i.emoji })),
      ...customMapped,
      ...eventMapped,
    ]
  }, [baseItems, weather, dayOfWeek, customItems, todayEvents, activeProfile, activeChild])

  const checkedCount = todayItems.filter(item => checks[item.id]).length
  const totalCount = todayItems.length
  const allDone = totalCount > 0 && checkedCount === totalCount

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
    <div className="min-h-screen pb-12">
      <CompletionCelebration show={showCelebration} />

      <div className="max-w-[480px] mx-auto px-5 pt-8">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <p className="section-label mb-1">daily checklist</p>
          <h1 className="font-display text-2xl font-medium text-[#3d3a38] italic">
            {activeProfile ? `${activeProfile.name}の持ち物` : 'もちものチェック'}
          </h1>
          <p className="text-xs text-[#8a8583] mt-1.5 font-number tracking-wider">
            {dateStr}
            {activeProfile?.gardenName && ` — ${activeProfile.gardenName}`}
          </p>
          <div className="w-12 h-px bg-[#d4cdc6] mx-auto mt-3" />
        </div>

        {/* プロフィール */}
        <ProfileManager
          profiles={data.profiles}
          activeProfileId={data.activeProfileId}
          onAdd={addProfile}
          onUpdate={updateProfile}
          onRemove={removeProfile}
          onSelect={setActiveProfile}
          accentColor={ACCENT}
        />

        {!activeProfile && (
          <TabSwitcher active={activeChild} onChange={setActiveChild} />
        )}

        {/* 天気予報 */}
        <WeatherForecastCard
          forecast={forecast}
          status={weatherStatus}
          error={weatherError}
          retry={weatherRetry}
          accentColor={ACCENT}
        />

        {/* AIアシスタント */}
        <AiAssistantCard
          forecast={forecast}
          childType={activeChild}
          todayEvents={todayEvents}
          profile={activeProfile}
          accentColor={ACCENT}
        />

        {/* 天気選択 */}
        <WeatherSelector selected={weather} onChange={setWeather} accentColor={ACCENT} />

        {/* プログレス */}
        <ProgressBar checked={checkedCount} total={totalCount} color={ACCENT} />

        {/* チェックリスト */}
        <CheckList
          items={todayItems}
          checks={checks}
          onToggle={handleToggle}
          accentColor={ACCENT}
          title={activeProfile ? `${activeProfile.name}の持ち物` : '今日の持ち物'}
        />

        {/* カスタム持ち物 */}
        <CustomItemManager
          child={activeChild}
          items={customItems}
          onAdd={addCustomItem}
          onRemove={removeCustomItem}
          accentColor={ACCENT}
        />

        {/* イベント */}
        <EventManager
          events={data.events}
          onAdd={addEvent}
          onRemove={removeEvent}
          accentColor={ACCENT}
        />
      </div>
    </div>
  )
}

export default App
