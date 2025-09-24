"use client"

import { useState } from "react"

const options = [
  { value: "DRAFT", label: "Черновик" },
  { value: "RESEARCH", label: "Desk Research" },
  { value: "READY_FOR_TESTING", label: "Готова к тестированию" },
  { value: "IN_EXPERIMENT", label: "В эксперименте" },
  { value: "VALIDATED", label: "Подтверждена" },
  { value: "INVALIDATED", label: "Опровергнута" },
  { value: "ARCHIVED", label: "Архивирована" },
]

export default function StatusControls({ id, current, type }: { id: string; current: string; type: "hypothesis" }) {
  const [status, setStatus] = useState(current)
  const [saving, setSaving] = useState(false)

  const onChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value
    setStatus(next)
    setSaving(true)
    try {
      await fetch(`/api/hypotheses/${id}`, {
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


