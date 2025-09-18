"use client"

import { useEffect, useState } from "react"

type Criteria = {
  id: string
  name: string
  description: string | null
  targetValue: number
  actualValue: number | null
  unit: string
  achieved: boolean
}

export default function SuccessCriteriaPanel({ hypothesisId }: { hypothesisId: string }) {
  const [items, setItems] = useState<Criteria[]>([])
  const [name, setName] = useState("")
  const [targetValue, setTargetValue] = useState(0)
  const [unit, setUnit] = useState("%")
  const [description, setDescription] = useState("")

  const load = async () => {
    const res = await fetch(`/api/success-criteria?hypothesisId=${hypothesisId}`)
    if (res.ok) setItems(await res.json())
  }

  useEffect(() => { load() }, [hypothesisId])

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/success-criteria`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hypothesisId, name, description, targetValue, unit })
    })
    if (res.ok) {
      setName("")
      setDescription("")
      setTargetValue(0)
      await load()
    }
  }

  const toggle = async (id: string, achieved: boolean) => {
    await fetch(`/api/success-criteria/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ achieved })
    })
    await load()
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Критерии успеха</h3>
      <div className="space-y-2 mb-4">
        {items.length === 0 && <div className="text-sm text-gray-500">Критерии не заданы</div>}
        {items.map(c => (
          <div key={c.id} className="flex items-start justify-between bg-gray-50 rounded p-3">
            <div>
              <div className="text-sm text-gray-900 font-medium">{c.name}</div>
              {c.description && <div className="text-xs text-gray-600">{c.description}</div>}
              <div className="text-xs text-gray-500">Цель: {c.targetValue} {c.unit} · Факт: {c.actualValue ?? '-'} {c.unit}</div>
            </div>
            <label className="text-xs text-gray-700 flex items-center gap-2">
              <input type="checkbox" checked={c.achieved} onChange={e => toggle(c.id, e.target.checked)} />
              Достигнуто
            </label>
          </div>
        ))}
      </div>
      <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Название" className="border rounded px-2 py-1 text-sm" required />
        <input value={targetValue} onChange={e=>setTargetValue(Number(e.target.value))} type="number" placeholder="Цель" className="border rounded px-2 py-1 text-sm" required />
        <input value={unit} onChange={e=>setUnit(e.target.value)} placeholder="Ед." className="border rounded px-2 py-1 text-sm" required />
        <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Описание (опц.)" className="border rounded px-2 py-1 text-sm md:col-span-1" />
        <div className="md:col-span-4">
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Добавить критерий</button>
        </div>
      </form>
    </div>
  )
}


