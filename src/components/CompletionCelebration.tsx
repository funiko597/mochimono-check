interface Props {
  show: boolean
}

export function CompletionCelebration({ show }: Props) {
  if (!show) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="animate-confetti text-center">
        <div className="text-7xl mb-2">🎉</div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
          <p className="text-xl font-bold text-gray-700">準備カンペキ！</p>
          <p className="text-sm text-gray-500">いってらっしゃい！</p>
        </div>
      </div>
    </div>
  )
}
