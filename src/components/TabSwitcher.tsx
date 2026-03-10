import type { ChildType } from '../types/index.ts'

interface Props {
  active: ChildType
  onChange: (child: ChildType) => void
}

export function TabSwitcher({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => onChange('nursery')}
        className={`flex-1 py-3 rounded-2xl text-lg font-bold transition-all ${
          active === 'nursery'
            ? 'bg-nursery text-white shadow-lg scale-105'
            : 'bg-white text-nursery border-2 border-nursery/30'
        }`}
      >
        🐣 保育園
      </button>
      <button
        onClick={() => onChange('kindergarten')}
        className={`flex-1 py-3 rounded-2xl text-lg font-bold transition-all ${
          active === 'kindergarten'
            ? 'bg-kindergarten text-white shadow-lg scale-105'
            : 'bg-white text-kindergarten border-2 border-kindergarten/30'
        }`}
      >
        🌟 幼稚園
      </button>
    </div>
  )
}
