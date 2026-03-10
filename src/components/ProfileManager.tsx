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
    <div className="card p-4 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full"
      >
        <p className="section-label">
          profile
          {profiles.length > 0 && (
            <span className="text-[#d4cdc6] ml-1 font-number">({profiles.length})</span>
          )}
        </p>
        <span className={`text-[#d4cdc6] text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mt-3">
          {profiles.length > 0 && (
            <div className="space-y-2 mb-3">
              {profiles.map(profile => (
                <div
                  key={profile.id}
                  className={`rounded-xl p-3 transition-all cursor-pointer ${
                    profile.id === activeProfileId
                      ? 'bg-[#7c6d8e] text-white'
                      : 'bg-[#faf8f5] border border-[#ebe7e3]'
                  }`}
                  onClick={() => onSelect(profile.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${
                        profile.id === activeProfileId ? 'text-white' : 'text-[#3d3a38]'
                      }`}>
                        {profile.name}
                        <span className={`text-xs font-normal ml-1.5 font-number ${
                          profile.id === activeProfileId ? 'text-white/60' : 'text-[#8a8583]'
                        }`}>
                          {profile.age}歳 · {profile.type === 'nursery' ? '保育園' : '幼稚園'}
                          {profile.gardenName && ` · ${profile.gardenName}`}
                        </span>
                      </p>
                      {profile.allergies.length > 0 && (
                        <p className={`text-xs mt-0.5 ${
                          profile.id === activeProfileId ? 'text-rose-200' : 'text-rose-400'
                        }`}>
                          アレルギー: {profile.allergies.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => startEdit(profile)}
                        className={`text-[10px] px-2 py-1 rounded ${
                          profile.id === activeProfileId
                            ? 'text-white/60 hover:text-white/80'
                            : 'text-[#8a8583] hover:text-[#3d3a38]'
                        }`}
                      >
                        編集
                      </button>
                      <button
                        onClick={() => onRemove(profile.id)}
                        className={`text-[10px] px-2 py-1 rounded ${
                          profile.id === activeProfileId
                            ? 'text-rose-200 hover:text-rose-100'
                            : 'text-rose-400 hover:text-rose-500'
                        }`}
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isAdding ? (
            <div className="space-y-3 rounded-xl bg-[#faf8f5] p-3 border border-[#ebe7e3]">
              <p className="text-xs font-medium text-[#8a8583]">
                {editingId ? '編集' : '新規登録'}
              </p>

              <div>
                <label className="text-[10px] text-[#8a8583] uppercase tracking-wider">名前</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="たろう"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-[#ebe7e3] text-sm bg-white/80 focus:outline-none focus:border-[#7c6d8e]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#8a8583] uppercase tracking-wider">年齢</label>
                <div className="flex gap-1 mt-1">
                  {AGE_OPTIONS.map(a => (
                    <button
                      key={a}
                      onClick={() => setAge(a)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium font-number transition-colors ${
                        age === a
                          ? 'bg-[#7c6d8e] text-white'
                          : 'bg-white/80 text-[#8a8583] border border-[#ebe7e3]'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#8a8583] uppercase tracking-wider">種類</label>
                <div className="flex gap-2 mt-1">
                  {(['nursery', 'kindergarten'] as ChildType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                        type === t
                          ? 'bg-[#7c6d8e] text-white'
                          : 'bg-white/80 text-[#8a8583] border border-[#ebe7e3]'
                      }`}
                    >
                      {t === 'nursery' ? '保育園' : '幼稚園'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#8a8583] uppercase tracking-wider">園の名前</label>
                <input
                  type="text"
                  value={gardenName}
                  onChange={e => setGardenName(e.target.value)}
                  placeholder="任意"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-[#ebe7e3] text-sm bg-white/80 focus:outline-none focus:border-[#7c6d8e]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#8a8583] uppercase tracking-wider">アレルギー（カンマ区切り）</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  placeholder="任意"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-[#ebe7e3] text-sm bg-white/80 focus:outline-none focus:border-[#7c6d8e]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#8a8583] uppercase tracking-wider">メモ</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="任意"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-[#ebe7e3] text-sm bg-white/80 focus:outline-none focus:border-[#7c6d8e]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={editingId ? handleUpdate : handleAdd}
                  disabled={!name.trim()}
                  className="flex-1 py-2 rounded-lg text-xs text-white font-medium bg-[#7c6d8e] disabled:opacity-30"
                >
                  {editingId ? '更新' : '登録'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg text-xs text-[#8a8583] bg-white/80 border border-[#ebe7e3]"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-2 rounded-lg text-xs border border-dashed border-[#d4cdc6] text-[#8a8583] hover:border-[#7c6d8e] hover:text-[#7c6d8e] transition-colors"
            >
              + 追加
            </button>
          )}
        </div>
      )}
    </div>
  )
}
