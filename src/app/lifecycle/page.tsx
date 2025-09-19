"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

interface IdeaWithFlow {
  id: string
  title: string
  status: string
  createdAt: string
  hypotheses: Array<{
    id: string
    title: string
    status: string
    confidenceLevel: number
    experiments: Array<{
      id: string
      title: string
      status: string
      type: string
      startDate?: string
      endDate?: string
      results: Array<{
        id: string
        metricName: string
        value: number
        unit: string
      }>
    }>
  }>
}

export default function Lifecycle() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedIdea, setSelectedIdea] = useState<IdeaWithFlow | null>(null)
  const [ideas, setIdeas] = useState<IdeaWithFlow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    const fetchIdeasWithFlow = async () => {
      try {
        const response = await fetch('/api/ideas')
        if (response.ok) {
          const ideasData = await response.json()
          // Transform data to include full flow
          const transformedIdeas = ideasData.map((idea: any) => ({
            id: idea.id,
            title: idea.title,
            status: idea.status,
            createdAt: idea.createdAt,
            hypotheses: idea.hypotheses || []
          }))
          setIdeas(transformedIdeas)

          // Auto-select first idea for demo
          if (transformedIdeas.length > 0) {
            setSelectedIdea(transformedIdeas[0])
          }
        }
      } catch (error) {
        console.error('Error fetching ideas:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status !== "loading") {
      fetchIdeasWithFlow()
    }
  }, [status])

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'idea': return '💡'
      case 'hypothesis': return '🔬'
      case 'experiment': return '⚗️'
      case 'data': return '📊'
      case 'insight': return '💎'
      default: return '❓'
    }
  }

  const getStageColor = (stage: string, isActive: boolean, isCompleted: boolean) => {
    const baseColor = {
      'idea': 'blue',
      'hypothesis': 'green',
      'experiment': 'orange',
      'data': 'purple',
      'insight': 'pink'
    }[stage] || 'gray'

    if (isCompleted) return `bg-${baseColor}-500 text-white`
    if (isActive) return `bg-${baseColor}-100 text-${baseColor}-800 border-${baseColor}-300`
    return `bg-gray-100 text-gray-400 border-gray-200`
  }

  const getLifecycleStatus = (idea: IdeaWithFlow) => {
    const hasHypotheses = idea.hypotheses.length > 0
    const hasExperiments = idea.hypotheses.some(h => h.experiments?.length > 0)
    const hasResults = idea.hypotheses.some(h =>
      h.experiments?.some(e => e.results?.length > 0)
    )
    const hasValidatedHypotheses = idea.hypotheses.some(h => h.status === 'VALIDATED')

    return {
      idea: true, // Always true if idea exists
      hypothesis: hasHypotheses,
      experiment: hasExperiments,
      data: hasResults,
      insight: hasValidatedHypotheses
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
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
              <Link href="/dashboard" className="text-2xl font-bold text-white hover:text-blue-100 transition-colors">
                InnoLab CRM
              </Link>
              <span className="mx-3 text-blue-300">→</span>
              <h1 className="text-xl font-semibold text-white">Жизненный цикл инноваций</h1>
            </div>
            <div className="text-sm text-blue-100">
              {session.user?.name || session.user?.email}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link href="/dashboard" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2">
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
            <div className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600 flex items-center space-x-2">
              <span>🔄</span>
              <span>Жизненный цикл</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">

          {/* Ideas Selector */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">🎯</span>
              Выберите идею для отслеживания
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ideas.map((idea) => {
                const status = getLifecycleStatus(idea)
                const completedStages = Object.values(status).filter(Boolean).length

                return (
                  <button
                    key={idea.id}
                    onClick={() => setSelectedIdea(idea)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      selectedIdea?.id === idea.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{idea.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Этап {completedStages}/5
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(completedStages / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {selectedIdea && (
            <>
              {/* HADI Flow Visualization */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  HADI Жизненный цикл: "{selectedIdea.title}"
                </h2>

                {/* Flow Steps */}
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-16 left-0 right-0 h-1 bg-gray-200 rounded"></div>
                  <div
                    className="absolute top-16 left-0 h-1 bg-blue-500 rounded transition-all duration-1000"
                    style={{
                      width: `${(Object.values(getLifecycleStatus(selectedIdea)).filter(Boolean).length / 5) * 100}%`
                    }}
                  ></div>

                  {/* Stages */}
                  <div className="grid grid-cols-5 gap-4 relative z-10">
                    {[
                      { key: 'idea', name: 'Идея', description: 'Формулировка проблемы' },
                      { key: 'hypothesis', name: 'Гипотеза', description: 'Предположение решения' },
                      { key: 'experiment', name: 'Эксперимент', description: 'Проверка гипотезы' },
                      { key: 'data', name: 'Данные', description: 'Сбор результатов' },
                      { key: 'insight', name: 'Инсайт', description: 'Выводы и решения' }
                    ].map((stage, index) => {
                      const status = getLifecycleStatus(selectedIdea)
                      const isCompleted = status[stage.key as keyof typeof status]
                      const isActive = index === Object.values(status).filter(Boolean).length - 1

                      return (
                        <div key={stage.key} className="text-center">
                          <div className={`w-16 h-16 mx-auto rounded-full border-4 flex items-center justify-center text-2xl transition-all duration-300 ${
                            isCompleted
                              ? 'bg-blue-500 border-blue-500 text-white transform scale-110'
                              : isActive
                                ? 'bg-blue-100 border-blue-300 text-blue-600 animate-pulse'
                                : 'bg-white border-gray-300 text-gray-400'
                          }`}>
                            {getStageIcon(stage.key)}
                          </div>
                          <h3 className={`mt-3 font-semibold ${
                            isCompleted ? 'text-blue-600' : isActive ? 'text-blue-500' : 'text-gray-400'
                          }`}>
                            {stage.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">{stage.description}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Detailed Flow Information */}
              <div className="grid lg:grid-cols-2 gap-8">

                {/* Left Column - Current State */}
                <div className="space-y-6">

                  {/* Idea Details */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="text-xl mr-2">💡</span>
                      Идея
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Статус:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedIdea.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          selectedIdea.status === 'IN_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedIdea.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Создана:</span>
                        <span className="text-gray-900">
                          {new Date(selectedIdea.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Гипотез:</span>
                        <span className="text-gray-900">{selectedIdea.hypotheses.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hypotheses */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="text-xl mr-2">🔬</span>
                      Гипотезы ({selectedIdea.hypotheses.length})
                    </h3>
                    {selectedIdea.hypotheses.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-gray-500 mb-3">Гипотезы еще не созданы</p>
                        <Link
                          href={`/hypotheses/new?ideaId=${selectedIdea.id}`}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <span className="mr-2">➕</span>
                          Создать первую гипотезу
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedIdea.hypotheses.map((hypothesis) => (
                          <div key={hypothesis.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">{hypothesis.title}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                hypothesis.status === 'VALIDATED' ? 'bg-green-100 text-green-800' :
                                hypothesis.status === 'INVALIDATED' ? 'bg-red-100 text-red-800' :
                                hypothesis.status === 'IN_EXPERIMENT' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {hypothesis.status}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Уверенность: {hypothesis.confidenceLevel}%</span>
                              <span className="text-gray-600">
                                Экспериментов: {hypothesis.experiments?.length || 0}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Next Steps & Progress */}
                <div className="space-y-6">

                  {/* Experiments */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="text-xl mr-2">⚗️</span>
                      Эксперименты
                    </h3>
                    {selectedIdea.hypotheses.flatMap(h => h.experiments || []).length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-gray-500 mb-3">Эксперименты еще не запущены</p>
                        {selectedIdea.hypotheses.some(h => h.status === 'READY_FOR_TESTING') && (
                          <Link
                            href="/experiments/new"
                            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                          >
                            <span className="mr-2">🚀</span>
                            Запустить эксперимент
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedIdea.hypotheses.flatMap(h => h.experiments || []).map((experiment) => (
                          <div key={experiment.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">{experiment.title}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                experiment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                experiment.status === 'RUNNING' ? 'bg-blue-100 text-blue-800' :
                                experiment.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {experiment.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>Тип: {experiment.type}</p>
                              {experiment.startDate && (
                                <p>Начат: {new Date(experiment.startDate).toLocaleDateString('ru-RU')}</p>
                              )}
                              <p>Результатов: {experiment.results?.length || 0}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Next Steps */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                      <span className="text-xl mr-2">🎯</span>
                      Следующие шаги
                    </h3>
                    <div className="space-y-3">
                      {selectedIdea.hypotheses.length === 0 ? (
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-blue-800 font-medium">1. Создать гипотезу</p>
                          <p className="text-blue-600 text-sm">Сформулируйте проверяемое предположение</p>
                        </div>
                      ) : selectedIdea.hypotheses.some(h => h.status === 'DRAFT') ? (
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-blue-800 font-medium">1. Доработать гипотезы</p>
                          <p className="text-blue-600 text-sm">Переведите черновики в статус "Готова к тестированию"</p>
                        </div>
                      ) : selectedIdea.hypotheses.some(h => h.status === 'READY_FOR_TESTING') ? (
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-blue-800 font-medium">1. Запустить эксперимент</p>
                          <p className="text-blue-600 text-sm">Создайте эксперимент для проверки гипотезы</p>
                        </div>
                      ) : selectedIdea.hypotheses.some(h => h.experiments?.some(e => e.status === 'RUNNING')) ? (
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-blue-800 font-medium">1. Собрать данные</p>
                          <p className="text-blue-600 text-sm">Дождитесь результатов эксперимента</p>
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-blue-800 font-medium">1. Проанализировать результаты</p>
                          <p className="text-blue-600 text-sm">Сделайте выводы и определите следующие действия</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {ideas.length === 0 && !loading && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">💡</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Пока нет идей</h3>
              <p className="text-gray-500 mb-4">
                Создайте первую идею для начала HADI процесса
              </p>
              <Link
                href="/ideas/new"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
              >
                Создать идею
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}