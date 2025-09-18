"use client"

import { useEffect, useState } from "react"

type Result = {
  id: string
  metricName: string
  value: number
  unit: string
  notes: string | null
  createdAt: string
}

export default function ExperimentResultsPanel({ experimentId }: { experimentId: string }) {
  const [items, setItems] = useState<Result[]>([])
  const [metricName, setMetricName] = useState("")
  const [value, setValue] = useState<number>(0)
  const [unit, setUnit] = useState("%")
  const [notes, setNotes] = useState("")

  const load = async () => {
    const res = await fetch(`/api/experiment-results?experimentId=${experimentId}`)
    if (res.ok) setItems(await res.json())
  }
  useEffect(() => { load() }, [experimentId])

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/experiment-results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ experimentId, metricName, value, unit, notes })
    })
    if (res.ok) {
      setMetricName("")
      setValue(0)
      setUnit("%")
      setNotes("")
      await load()
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Результаты эксперимента</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2 pr-4">Метрика</th>
              <th className="py-2 pr-4">Значение</th>
              <th className="py-2 pr-4">Ед.</th>
              <th className="py-2 pr-4">Заметки</th>
              <th className="py-2 pr-4">Дата</th>
            </tr>
          </thead>
          <tbody>
            {items.map(r => (
              <tr key={r.id} className="border-t">
                <td className="py-2 pr-4">{r.metricName}</td>
                <td className="py-2 pr-4">{r.value}</td>
                <td className="py-2 pr-4">{r.unit}</td>
                <td className="py-2 pr-4 text-gray-600">{r.notes}</td>
                <td className="py-2 pr-4 text-gray-500">{new Date(r.createdAt).toLocaleString('ru-RU')}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="py-3 text-gray-500">Пока нет данных</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-3">
        <input value={metricName} onChange={e=>setMetricName(e.target.value)} placeholder="Метрика" className="border rounded px-2 py-1 text-sm" required />
        <input value={value} onChange={e=>setValue(Number(e.target.value))} type="number" placeholder="Значение" className="border rounded px-2 py-1 text-sm" required />
        <input value={unit} onChange={e=>setUnit(e.target.value)} placeholder="Ед." className="border rounded px-2 py-1 text-sm" required />
        <input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Заметки (опц.)" className="border rounded px-2 py-1 text-sm md:col-span-2" />
        <div className="md:col-span-5">
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Добавить результат</button>
        </div>
      </form>
    </div>
  )
}


