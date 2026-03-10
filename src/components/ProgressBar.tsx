interface Props {
  checked: number
  total: number
  color: string
}

export function ProgressBar({ checked, total, color }: Props) {
  const pct = total === 0 ? 0 : Math.round((checked / total) * 100)

  return (
    <div className="bg-white rounded-2xl p-3 mb-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">準備の進み具合</span>
        <span className="text-sm font-bold" style={{ color }}>
          {checked}/{total} ({pct}%)
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
