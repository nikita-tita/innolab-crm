"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import AppLayout from "@/components/layout/AppLayout"

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
  const [view, setView] = useState<'cards' | 'create'>('cards')
  const [q, setQ] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        const params = new URLSearchParams()
        if (statusFilter) params.set('status', statusFilter)
        const response = await fetch('/api/experiments' + (params.size ? `?${params.toString()}` : ''))
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
  }, [status, statusFilter])

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

  const filtered = experiments.filter(e =>
    (!q || e.title.toLowerCase().includes(q.toLowerCase()) || e.description.toLowerCase().includes(q.toLowerCase()))
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
    <AppLayout>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">⚗️ Эксперименты</h1>
            <div className="flex items-center space-x-4">
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Поиск..." className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
              <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option value="">Все статусы</option>
                <option value="PLANNING">Планирование</option>
                <option value="RUNNING">Выполняется</option>
                <option value="PAUSED">Пауза</option>
                <option value="COMPLETED">Завершён</option>
                <option value="CANCELLED">Отменён</option>
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

          {/* Info Section */}
          {experiments.length === 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-purple-900 mb-2">🧪 Начните с первого эксперимента!</h2>
              <p className="text-purple-800 mb-4">
                Эксперименты — это быстрые и дешевые способы проверить ваши гипотезы на практике.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-purple-100 rounded-lg p-3">
                  <h3 className="font-medium text-purple-900 mb-1">Планирование</h3>
                  <p className="text-purple-800">Определите метрики и критерии успеха</p>
                </div>
                <div className="bg-purple-100 rounded-lg p-3">
                  <h3 className="font-medium text-purple-900 mb-1">Выполнение</h3>
                  <p className="text-purple-800">Запустите MVP, лендинг или опрос</p>
                </div>
                <div className="bg-purple-100 rounded-lg p-3">
                  <h3 className="font-medium text-purple-900 mb-1">Сбор данных</h3>
                  <p className="text-purple-800">Фиксируйте результаты тестирования</p>
                </div>
                <div className="bg-purple-100 rounded-lg p-3">
                  <h3 className="font-medium text-purple-900 mb-1">Выводы</h3>
                  <p className="text-purple-800">Подтвердите или опровергните гипотезу</p>
                </div>
              </div>
            </div>
          )}

          {experiments.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-indigo-900">
                    📊 Всего экспериментов: {experiments.length}
                  </h3>
                  <p className="text-xs text-indigo-700 mt-1">
                    Используйте канбан-доску для отслеживания прогресса или карточки для детального просмотра
                  </p>
                </div>
                <Link
                  href="/experiments/new"
                  className="bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700"
                >
                  + Добавить эксперимент
                </Link>
              </div>
            </div>
          )}

          {view === 'create' ? (
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                ⚗️ Создание нового эксперимента
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Спланируйте эксперимент для проверки вашей гипотезы
              </p>
              <div className="text-center">
                <Link
                  href="/experiments/new"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors inline-block"
                >
                  Перейти к форме создания
                </Link>
              </div>
              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h3 className="font-medium text-blue-900 mb-3">⚗️ Типы экспериментов</h3>
                <div className="text-blue-800 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <span>🖥️</span>
                    <span><strong>Лендинг-пейдж</strong> — тестирование интереса к продукту</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📊</span>
                    <span><strong>A/B тест</strong> — сравнение двух вариантов решения</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📱</span>
                    <span><strong>MVP</strong> — минимально жизнеспособный продукт</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📋</span>
                    <span><strong>Опрос</strong> — изучение потребностей аудитории</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Cards View */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((experiment) => (
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
    </AppLayout>
  )
}