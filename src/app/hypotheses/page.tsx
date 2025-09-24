"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import ExportButton from "@/components/ui/ExportButton"

interface Hypothesis {
  id: string
  title: string
  statement: string
  status: string
  priority: string
  confidenceLevel: number
  createdAt: string
  idea: {
    title: string
  }
  creator: {
    name: string
  }
  experimentsCount: number
}

export default function Hypotheses() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'cards' | 'create'>('cards')
  const [q, setQ] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    const fetchHypotheses = async () => {
      try {
        const params = new URLSearchParams()
        if (statusFilter) params.set('status', statusFilter)
        const response = await fetch('/api/hypotheses' + (params.size ? `?${params.toString()}` : ''))
        if (response.ok) {
          const data = await response.json()
          const formattedData = data.map((h: unknown) => {
            const hypothesis = h as {
              id: string;
              title: string;
              statement: string;
              status: string;
              priority: string;
              confidenceLevel: number;
              createdAt: string;
              idea: { title: string };
              creator: { name: string };
              _count: { experiments: number };
            };
            return {
              id: hypothesis.id,
              title: hypothesis.title,
              statement: hypothesis.statement,
              status: hypothesis.status,
              priority: hypothesis.priority,
              confidenceLevel: hypothesis.confidenceLevel,
              createdAt: hypothesis.createdAt,
              idea: {
                title: hypothesis.idea.title
              },
              creator: {
                name: hypothesis.creator.name
              },
              experimentsCount: hypothesis._count.experiments
            }
          })
          setHypotheses(formattedData)
        } else {
          console.error('Failed to fetch hypotheses')
        }
      } catch (error) {
        console.error('Error fetching hypotheses:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status !== "loading") {
      fetchHypotheses()
    }
  }, [status, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-100 text-gray-800"
      case "RESEARCH": return "bg-purple-100 text-purple-800"
      case "READY_FOR_TESTING": return "bg-blue-100 text-blue-800"
      case "IN_EXPERIMENT": return "bg-yellow-100 text-yellow-800"
      case "VALIDATED": return "bg-green-100 text-green-800"
      case "INVALIDATED": return "bg-red-100 text-red-800"
      case "ARCHIVED": return "bg-gray-100 text-gray-600"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "DRAFT": return "Черновик"
      case "RESEARCH": return "Desk Research"
      case "READY_FOR_TESTING": return "Готова к тестированию"
      case "IN_EXPERIMENT": return "В эксперименте"
      case "VALIDATED": return "Подтверждена"
      case "INVALIDATED": return "Опровергнута"
      case "ARCHIVED": return "Архивирована"
      default: return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL": return "bg-red-100 text-red-800"
      case "HIGH": return "bg-orange-100 text-orange-800"
      case "MEDIUM": return "bg-yellow-100 text-yellow-800"
      case "LOW": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const filtered = hypotheses.filter(h =>
    (!q || h.title.toLowerCase().includes(q.toLowerCase()) || h.statement.toLowerCase().includes(q.toLowerCase()))
  )

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
                InLab CRM
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {session.user?.name || session.user?.email}
              </div>
              <ExportButton type="hypotheses" />
              <Link
                href="/hypotheses/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Создать гипотезу
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link href="/kanban" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2">
              <span>🌊</span>
              <span>Канбан</span>
            </Link>
            <Link href="/ideas" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2">
              <span>💡</span>
              <span>Идеи</span>
            </Link>
            <Link href="/hypotheses" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600 flex items-center space-x-2">
              <span>🔬</span>
              <span>Гипотезы</span>
            </Link>
            <Link href="/experiments" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2">
              <span>⚗️</span>
              <span>Эксперименты</span>
            </Link>
            <Link href="/knowledge" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2">
              <span>📚</span>
              <span>База знаний</span>
            </Link>
            <Link href="/dashboard" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2">
              <span>📊</span>
              <span>Статистика</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Гипотезы</h1>
            <div className="flex items-center space-x-4">
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Поиск..." className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
              <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option value="">Все статусы</option>
                <option value="DRAFT">Черновик</option>
                <option value="RESEARCH">Desk Research</option>
                <option value="READY_FOR_TESTING">Готова к тестированию</option>
                <option value="IN_EXPERIMENT">В эксперименте</option>
                <option value="VALIDATED">Подтверждена</option>
                <option value="INVALIDATED">Опровергнута</option>
              </select>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView('cards')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    view === 'cards'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📋 Карточки
                </button>
                <button
                  onClick={() => setView('create')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    view === 'create'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ➕ Создать
                </button>
              </div>
            </div>
          </div>

          {view === 'create' ? (
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                🔬 Создание новой гипотезы
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Сформулируйте проверяемое предположение на основе вашей идеи
              </p>
              <div className="text-center">
                <Link
                  href="/hypotheses/new"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors inline-block"
                >
                  Перейти к форме создания
                </Link>
              </div>
              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h3 className="font-medium text-blue-900 mb-3">🔬 Структура гипотезы</h3>
                <div className="text-blue-800 text-sm space-y-3">
                  <div className="bg-white rounded p-3">
                    <strong>Если</strong> [действие/изменение]<br/>
                    <strong>То</strong> [ожидаемый результат]<br/>
                    <strong>Потому что</strong> [обоснование]
                  </div>
                  <p className="text-xs">Пример: "Если добавим кнопку быстрого заказа, то увеличим конверсию на 15%, потому что пользователи смогут оформить заказ в один клик"</p>
                </div>
              </div>
            </div>
          ) : (
            /* Cards View */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((hypothesis) => (
                <div key={hypothesis.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
                      {hypothesis.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(hypothesis.status)}`}>
                      {getStatusText(hypothesis.status)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {hypothesis.statement}
                  </p>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className={`px-2 py-1 rounded ${getPriorityColor(hypothesis.priority)}`}>
                      {hypothesis.priority}
                    </span>
                    <span className="text-gray-500">
                      Уверенность: {hypothesis.confidenceLevel}%
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>Идея: {hypothesis.idea.title}</span>
                      <span>Экспериментов: {hypothesis.experimentsCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Автор: {hypothesis.creator.name}
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/hypotheses/${hypothesis.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Подробнее
                        </Link>
                        {hypothesis.status === 'READY_FOR_TESTING' && (
                          <Link
                            href={`/experiments/new?hypothesisId=${hypothesis.id}`}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Создать эксперимент
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hypotheses.length === 0 && !loading && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🔬</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Пока нет гипотез</h3>
              <p className="text-gray-500 mb-4">
                Создайте первую гипотезу на основе ваших идей
              </p>
              <Link
                href="/hypotheses/new"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
              >
                Создать гипотезу
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}