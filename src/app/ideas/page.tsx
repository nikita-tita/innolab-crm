"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Idea {
  id: string
  title: string
  description: string
  category: string
  status: string
  priority: string
  createdAt: string
  creator: {
    name: string
    email: string
  }
}

export default function Ideas() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    // Симуляция загрузки идей
    setTimeout(() => {
      setIdeas([
        {
          id: "1",
          title: "Персонализированная аналитика",
          description: "Создать систему персонализации отчетов для каждого пользователя на основе его роли и предпочтений",
          category: "Аналитика",
          status: "NEW",
          priority: "HIGH",
          createdAt: "2024-01-15T10:30:00Z",
          creator: {
            name: "Анна Петрова",
            email: "anna@innolab.com"
          }
        },
        {
          id: "2",
          title: "Мобильное приложение",
          description: "Разработать мобильную версию системы для работы с гипотезами в поле",
          category: "Мобильная разработка",
          status: "IN_REVIEW",
          priority: "MEDIUM",
          createdAt: "2024-01-12T14:20:00Z",
          creator: {
            name: "Иван Сидоров",
            email: "ivan@innolab.com"
          }
        },
        {
          id: "3",
          title: "AI-ассистент для анализа",
          description: "Интеграция искусственного интеллекта для автоматического анализа результатов экспериментов",
          category: "Искусственный интеллект",
          status: "APPROVED",
          priority: "CRITICAL",
          createdAt: "2024-01-10T09:15:00Z",
          creator: {
            name: "Мария Козлова",
            email: "maria@innolab.com"
          }
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW": return "bg-blue-100 text-blue-800"
      case "IN_REVIEW": return "bg-yellow-100 text-yellow-800"
      case "APPROVED": return "bg-green-100 text-green-800"
      case "IN_DEVELOPMENT": return "bg-purple-100 text-purple-800"
      case "ARCHIVED": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "NEW": return "Новая"
      case "IN_REVIEW": return "На рассмотрении"
      case "APPROVED": return "Одобрена"
      case "IN_DEVELOPMENT": return "В разработке"
      case "ARCHIVED": return "Архивирована"
      default: return status
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "CRITICAL": return "Критический"
      case "HIGH": return "Высокий"
      case "MEDIUM": return "Средний"
      case "LOW": return "Низкий"
      default: return priority
    }
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
                href="/ideas/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Добавить идею
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
            <Link href="/ideas" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
              Идеи
            </Link>
            <Link href="/hypotheses" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
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
            <h1 className="text-2xl font-bold text-gray-900">Идеи</h1>
            <div className="flex space-x-4">
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option>Все статусы</option>
                <option>Новые</option>
                <option>На рассмотрении</option>
                <option>Одобренные</option>
              </select>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option>Все приоритеты</option>
                <option>Критический</option>
                <option>Высокий</option>
                <option>Средний</option>
                <option>Низкий</option>
              </select>
            </div>
          </div>

          {/* Ideas Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea) => (
              <div key={idea.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
                    {idea.title}
                  </h3>
                  <div className="flex space-x-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(idea.status)}`}>
                      {getStatusText(idea.status)}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {idea.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="bg-gray-100 px-2 py-1 rounded">{idea.category}</span>
                  <span className={`px-2 py-1 rounded ${getPriorityColor(idea.priority)}`}>
                    {getPriorityText(idea.priority)}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <div>Автор: {idea.creator.name}</div>
                      <div>Создано: {new Date(idea.createdAt).toLocaleDateString('ru-RU')}</div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/ideas/${idea.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Подробнее
                      </Link>
                      <Link
                        href={`/hypotheses/new?ideaId=${idea.id}`}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Создать гипотезу
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {ideas.length === 0 && !loading && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">💡</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Пока нет идей</h3>
              <p className="text-gray-500 mb-4">
                Создайте первую идею для начала инновационного процесса
              </p>
              <Link
                href="/ideas/new"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
              >
                Добавить идею
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}