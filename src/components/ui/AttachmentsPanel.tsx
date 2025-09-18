"use client"

import { useEffect, useState } from "react"

type Attachment = {
  id: string
  filename: string
  url: string
  size: number
  mimeType: string
}

export default function AttachmentsPanel({ mvpId }: { mvpId: string }) {
  const [items, setItems] = useState<Attachment[]>([])
  const [filename, setFilename] = useState("")
  const [url, setUrl] = useState("")
  const [size, setSize] = useState<number>(0)
  const [mimeType, setMimeType] = useState("application/octet-stream")

  const load = async () => {
    const res = await fetch(`/api/attachments?mvpId=${mvpId}`)
    if (res.ok) setItems(await res.json())
  }
  useEffect(() => { load() }, [mvpId])

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/attachments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mvpId, filename, url, size, mimeType })
    })
    if (res.ok) {
      setFilename("")
      setUrl("")
      setSize(0)
      await load()
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Вложения</h3>
      <div className="space-y-2 mb-3">
        {items.length === 0 && <div className="text-sm text-gray-500">Вложений нет</div>}
        {items.map(a => (
          <div key={a.id} className="flex items-center justify-between bg-gray-50 rounded p-3">
            <a href={a.url} target="_blank" className="text-blue-600 hover:text-blue-800 text-sm">{a.filename}</a>
            <span className="text-xs text-gray-500">{(a.size/1024).toFixed(1)} KB · {a.mimeType}</span>
          </div>
        ))}
      </div>
      <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <input value={filename} onChange={e=>setFilename(e.target.value)} placeholder="Имя файла" className="border rounded px-2 py-1 text-sm" required />
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="URL" className="border rounded px-2 py-1 text-sm" required />
        <input value={size} onChange={e=>setSize(Number(e.target.value))} type="number" placeholder="Размер (байт)" className="border rounded px-2 py-1 text-sm" required />
        <input value={mimeType} onChange={e=>setMimeType(e.target.value)} placeholder="MIME" className="border rounded px-2 py-1 text-sm" />
        <div className="md:col-span-4">
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Добавить вложение</button>
        </div>
      </form>
    </div>
  )
}


