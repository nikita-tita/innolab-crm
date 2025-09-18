"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Experiment {
  id: string
  title: string
  description: string
  status: string
  methodology?: string
  startDate?: string
  endDate?: string
  createdAt: string
  hypothesis: {
    title: string
    idea: {
      title: string
    }
  }
  creator: {
    name: string
  }
  mvpsCount: number
  commentsCount: number
}

export default function Experiments() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'cards' | 'kanban'>('kanban')

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        const response = await fetch('/api/experiments')
        if (response.ok) {
          const data = await response.json()
          const formattedData = data.map((e: unknown) => {
            const experiment = e as {
              id: string;
              title: string;
              description: string;
              status: string;
              methodology?: string;
              startDate?: string;
              endDate?: string;
              createdAt: string;
              hypothesis: {
                title: string;
                idea: { title: string };
              };
              creator: { name: string };
              _count: { mvps: number; comments: number };
            };
            return {
            id: experiment.id,
            title: experiment.title,
            description: experiment.description,
            status: experiment.status,
            methodology: experiment.methodology,
            startDate: experiment.startDate,
            endDate: experiment.endDate,
            createdAt: experiment.createdAt,
            hypothesis: {
              title: experiment.hypothesis.title,
              idea: {
                title: experiment.hypothesis.idea.title
              }
            },
            creator: {
              name: experiment.creator.name
            },
            mvpsCount: experiment._count.mvps,
            commentsCount: experiment._count.comments
          }})
          setExperiments(formattedData)
        } else {
          console.error('Failed to fetch experiments')
        }
      } catch (error) {
        console.error('Error fetching experiments:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status !== "loading") {
      fetchExperiments()
    }
  }, [status])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNING": return "bg-gray-100 text-gray-800"
      case "RUNNING": return "bg-blue-100 text-blue-800"
      case "PAUSED": return "bg-yellow-100 text-yellow-800"
      case "COMPLETED": return "bg-green-100 text-green-800"
      case "CANCELLED": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PLANNING": return "Планирование"
      case "RUNNING": return "Выполняется"
      case "PAUSED": return "Приостановлен"
      case "COMPLETED": return "Завершен"
      case "CANCELLED": return "Отменен"
      default: return status
    }
  }

  const groupedExperiments = {
    "PLANNING": experiments.filter(e => e.status === "PLANNING"),
    "RUNNING": experiments.filter(e => e.status === "RUNNING"),
    "PAUSED": experiments.filter(e => e.status === "PAUSED"),
    "COMPLETED": experiments.filter(e => e.status === "COMPLETED"),
    "CANCELLED": experiments.filter(e => e.status === "CANCELLED")
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
                href="/experiments/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Создать эксперимент
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
            <Link href="/experiments" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
              Эксперименты
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
            <h1 className="text-2xl font-bold text-gray-900">Эксперименты</h1>
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
              {Object.entries(groupedExperiments).map(([status, statusExperiments]) => (
                <div key={status} className="bg-gray-100 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center justify-between">
                    <span>{getStatusText(status)}</span>
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {statusExperiments.length}
                    </span>
                  </h3>

                  <div className="space-y-3">
                    {statusExperiments.map((experiment) => (
                      <div key={experiment.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <Link href={`/experiments/${experiment.id}`}>
                          <h4 className="font-medium text-gray-900 mb-2 text-sm">
                            {experiment.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {experiment.description}
                          </p>

                          <div className="text-xs text-gray-500 mb-2">
                            <div>Гипотеза: {experiment.hypothesis.title}</div>
                            <div>Идея: {experiment.hypothesis.idea.title}</div>
                          </div>

                          {experiment.methodology && (
                            <div className="text-xs text-blue-600 mb-2">
                              Метод: {experiment.methodology}
                            </div>
                          )}

                          <div className="flex justify-between text-xs text-gray-500">
                            <span>MVP: {experiment.mvpsCount}</span>
                            <span>Комментарии: {experiment.commentsCount}</span>
                          </div>

                          <div className="mt-2 text-xs text-gray-500">
                            Автор: {experiment.creator.name}
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>

                  {status === 'PLANNING' && (
                    <Link
                      href="/experiments/new"
                      className="mt-3 w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors block"
                    >
                      + Добавить эксперимент
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Cards View */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {experiments.map((experiment) => (
                <div key={experiment.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
                      {experiment.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(experiment.status)}`}>
                      {getStatusText(experiment.status)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {experiment.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Гипотеза:</span> {experiment.hypothesis.title}
                    </div>
                    <div>
                      <span className="font-medium">Идея:</span> {experiment.hypothesis.idea.title}
                    </div>
                    {experiment.methodology && (
                      <div>
                        <span className="font-medium">Метод:</span> {experiment.methodology}
                      </div>
                    )}
                  </div>

                  {(experiment.startDate || experiment.endDate) && (
                    <div className="text-xs text-gray-500 mb-4">
                      {experiment.startDate && (
                        <div>Начало: {new Date(experiment.startDate).toLocaleDateString('ru-RU')}</div>
                      )}
                      {experiment.endDate && (
                        <div>Окончание: {new Date(experiment.endDate).toLocaleDateString('ru-RU')}</div>
                      )}
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>MVP: {experiment.mvpsCount}</span>
                      <span>Комментарии: {experiment.commentsCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Автор: {experiment.creator.name}
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/experiments/${experiment.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Подробнее
                        </Link>
                        {experiment.status === 'PLANNING' && (
                          <Link
                            href={`/mvps/new?experimentId=${experiment.id}`}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Создать MVP
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {experiments.length === 0 && !loading && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🧪</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Пока нет экспериментов</h3>
              <p className="text-gray-500 mb-4">
                Создайте первый эксперимент для проверки ваших гипотез
              </p>
              <Link
                href="/experiments/new"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
              >
                Создать эксперимент
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}