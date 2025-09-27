"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

type Comment = {
  id: string
  content: string
  createdAt: string
  user: { id: string; name: string | null; email: string; image: string | null }
}

type Props = {
  ideaId?: string
  hypothesisId?: string
  experimentId?: string
}

export default function Comments(props: Props) {
  const { data: session } = useSession()
  const [items, setItems] = useState<Comment[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const qs = new URLSearchParams()
      if (props.ideaId) qs.set("ideaId", props.ideaId)
      if (props.hypothesisId) qs.set("hypothesisId", props.hypothesisId)
      if (props.experimentId) qs.set("experimentId", props.experimentId)
      const res = await fetch(`/api/comments?${qs.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.ideaId, props.hypothesisId, props.experimentId])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    setPosting(true)
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: text,
          ideaId: props.ideaId,
          hypothesisId: props.hypothesisId,
          experimentId: props.experimentId
        })
      })
      if (res.ok) {
        const created = await res.json()
        setItems(prev => [...prev, created])
        setText("")
      }
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Комментарии</h3>
      <div className="space-y-3 mb-4">
        {loading ? (
          <div className="text-sm text-gray-500">Загрузка...</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-gray-500">Пока нет комментариев</div>
        ) : (
          items.map(c => (
            <div key={c.id} className="bg-gray-50 rounded p-3">
              <div className="text-sm text-gray-700 whitespace-pre-wrap">{c.content}</div>
              <div className="mt-1 text-xs text-gray-500">
                {c.user.name ?? c.user.email} · {new Date(c.createdAt).toLocaleString("ru-RU")}
              </div>
            </div>
          ))
        )}
      </div>

      {session && (
        <form onSubmit={onSubmit} className="flex gap-2">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={2}
            placeholder="Оставить комментарий..."
            className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={posting || !text.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm disabled:opacity-50"
          >
            Отправить
          </button>
        </form>
      )}
    </div>
  )
}


