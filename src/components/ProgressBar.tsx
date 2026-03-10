interface Props {
  checked: number
  total: number
  color: string
}

export function ProgressBar({ checked, total }: Props) {
  const pct = total === 0 ? 0 : Math.round((checked / total) * 100)

  return (
    <div className="card p-3 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="section-label">progress</span>
        <span className="text-xs font-medium text-[#3d3a38] font-number">
          {checked}/{total}
          <span className="text-[#8a8583] ml-1">({pct}%)</span>
        </span>
      </div>
      <div className="w-full bg-[#ebe7e3] rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: '#7c6d8e' }}
        />
      </div>
    </div>
  )
}
