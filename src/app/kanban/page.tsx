"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { canCreate, isViewer, getRoleDisplayName } from "@/lib/permissions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
  riceScore?: number
  hypotheses: Hypothesis[]
}

interface Hypothesis {
  id: string
  title: string
  statement: string
  status: string
  level: string
  createdAt: string
  experiments: Experiment[]
}

interface Experiment {
  id: string
  title: string
  status: string
  createdAt: string
}

export default function KanbanPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/ideas?include=hypotheses,experiments')
        if (response.ok) {
          const data = await response.json()
          setIdeas(data)
        }
      } catch (error) {
        console.error('Error fetching workflow data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status !== "loading") {
      fetchData()
    }
  }, [status])

  const getStatusColor = (status: string, type: 'idea' | 'hypothesis' | 'experiment') => {
    if (type === 'idea') {
      switch (status) {
        case "NEW": return "bg-blue-100 text-blue-800 border-blue-200"
        case "SCORED": return "bg-purple-100 text-purple-800 border-purple-200"
        case "SELECTED": return "bg-green-100 text-green-800 border-green-200"
        default: return "bg-gray-100 text-gray-800 border-gray-200"
      }
    }
    if (type === 'hypothesis') {
      switch (status) {
        case "DRAFT": return "bg-yellow-100 text-yellow-800 border-yellow-200"
        case "RESEARCH": return "bg-purple-100 text-purple-800 border-purple-200"
        case "READY_FOR_TESTING": return "bg-blue-100 text-blue-800 border-blue-200"
        case "IN_EXPERIMENT": return "bg-orange-100 text-orange-800 border-orange-200"
        case "VALIDATED": return "bg-green-100 text-green-800 border-green-200"
        case "INVALIDATED": return "bg-red-100 text-red-800 border-red-200"
        default: return "bg-gray-100 text-gray-800 border-gray-200"
      }
    }
    if (type === 'experiment') {
      switch (status) {
        case "PLANNING": return "bg-gray-100 text-gray-800 border-gray-200"
        case "RUNNING": return "bg-blue-100 text-blue-800 border-blue-200"
        case "COMPLETED": return "bg-green-100 text-green-800 border-green-200"
        default: return "bg-gray-100 text-gray-800 border-gray-200"
      }
    }
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getStatusText = (status: string, type: 'idea' | 'hypothesis' | 'experiment') => {
    if (type === 'idea') {
      switch (status) {
        case "NEW": return "Новая"
        case "SCORED": return "ICE-оценка"
        case "SELECTED": return "Отобрана"
        default: return status
      }
    }
    if (type === 'hypothesis') {
      switch (status) {
        case "DRAFT": return "Черновик"
        case "RESEARCH": return "Desk Research"
        case "READY_FOR_TESTING": return "Готова к тестированию"
        case "IN_EXPERIMENT": return "В эксперименте"
        case "VALIDATED": return "Подтверждена"
        case "INVALIDATED": return "Опровергнута"
        default: return status
      }
    }
    if (type === 'experiment') {
      switch (status) {
        case "PLANNING": return "Планирование"
        case "RUNNING": return "Выполняется"
        case "COMPLETED": return "Завершен"
        default: return status
      }
    }
    return status
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "LEVEL_1": return { text: "L1", color: "bg-green-100 text-green-800 border-green-200" }
      case "LEVEL_2": return { text: "L2", color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
      default: return { text: level, color: "bg-gray-100 text-gray-800 border-gray-200" }
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

  const userRole = session.user.role as any
  const isReadOnlyUser = isViewer(userRole)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">InLab CRM</h1>
              <div className="text-sm text-gray-600">
                {session?.user?.name} | {getRoleDisplayName(session?.user?.role || '')}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {(session?.user?.role === 'ADMIN' || session?.user?.role === 'LAB_DIRECTOR') && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Админка
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                Выйти
              </Button>
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
            <Link href="/kanban" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600 flex items-center space-x-2">
              <span>🌊</span>
              <span>Канбан</span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isReadOnlyUser && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-amber-900 mb-2">Режим просмотра</h3>
            <p className="text-amber-800 text-sm">
              У вас есть доступ только для просмотра данных. Создание и редактирование недоступны.
            </p>
          </div>
        )}

        {/* Swimlane Title */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            🌊 Единая канбан-доска
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Полный цикл инноваций: от идеи до запуска продукта. Каждая строка показывает путь одной идеи через все этапы.
          </p>

          {/* Заголовки колонок */}
          <div className="grid grid-cols-6 gap-4 mb-4 text-xs font-medium text-gray-600 uppercase tracking-wide">
            <div>💡 Идея</div>
            <div>🔬 Гипотеза L1</div>
            <div>📚 Гипотеза L2</div>
            <div>⚗️ Эксперимент</div>
            <div>🚀 InLab</div>
            <div>🏢 М2</div>
          </div>
        </div>

        {/* Swimlanes для каждой идеи */}
        <div className="space-y-6">
          {ideas.map((idea) => (
            <div key={idea.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-6 gap-4 items-start">
                {/* Колонка 1: Идея */}
                <div className="space-y-2">
                  <Link
                    href={`/ideas/${idea.id}`}
                    className="block hover:bg-gray-50 rounded-lg p-3 border transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(idea.status, 'idea')}`}>
                        {getStatusText(idea.status, 'idea')}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm text-gray-900 mb-1">{idea.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{idea.description}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      {idea.riceScore && <span>ICE: {Math.round(idea.riceScore)}</span>}
                    </div>
                  </Link>
                </div>

                {/* Колонка 2: Гипотеза L1 */}
                <div className="space-y-2">
                  {idea.hypotheses
                    .filter(h => h.level === 'LEVEL_1')
                    .map((hypothesis) => {
                      const levelBadge = getLevelBadge(hypothesis.level)
                      return (
                        <Link
                          key={hypothesis.id}
                          href={`/hypotheses/${hypothesis.id}`}
                          className="block hover:bg-gray-50 rounded-lg p-3 border transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs border ${levelBadge.color}`}>
                              {levelBadge.text}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(hypothesis.status, 'hypothesis')}`}>
                              {getStatusText(hypothesis.status, 'hypothesis')}
                            </span>
                          </div>
                          <h4 className="font-medium text-sm text-gray-900 mb-1">{hypothesis.title}</h4>
                          <p className="text-xs text-gray-600 line-clamp-2">{hypothesis.statement}</p>
                        </Link>
                      )
                    })}
                  {idea.hypotheses.filter(h => h.level === 'LEVEL_1').length === 0 && idea.status === 'SELECTED' && canCreate(userRole) && (
                    <Link
                      href={`/hypotheses/new?ideaId=${idea.id}&level=LEVEL_1`}
                      className="block border-2 border-dashed border-gray-300 rounded-lg p-3 text-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-xs"
                    >
                      + Создать гипотезу L1
                    </Link>
                  )}
                </div>

                {/* Колонка 3: Гипотеза L2 */}
                <div className="space-y-2">
                  {idea.hypotheses
                    .filter(h => h.level === 'LEVEL_2')
                    .map((hypothesis) => {
                      const levelBadge = getLevelBadge(hypothesis.level)
                      return (
                        <Link
                          key={hypothesis.id}
                          href={`/hypotheses/${hypothesis.id}`}
                          className="block hover:bg-gray-50 rounded-lg p-3 border transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs border ${levelBadge.color}`}>
                              {levelBadge.text}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(hypothesis.status, 'hypothesis')}`}>
                              {getStatusText(hypothesis.status, 'hypothesis')}
                            </span>
                          </div>
                          <h4 className="font-medium text-sm text-gray-900 mb-1">{hypothesis.title}</h4>
                          <p className="text-xs text-gray-600 line-clamp-2">{hypothesis.statement}</p>
                        </Link>
                      )
                    })}
                  {idea.hypotheses.some(h => h.level === 'LEVEL_1' && h.status === 'READY_FOR_TESTING') &&
                   idea.hypotheses.filter(h => h.level === 'LEVEL_2').length === 0 && canCreate(userRole) && (
                    <Link
                      href={`/hypotheses/new?ideaId=${idea.id}&level=LEVEL_2`}
                      className="block border-2 border-dashed border-gray-300 rounded-lg p-3 text-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-xs"
                    >
                      + Перевести в L2
                    </Link>
                  )}
                </div>

                {/* Колонка 4: Эксперименты */}
                <div className="space-y-2">
                  {idea.hypotheses
                    .flatMap(h => h.experiments)
                    .map((experiment) => (
                      <Link
                        key={experiment.id}
                        href={`/experiments/${experiment.id}`}
                        className="block hover:bg-gray-50 rounded-lg p-3 border transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(experiment.status, 'experiment')}`}>
                            {getStatusText(experiment.status, 'experiment')}
                          </span>
                        </div>
                        <h4 className="font-medium text-sm text-gray-900 mb-1">{experiment.title}</h4>
                      </Link>
                    ))}
                  {idea.hypotheses.some(h => h.level === 'LEVEL_2' && h.status === 'READY_FOR_TESTING') &&
                   idea.hypotheses.flatMap(h => h.experiments).length === 0 && canCreate(userRole) && (
                    <Link
                      href={`/experiments/new?ideaId=${idea.id}`}
                      className="block border-2 border-dashed border-gray-300 rounded-lg p-3 text-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-xs"
                    >
                      + Создать эксперимент
                    </Link>
                  )}
                </div>

                {/* Колонка 5: InLab */}
                <div className="space-y-2">
                  {idea.hypotheses.some(h => h.status === 'VALIDATED') && (
                    <div className="rounded-lg p-3 border bg-emerald-50 border-emerald-200">
                      <div className="text-center">
                        <div className="text-2xl mb-1">🚀</div>
                        <div className="text-xs font-medium text-emerald-800">Готово к запуску</div>
                        <div className="text-xs text-emerald-600">в InLab</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Колонка 6: М2 */}
                <div className="space-y-2">
                  {idea.hypotheses.some(h => h.status === 'VALIDATED') && (
                    <div className="rounded-lg p-3 border bg-orange-50 border-orange-200">
                      <div className="text-center">
                        <div className="text-2xl mb-1">🏢</div>
                        <div className="text-xs font-medium text-orange-800">Потенциал для</div>
                        <div className="text-xs text-orange-600">продуктовой линейки</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Футер с общей информацией */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div>
                  Создано: {new Date(idea.createdAt).toLocaleDateString('ru-RU')} | Автор: {idea.creator.name}
                </div>
                <div className="flex space-x-4">
                  <span>Гипотез: {idea.hypotheses.length}</span>
                  <span>Экспериментов: {idea.hypotheses.reduce((sum, h) => sum + h.experiments.length, 0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {ideas.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🌊</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Канбан-доска пуста</h3>
            <p className="text-gray-500 mb-4">
              Создайте первую идею, чтобы увидеть весь инновационный процесс
            </p>
            {canCreate(userRole) && (
              <Link
                href="/ideas/new"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
              >
                Создать идею
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}