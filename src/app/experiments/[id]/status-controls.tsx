"use client"

import { useState } from "react"

const options = [
  { value: "PLANNING", label: "Планирование" },
  { value: "RUNNING", label: "Выполняется" },
  { value: "PAUSED", label: "Пауза" },
  { value: "COMPLETED", label: "Завершён" },
  { value: "CANCELLED", label: "Отменён" },
]

export default function StatusControls({ id, current }: { id: string; current: string }) {
  const [status, setStatus] = useState(current)
  const [saving, setSaving] = useState(false)

  const onChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value
    setStatus(next)
    setSaving(true)
    try {
      await fetch(`/api/experiments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next })
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mb-4 flex items-center gap-3">
      <label className="text-sm text-gray-600">Статус:</label>
      <select value={status} onChange={onChange} className="border border-gray-300 rounded px-2 py-1 text-sm">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {saving && <span className="text-xs text-gray-500">Сохранение…</span>}
    </div>
  )
}


