"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"
import RecentActivity from "@/components/ui/RecentActivity"
import ExportButton from "@/components/ui/ExportButton"
import { canCreate, isViewer, getRoleDisplayName } from "@/lib/permissions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState({
    ideas: 0,
    hypotheses: 0,
    experiments: 0,
    successRate: 0
  })

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

    if (status !== "loading") {
      fetchStats()
    }
  }, [status])

  if (!session) {
    return null
  }

  const userRole = session.user.role as any
  const isReadOnlyUser = isViewer(userRole)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">InnoLab CRM</h1>
              <div className="text-sm text-gray-600">
                {session?.user?.name} | {getRoleDisplayName(session?.user?.role || '')}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ExportButton />
              {session?.user?.role === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Админка
                  </Button>
                </Link>
              )}
              <Badge variant="secondary" className="text-xs">
                v1.0.0
              </Badge>
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
            <Link href="/analytics" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2">
              <span>📈</span>
              <span>Аналитика</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Идеи</p>
                <p className="text-3xl font-bold text-blue-900">{stats.ideas}</p>
              </div>
              <div className="text-3xl">💡</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Гипотезы</p>
                <p className="text-3xl font-bold text-green-900">{stats.hypotheses}</p>
              </div>
              <div className="text-3xl">🔬</div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Эксперименты</p>
                <p className="text-3xl font-bold text-purple-900">{stats.experiments}</p>
              </div>
              <div className="text-3xl">⚗️</div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Успешность</p>
                <p className="text-3xl font-bold text-orange-900">{stats.successRate}%</p>
              </div>
              <div className="text-3xl">📈</div>
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
                    <p className="text-gray-600 text-sm">Добавить идею для проработки</p>
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
                    <p className="text-gray-600 text-sm">Сформулировать гипотезу</p>
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
                    <p className="text-gray-600 text-sm">Запланировать эксперимент</p>
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
    </div>
  )
}