"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

interface MVP {
  id: string
  title: string
  description: string
  type: string
  status: string
  features?: string
  timeline?: string
  createdAt: string
  experiment: {
    title: string
    hypothesis: {
      title: string
      idea: {
        title: string
      }
    }
  }
  creator: {
    name: string
  }
  commentsCount: number
}

export default function MVPs() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mvps, setMvps] = useState<MVP[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'cards' | 'kanban'>('kanban')

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    const fetchMVPs = async () => {
      try {
        const response = await fetch('/api/mvps')
        if (response.ok) {
          const data = await response.json()
          const formattedData = data.map((m: any) => ({
            id: m.id,
            title: m.title,
            description: m.description,
            type: m.type,
            status: m.status,
            features: m.features,
            timeline: m.timeline,
            createdAt: m.createdAt,
            experiment: {
              title: m.experiment.title,
              hypothesis: {
                title: m.experiment.hypothesis.title,
                idea: {
                  title: m.experiment.hypothesis.idea.title
                }
              }
            },
            creator: {
              name: m.creator.name
            },
            commentsCount: m._count.comments
          }))
          setMvps(formattedData)
        } else {
          console.error('Failed to fetch MVPs')
        }
      } catch (error) {
        console.error('Error fetching MVPs:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status !== "loading") {
      fetchMVPs()
    }
  }, [status])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNING": return "bg-gray-100 text-gray-800"
      case "DEVELOPMENT": return "bg-blue-100 text-blue-800"
      case "TESTING": return "bg-yellow-100 text-yellow-800"
      case "DEPLOYED": return "bg-green-100 text-green-800"
      case "ARCHIVED": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PLANNING": return "Планирование"
      case "DEVELOPMENT": return "Разработка"
      case "TESTING": return "Тестирование"
      case "DEPLOYED": return "Развернут"
      case "ARCHIVED": return "Архивирован"
      default: return status
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PROTOTYPE": return "bg-purple-100 text-purple-800"
      case "WIREFRAME": return "bg-gray-100 text-gray-800"
      case "MOCKUP": return "bg-blue-100 text-blue-800"
      case "LANDING_PAGE": return "bg-green-100 text-green-800"
      case "DEMO": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "PROTOTYPE": return "Прототип"
      case "WIREFRAME": return "Wireframe"
      case "MOCKUP": return "Макет"
      case "LANDING_PAGE": return "Landing Page"
      case "DEMO": return "Демо"
      default: return type
    }
  }

  const groupedMVPs = {
    "PLANNING": mvps.filter(m => m.status === "PLANNING"),
    "DEVELOPMENT": mvps.filter(m => m.status === "DEVELOPMENT"),
    "TESTING": mvps.filter(m => m.status === "TESTING"),
    "DEPLOYED": mvps.filter(m => m.status === "DEPLOYED"),
    "ARCHIVED": mvps.filter(m => m.status === "ARCHIVED")
  }

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
                InnoLab CRM
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {session.user?.name || session.user?.email}
              </div>
              <Link
                href="/mvps/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Создать MVP
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link href="/dashboard" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Дашборд
            </Link>
            <Link href="/ideas" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Идеи
            </Link>
            <Link href="/hypotheses" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Гипотезы
            </Link>
            <Link href="/experiments" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Эксперименты
            </Link>
            <Link href="/mvps" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
              MVP
            </Link>
            <Link href="/knowledge" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              База знаний
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">MVP</h1>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView('kanban')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    view === 'kanban'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Канбан
                </button>
                <button
                  onClick={() => setView('cards')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    view === 'cards'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Карточки
                </button>
              </div>
            </div>
          </div>

          {view === 'kanban' ? (
            /* Kanban View */
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {Object.entries(groupedMVPs).map(([status, statusMVPs]) => (
                <div key={status} className="bg-gray-100 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center justify-between">
                    <span>{getStatusText(status)}</span>
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {statusMVPs.length}
                    </span>
                  </h3>

                  <div className="space-y-3">
                    {statusMVPs.map((mvp) => (
                      <div key={mvp.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <Link href={`/mvps/${mvp.id}`}>
                          <h4 className="font-medium text-gray-900 mb-2 text-sm">
                            {mvp.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {mvp.description}
                          </p>

                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className={`px-2 py-1 rounded ${getTypeColor(mvp.type)}`}>
                              {getTypeText(mvp.type)}
                            </span>
                          </div>

                          <div className="text-xs text-gray-500 space-y-1">
                            <div>Эксп.: {mvp.experiment.title}</div>
                            <div>Гипотеза: {mvp.experiment.hypothesis.title}</div>
                            <div>Идея: {mvp.experiment.hypothesis.idea.title}</div>
                          </div>

                          <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Автор: {mvp.creator.name}</span>
                            <span>Комм.: {mvp.commentsCount}</span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>

                  {status === 'PLANNING' && (
                    <Link
                      href="/mvps/new"
                      className="mt-3 w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors block"
                    >
                      + Добавить MVP
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Cards View */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mvps.map((mvp) => (
                <div key={mvp.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
                      {mvp.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(mvp.status)}`}>
                      {getStatusText(mvp.status)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {mvp.description}
                  </p>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className={`px-2 py-1 rounded ${getTypeColor(mvp.type)}`}>
                      {getTypeText(mvp.type)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Эксперимент:</span> {mvp.experiment.title}
                    </div>
                    <div>
                      <span className="font-medium">Гипотеза:</span> {mvp.experiment.hypothesis.title}
                    </div>
                    <div>
                      <span className="font-medium">Идея:</span> {mvp.experiment.hypothesis.idea.title}
                    </div>
                  </div>

                  {mvp.features && (
                    <div className="text-xs text-gray-500 mb-4">
                      <span className="font-medium">Функции:</span> {mvp.features}
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>Комментарии: {mvp.commentsCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Автор: {mvp.creator.name}
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/mvps/${mvp.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Подробнее
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {mvps.length === 0 && !loading && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🚀</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Пока нет MVP</h3>
              <p className="text-gray-500 mb-4">
                Создайте первый MVP для проверки ваших гипотез
              </p>
              <Link
                href="/mvps/new"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
              >
                Создать MVP
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}