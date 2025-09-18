"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

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
  const [view, setView] = useState<'cards' | 'kanban'>('kanban')

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    // Симуляция загрузки гипотез
    setTimeout(() => {
      setHypotheses([
        {
          id: "1",
          title: "Увеличение конверсии через персонализацию",
          statement: "Если мы добавим персональные рекомендации на главную страницу, то конверсия увеличится на 20%, что мы измерим через процент переходов к покупке",
          status: "VALIDATED",
          priority: "HIGH",
          confidenceLevel: 85,
          createdAt: "2024-01-15T10:30:00Z",
          idea: {
            title: "Персонализированная аналитика"
          },
          creator: {
            name: "Анна Петрова"
          },
          experimentsCount: 2
        },
        {
          id: "2",
          title: "Мобильное приложение для полевых исследований",
          statement: "Если мы создадим мобильное приложение для сбора данных в поле, то эффективность исследований увеличится на 40%",
          status: "IN_EXPERIMENT",
          priority: "MEDIUM",
          confidenceLevel: 70,
          createdAt: "2024-01-12T14:20:00Z",
          idea: {
            title: "Мобильное приложение"
          },
          creator: {
            name: "Иван Сидоров"
          },
          experimentsCount: 1
        },
        {
          id: "3",
          title: "AI-анализ для автоматизации выводов",
          statement: "Если мы внедрим ИИ для анализа результатов экспериментов, то время на формирование инсайтов сократится на 60%",
          status: "READY_FOR_TESTING",
          priority: "CRITICAL",
          confidenceLevel: 90,
          createdAt: "2024-01-10T09:15:00Z",
          idea: {
            title: "AI-ассистент для анализа"
          },
          creator: {
            name: "Мария Козлова"
          },
          experimentsCount: 0
        },
        {
          id: "4",
          title: "Чат-бот для улучшения поддержки",
          statement: "Если мы внедрим чат-бот для первичной поддержки пользователей, то время отклика сократится на 50%",
          status: "DRAFT",
          priority: "LOW",
          confidenceLevel: 60,
          createdAt: "2024-01-08T16:45:00Z",
          idea: {
            title: "Автоматизация поддержки"
          },
          creator: {
            name: "Петр Иванов"
          },
          experimentsCount: 0
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-100 text-gray-800"
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

  const groupedHypotheses = {
    "DRAFT": hypotheses.filter(h => h.status === "DRAFT"),
    "READY_FOR_TESTING": hypotheses.filter(h => h.status === "READY_FOR_TESTING"),
    "IN_EXPERIMENT": hypotheses.filter(h => h.status === "IN_EXPERIMENT"),
    "VALIDATED": hypotheses.filter(h => h.status === "VALIDATED"),
    "INVALIDATED": hypotheses.filter(h => h.status === "INVALIDATED")
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
                href="/hypotheses/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Создать гипотезу
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
            <Link href="/hypotheses" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
              Гипотезы
            </Link>
            <Link href="/experiments" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
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
            <h1 className="text-2xl font-bold text-gray-900">Гипотезы</h1>
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
              {Object.entries(groupedHypotheses).map(([status, statusHypotheses]) => (
                <div key={status} className="bg-gray-100 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center justify-between">
                    <span>{getStatusText(status)}</span>
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {statusHypotheses.length}
                    </span>
                  </h3>

                  <div className="space-y-3">
                    {statusHypotheses.map((hypothesis) => (
                      <div key={hypothesis.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <Link href={`/hypotheses/${hypothesis.id}`}>
                          <h4 className="font-medium text-gray-900 mb-2 text-sm">
                            {hypothesis.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {hypothesis.statement}
                          </p>

                          <div className="flex items-center justify-between text-xs">
                            <span className={`px-2 py-1 rounded ${getPriorityColor(hypothesis.priority)}`}>
                              {hypothesis.priority}
                            </span>
                            <span className="text-gray-500">
                              {hypothesis.confidenceLevel}%
                            </span>
                          </div>

                          <div className="mt-2 text-xs text-gray-500">
                            <div>Идея: {hypothesis.idea.title}</div>
                            <div className="flex justify-between mt-1">
                              <span>Автор: {hypothesis.creator.name}</span>
                              <span>Эксп: {hypothesis.experimentsCount}</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>

                  {status === 'DRAFT' && (
                    <Link
                      href="/hypotheses/new"
                      className="mt-3 w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors block"
                    >
                      + Добавить гипотезу
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Cards View */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hypotheses.map((hypothesis) => (
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