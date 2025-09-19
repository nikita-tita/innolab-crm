"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    ideas: 0,
    hypotheses: 0,
    experiments: 0,
    successRate: 0
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ideasRes, hypothesesRes, experimentsRes] = await Promise.all([
          fetch('/api/ideas'),
          fetch('/api/hypotheses'),
          fetch('/api/experiments')
        ])

        const ideas = ideasRes.ok ? await ideasRes.json() : []
        const hypotheses = hypothesesRes.ok ? await hypothesesRes.json() : []
        const experiments = experimentsRes.ok ? await experimentsRes.json() : []

        // Подсчет успешности на основе подтвержденных гипотез
        const validatedHypotheses = hypotheses.filter((h: { status: string }) => h.status === 'VALIDATED')
        const successRate = hypotheses.length > 0
          ? Math.round((validatedHypotheses.length / hypotheses.length) * 100)
          : 0

        setStats({
          ideas: ideas.length,
          hypotheses: hypotheses.length,
          experiments: experiments.length,
          successRate
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Fallback to mock data if API fails
        setStats({
          ideas: 3,
          hypotheses: 3,
          experiments: 2,
          successRate: 67
        })
      }
    }

    if (status !== "loading") {
      fetchStats()
    }
  }, [status])

  if (status === "loading") {
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
              <h1 className="text-2xl font-bold text-gray-900">InnoLab CRM</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Добро пожаловать, {session.user?.name || session.user?.email}
              </div>
              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {session.user?.role || 'USER'}
              </div>
              <button
                onClick={() => signOut()}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link href="/dashboard" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
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
            <Link href="/knowledge" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              База знаний
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">💡</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Идеи</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.ideas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">🔬</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Гипотезы</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.hypotheses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">⚗️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Эксперименты</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.experiments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Успешность</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.successRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Быстрые действия</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/ideas/new"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-2xl mr-3">➕</span>
              <div>
                <h3 className="font-medium text-blue-900">Добавить идею</h3>
                <p className="text-sm text-blue-600">Создать новую инновационную идею</p>
              </div>
            </Link>

            <Link
              href="/hypotheses/new"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span className="text-2xl mr-3">🧪</span>
              <div>
                <h3 className="font-medium text-green-900">Создать гипотезу</h3>
                <p className="text-sm text-green-600">Сформулировать проверяемую гипотезу</p>
              </div>
            </Link>

            <Link
              href="/experiments/new"
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <span className="text-2xl mr-3">🔬</span>
              <div>
                <h3 className="font-medium text-orange-900">Запустить эксперимент</h3>
                <p className="text-sm text-orange-600">Начать тестирование гипотезы</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Недавняя активность</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Гипотеза &quot;Увеличение конверсии&quot; подтверждена</p>
                  <p className="text-xs text-gray-500">2 часа назад</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Создан новый эксперимент &quot;A/B тест лендинга&quot;</p>
                  <p className="text-xs text-gray-500">4 часа назад</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Добавлена идея &quot;Мобильное приложение&quot;</p>
                  <p className="text-xs text-gray-500">1 день назад</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">HADI Циклы в работе</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">Персонализация UX</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Action</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Если добавить персональные рекомендации, то конверсия увеличится на 20%
                </p>
                <div className="text-xs text-gray-500">
                  Прогресс: MVP готов, начинаем A/B тест
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">Чат-бот поддержки</h3>
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Data</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Если внедрить чат-бот, то время отклика сократится на 50%
                </p>
                <div className="text-xs text-gray-500">
                  Прогресс: Собираем данные за 2 недели
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}