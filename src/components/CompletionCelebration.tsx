interface Props {
  show: boolean
}

export function CompletionCelebration({ show }: Props) {
  if (!show) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="animate-confetti text-center">
        <div className="text-5xl mb-3">✓</div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-4 border border-[#ebe7e3]">
          <p className="font-display text-lg font-medium text-[#3d3a38] italic">準備完了</p>
          <p className="text-xs text-[#8a8583] mt-1">いってらっしゃい</p>
        </div>
      </div>
    </div>
  )
}
