"use client"

import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"
import RecentActivity from "@/components/ui/RecentActivity"
import ExportButton from "@/components/ui/ExportButton"
import { canCreate, isViewer, getRoleDisplayName } from "@/lib/permissions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AppLayout from "@/components/layout/AppLayout"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState({
    ideas: 0,
    hypotheses: 0,
    experiments: 0,
    successRate: 0
  })

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

      const successfulExperiments = experiments.filter((exp: any) => exp.status === 'VALIDATED').length
      const successRate = experiments.length > 0 ? Math.round((successfulExperiments / experiments.length) * 100) : 0

      setStats({
        ideas: ideas.length,
        hypotheses: hypotheses.length,
        experiments: experiments.length,
        successRate
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      setStats({
        ideas: 0,
        hypotheses: 0,
        experiments: 0,
        successRate: 0
      })
    }
  }

  useEffect(() => {
    if (status !== "loading") {
      fetchStats()
    }
  }, [status])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && session) {
        fetchStats()
      }
    }

    const handleFocus = () => {
      if (session) {
        fetchStats()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [session])

  if (!session) {
    return null
  }

  const userRole = session.user.role as any
  const isReadOnlyUser = isViewer(userRole)

  return (
    <AppLayout>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              📊 Статистика и аналитика
            </h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchStats}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                🔄 Обновить
              </button>
              {canCreate(session?.user?.role || '') && (
                <>
                  <Link href="/ideas/new" className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                    💡 Создать идею
                  </Link>
                  <Link href="/hypotheses/new" className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                    🔬 Создать гипотезу
                  </Link>
                </>
              )}
            </div>
          </div>
          {isReadOnlyUser && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-amber-900 mb-2">Режим просмотра</h3>
              <p className="text-amber-800 text-sm">
                У вас есть доступ только для просмотра данных. Создание и редактирование недоступны.
                Если вам нужен расширенный доступ, обратитесь к администратору.
              </p>
            </div>
          )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/ideas" className="block group">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-200 group-hover:bg-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Идеи</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.ideas}</p>
                  <p className="text-xs text-blue-600 mt-1">Нажмите для просмотра</p>
                </div>
                <div className="text-3xl group-hover:scale-110 transition-transform duration-200">💡</div>
              </div>
            </div>
          </Link>

          <Link href="/hypotheses" className="block group">
            <div className="bg-green-50 rounded-xl p-6 border border-green-100 hover:shadow-lg transition-all duration-200 group-hover:bg-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Гипотезы</p>
                  <p className="text-3xl font-bold text-green-900">{stats.hypotheses}</p>
                  <p className="text-xs text-green-600 mt-1">Нажмите для просмотра</p>
                </div>
                <div className="text-3xl group-hover:scale-110 transition-transform duration-200">🔬</div>
              </div>
            </div>
          </Link>

          <Link href="/experiments" className="block group">
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-200 group-hover:bg-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Эксперименты</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.experiments}</p>
                  <p className="text-xs text-purple-600 mt-1">Нажмите для просмотра</p>
                </div>
                <div className="text-3xl group-hover:scale-110 transition-transform duration-200">⚗️</div>
              </div>
            </div>
          </Link>

          <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Успешность</p>
                <p className="text-3xl font-bold text-orange-900">{stats.successRate}%</p>
                <p className="text-xs text-orange-600 mt-1">Доля успешных экспериментов</p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </div>
        </div>

        {/* How it Works Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚀 Как работает InLab
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">1. Создайте идею</h3>
              <p className="text-gray-600 text-sm">
                Опишите идею нового продукта или улучшения. Команда оценит ее по ICE-критериям
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">2. Сформулируйте гипотезу</h3>
              <p className="text-gray-600 text-sm">
                Превратите лучшие идеи в проверяемые гипотезы по формату "Если..., то..., потому что..."
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚗️</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">3. Проведите эксперимент</h3>
              <p className="text-gray-600 text-sm">
                Протестируйте гипотезу быстро и дешево: лендинг, прототип, опросы или MVP
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {canCreate(userRole) && (
            <>
              <Link
                href="/ideas/new"
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-200">💡</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      Новая идея
                    </h3>
                    <p className="text-gray-600 text-sm">Добавить идею для проработки команды</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/hypotheses/new"
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-200">🔬</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      Новая гипотеза
                    </h3>
                    <p className="text-gray-600 text-sm">Сформулировать проверяемое предположение</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/experiments/new"
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-200">⚗️</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      Новый эксперимент
                    </h3>
                    <p className="text-gray-600 text-sm">Спланировать тест для проверки гипотезы</p>
                  </div>
                </div>
              </Link>
            </>
          )}
        </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="text-2xl mr-2">📋</span>
              Последние обновления
            </h2>
            <RecentActivity />
          </div>
        </div>
      </main>
    </AppLayout>
  )
}