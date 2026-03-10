import { useState } from 'react'
import type { ChildType, ChildProfile } from '../types/index.ts'

interface Props {
  profiles: ChildProfile[]
  activeProfileId: string | null
  onAdd: (profile: Omit<ChildProfile, 'id'>) => void
  onUpdate: (profileId: string, updates: Partial<Omit<ChildProfile, 'id'>>) => void
  onRemove: (profileId: string) => void
  onSelect: (profileId: string) => void
  accentColor: string
}

const AGE_OPTIONS = [0, 1, 2, 3, 4, 5, 6]

export function ProfileManager({
  profiles,
  activeProfileId,
  onAdd,
  onUpdate,
  onRemove,
  onSelect,
  accentColor,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [age, setAge] = useState(3)
  const [type, setType] = useState<ChildType>('nursery')
  const [gardenName, setGardenName] = useState('')
  const [allergies, setAllergies] = useState('')
  const [notes, setNotes] = useState('')

  const resetForm = () => {
    setName('')
    setAge(3)
    setType('nursery')
    setGardenName('')
    setAllergies('')
    setNotes('')
    setIsAdding(false)
    setEditingId(null)
  }

  const handleAdd = () => {
    if (!name.trim()) return
    onAdd({
      name: name.trim(),
      age,
      type,
      gardenName: gardenName.trim(),
      allergies: allergies.split(',').map(a => a.trim()).filter(Boolean),
      notes: notes.trim(),
    })
    resetForm()
  }

  const handleUpdate = () => {
    if (!editingId || !name.trim()) return
    onUpdate(editingId, {
      name: name.trim(),
      age,
      type,
      gardenName: gardenName.trim(),
      allergies: allergies.split(',').map(a => a.trim()).filter(Boolean),
      notes: notes.trim(),
    })
    resetForm()
  }

  const startEdit = (profile: ChildProfile) => {
    setEditingId(profile.id)
    setName(profile.name)
    setAge(profile.age)
    setType(profile.type)
    setGardenName(profile.gardenName)
    setAllergies(profile.allergies.join(', '))
    setNotes(profile.notes)
    setIsAdding(true)
  }

  return (
    <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full"
      >
        <p className="text-sm text-gray-500 font-medium">
          👤 おこさまプロフィール
          {profiles.length > 0 && (
            <span className="text-xs text-gray-400 ml-1">（{profiles.length}人登録）</span>
          )}
        </p>
        <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mt-3">
          {/* プロフィール一覧 */}
          {profiles.length > 0 && (
            <div className="space-y-2 mb-3">
              {profiles.map(profile => (
                <div
                  key={profile.id}
                  className={`rounded-xl p-3 border-2 transition-all ${
                    profile.id === activeProfileId
                      ? 'border-current shadow-sm'
                      : 'border-gray-100'
                  }`}
                  style={profile.id === activeProfileId ? { borderColor: accentColor } : undefined}
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onSelect(profile.id)}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      <span className="text-2xl">
                        {profile.type === 'nursery' ? '🐣' : '🌟'}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-gray-700">
                          {profile.name}
                          <span className="text-xs font-normal text-gray-400 ml-1">
                            {profile.age}歳
                          </span>
                        </p>
                        <p className="text-xs text-gray-400">
                          {profile.type === 'nursery' ? '保育園' : '幼稚園'}
                          {profile.gardenName && `・${profile.gardenName}`}
                        </p>
                        {profile.allergies.length > 0 && (
                          <p className="text-xs text-red-400 mt-0.5">
                            ⚠️ {profile.allergies.join(', ')}
                          </p>
                        )}
                      </div>
                    </button>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(profile)}
                        className="text-xs text-gray-400 px-2 py-1 rounded-lg hover:bg-gray-100"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => onRemove(profile.id)}
                        className="text-xs text-red-400 px-2 py-1 rounded-lg hover:bg-red-50"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                  {profile.notes && (
                    <p className="text-xs text-gray-400 mt-1 pl-9">📝 {profile.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 追加・編集フォーム */}
          {isAdding ? (
            <div className="space-y-3 rounded-xl bg-gray-50 p-3">
              <p className="text-xs font-bold text-gray-500">
                {editingId ? '✏️ プロフィール編集' : '➕ 新しいおこさま'}
              </p>

              <div>
                <label className="text-xs text-gray-400">お名前</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="たろう"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-current"
                  style={{ focusBorderColor: accentColor } as React.CSSProperties}
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-400">年齢</label>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {AGE_OPTIONS.map(a => (
                      <button
                        key={a}
                        onClick={() => setAge(a)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          age === a ? 'text-white' : 'bg-white text-gray-600 border border-gray-200'
                        }`}
                        style={age === a ? { backgroundColor: accentColor } : undefined}
                      >
                        {a}歳
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400">園の種類</label>
                <div className="flex gap-2 mt-1">
                  {(['nursery', 'kindergarten'] as ChildType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        type === t ? 'text-white' : 'bg-white text-gray-600 border border-gray-200'
                      }`}
                      style={type === t ? { backgroundColor: accentColor } : undefined}
                    >
                      {t === 'nursery' ? '🐣 保育園' : '🌟 幼稚園'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400">園の名前（任意）</label>
                <input
                  type="text"
                  value={gardenName}
                  onChange={e => setGardenName(e.target.value)}
                  placeholder="○○保育園"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400">アレルギー（カンマ区切り・任意）</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  placeholder="卵, 乳"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400">メモ（任意）</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="好きなキャラクター、注意点など"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={editingId ? handleUpdate : handleAdd}
                  disabled={!name.trim()}
                  className="flex-1 py-2 rounded-xl text-sm text-white font-medium disabled:opacity-40"
                  style={{ backgroundColor: accentColor }}
                >
                  {editingId ? '更新' : '登録'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl text-sm text-gray-500 bg-white border border-gray-200"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-2 rounded-xl text-sm border-2 border-dashed border-gray-200 text-gray-400 hover:border-gray-300"
            >
              ＋ おこさまを追加
            </button>
          )}
        </div>
      )}
    </div>
  )
}
