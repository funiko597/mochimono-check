import type { ChildType } from '../types/index.ts'

interface Props {
  active: ChildType
  onChange: (child: ChildType) => void
}

export function TabSwitcher({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 mb-4">
      {(['nursery', 'kindergarten'] as ChildType[]).map(type => {
        const isActive = active === type
        const label = type === 'nursery' ? '保育園' : '幼稚園'
        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`flex-1 py-2.5 rounded-xl text-sm transition-all ${
              isActive
                ? 'bg-[#7c6d8e] text-white font-medium'
                : 'card text-[#8a8583]'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
