"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import RecentActivity from "@/components/ui/RecentActivity"
import ExportButton from "@/components/ui/ExportButton"

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-2 mr-3">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">InnoLab CRM</h1>
                <p className="text-blue-100 text-sm">Система управления инновациями</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-blue-100">
                Добро пожаловать, <span className="text-white font-medium">{session.user?.name || session.user?.email}</span>
              </div>
              <div className="text-xs bg-white bg-opacity-20 text-white px-3 py-1 rounded-full font-medium">
                {session.user?.role || 'USER'}
              </div>
              <div className="border-l border-white border-opacity-30 pl-4">
                <ExportButton type="all" className="[&>div>button]:bg-white [&>div>button]:bg-opacity-20 [&>div>button]:text-white [&>div>button]:border-white [&>div>button]:border-opacity-30 [&>div>button:hover]:bg-opacity-30" />
              </div>
              <button
                onClick={() => signOut()}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 border border-white border-opacity-30"
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
            <Link href="/dashboard" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600 flex items-center space-x-2">
              <span>📊</span>
              <span>Дашборд</span>
            </Link>
            <Link href="/ideas" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2">
              <span>💡</span>
              <span>Идеи</span>
            </Link>
            <Link href="/hypotheses" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2">
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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl shadow-md">
                <span className="text-2xl filter drop-shadow-sm">💡</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Идеи</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.ideas}</p>
                <p className="text-xs text-green-600 mt-1">+2 за неделю</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-400 to-green-500 rounded-xl shadow-md">
                <span className="text-2xl filter drop-shadow-sm">🔬</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Гипотезы</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.hypotheses}</p>
                <p className="text-xs text-blue-600 mt-1">1 в работе</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl shadow-md">
                <span className="text-2xl filter drop-shadow-sm">⚗️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Эксперименты</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.experiments}</p>
                <p className="text-xs text-orange-600 mt-1">1 активный</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl shadow-md">
                <span className="text-2xl filter drop-shadow-sm">📊</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Успешность</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.successRate}%</p>
                <p className={`text-xs mt-1 ${stats.successRate >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.successRate >= 50 ? 'Хороший результат' : 'Нужно улучшить'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-2">⚡</span>
            Быстрые действия
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/ideas/new"
              className="group flex items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-blue-200"
            >
              <div className="bg-blue-500 p-3 rounded-xl mr-4 group-hover:bg-blue-600 transition-colors duration-300">
                <span className="text-2xl text-white">💡</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 group-hover:text-blue-800">Добавить идею</h3>
                <p className="text-sm text-blue-600 mt-1">Создать новую инновационную идею</p>
              </div>
            </Link>

            <Link
              href="/hypotheses/new"
              className="group flex items-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-green-200"
            >
              <div className="bg-green-500 p-3 rounded-xl mr-4 group-hover:bg-green-600 transition-colors duration-300">
                <span className="text-2xl text-white">🧪</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-900 group-hover:text-green-800">Создать гипотезу</h3>
                <p className="text-sm text-green-600 mt-1">Сформулировать проверяемую гипотезу</p>
              </div>
            </Link>

            <Link
              href="/experiments/new"
              className="group flex items-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-orange-200"
            >
              <div className="bg-orange-500 p-3 rounded-xl mr-4 group-hover:bg-orange-600 transition-colors duration-300">
                <span className="text-2xl text-white">🔬</span>
              </div>
              <div>
                <h3 className="font-semibold text-orange-900 group-hover:text-orange-800">Запустить эксперимент</h3>
                <p className="text-sm text-orange-600 mt-1">Начать тестирование гипотезы</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          <RecentActivity />

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="text-2xl mr-2">🔄</span>
              HADI Циклы в работе
            </h2>
            <div className="space-y-6">
              <div className="border-2 border-blue-200 rounded-xl p-5 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg">Персонализация UX</h3>
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">Action</span>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3 font-medium">
                  Если добавить персональные рекомендации, то конверсия увеличится на 20%
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600 bg-white px-3 py-1 rounded-full">
                    📊 Прогресс: MVP готов, начинаем A/B тест
                  </div>
                  <div className="text-xs text-blue-600 font-medium">80% готов</div>
                </div>
              </div>

              <div className="border-2 border-orange-200 rounded-xl p-5 bg-gradient-to-br from-orange-50 to-orange-100">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg">Чат-бот поддержки</h3>
                  <div className="flex items-center space-x-2">
                    <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">Data</span>
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3 font-medium">
                  Если внедрить чат-бот, то время отклика сократится на 50%
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600 bg-white px-3 py-1 rounded-full">
                    📈 Прогресс: Собираем данные за 2 недели
                  </div>
                  <div className="text-xs text-orange-600 font-medium">45% готов</div>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link href="/experiments" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center">
                Посмотреть все эксперименты
                <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}