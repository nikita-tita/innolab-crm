"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { isViewer } from "@/lib/permissions"
import { Badge } from "@/components/ui/badge"
import AppLayout from "@/components/layout/AppLayout"

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
  confidenceLevel: number
  createdAt: string
  experiments: Experiment[]
}

interface Experiment {
  id: string
  title: string
  status: string
  type: string
  createdAt: string
  mvps?: MVP[]
}

interface MVP {
  id: string
  title: string
  status: string
  type: string
}

// Колонки канбан-доски
const BOARD_COLUMNS = [
  { id: 'ideas', title: '💡 Идеи', subtitle: 'Банк идей' },
  { id: 'hypothesis_l1', title: '🔬 Гипотеза L1', subtitle: 'Базовая формулировка' },
  { id: 'hypothesis_l2', title: '📚 Гипотеза L2', subtitle: 'После исследования' },
  { id: 'experiment', title: '⚗️ Эксперимент', subtitle: 'Тестирование' },
  { id: 'inlab', title: '🚀 InLab', subtitle: 'Готово к запуску' },
  { id: 'm2', title: '🏢 М2', subtitle: 'Продуктовая линейка' },
]

export default function KanbanPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [draggedItem, setDraggedItem] = useState<{
    type: string
    id: string
    sourceColumn: string
  } | null>(null)
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)

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
          setIdeas(data.data || data)
        } else if (response.status === 401) {
          router.push("/")
          return
        } else {
          console.error('Error fetching ideas:', response.status)
        }
      } catch (error) {
        console.error('Error fetching workflow data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchData()
    } else if (status !== "loading") {
      setLoading(false)
    }
  }, [status, router])

  const getStatusColor = (status: string, type: 'idea' | 'hypothesis' | 'experiment') => {
    if (type === 'idea') {
      switch (status) {
        case "NEW": return "bg-blue-50 text-blue-700 border-blue-200"
        case "SCORED": return "bg-purple-50 text-purple-700 border-purple-200"
        case "SELECTED": return "bg-green-50 text-green-700 border-green-200"
        case "IN_HYPOTHESIS": return "bg-yellow-50 text-yellow-700 border-yellow-200"
        case "COMPLETED": return "bg-emerald-50 text-emerald-700 border-emerald-200"
        default: return "bg-gray-50 text-gray-700 border-gray-200"
      }
    }
    if (type === 'hypothesis') {
      switch (status) {
        case "DRAFT": return "bg-yellow-50 text-yellow-700 border-yellow-200"
        case "RESEARCH": return "bg-purple-50 text-purple-700 border-purple-200"
        case "READY_FOR_TESTING": return "bg-blue-50 text-blue-700 border-blue-200"
        case "IN_EXPERIMENT": return "bg-orange-50 text-orange-700 border-orange-200"
        case "VALIDATED": return "bg-green-50 text-green-700 border-green-200"
        case "INVALIDATED": return "bg-red-50 text-red-700 border-red-200"
        default: return "bg-gray-50 text-gray-700 border-gray-200"
      }
    }
    if (type === 'experiment') {
      switch (status) {
        case "PLANNING": return "bg-gray-50 text-gray-700 border-gray-200"
        case "RUNNING": return "bg-blue-50 text-blue-700 border-blue-200"
        case "COMPLETED": return "bg-green-50 text-green-700 border-green-200"
        case "PAUSED": return "bg-yellow-50 text-yellow-700 border-yellow-200"
        default: return "bg-gray-50 text-gray-700 border-gray-200"
      }
    }
    return "bg-gray-50 text-gray-700 border-gray-200"
  }

  const getStatusText = (status: string, type: 'idea' | 'hypothesis' | 'experiment') => {
    if (type === 'idea') {
      switch (status) {
        case "NEW": return "Новая"
        case "SCORED": return "ICE-оценка"
        case "SELECTED": return "Отобрана"
        case "IN_HYPOTHESIS": return "Проработка"
        case "COMPLETED": return "Готова"
        default: return status
      }
    }
    if (type === 'hypothesis') {
      switch (status) {
        case "DRAFT": return "Черновик"
        case "RESEARCH": return "Исследование"
        case "READY_FOR_TESTING": return "К тестированию"
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
        case "PAUSED": return "Пауза"
        default: return status
      }
    }
    return status
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL": return "bg-red-100 text-red-800 border-red-200"
      case "HIGH": return "bg-orange-100 text-orange-800 border-orange-200"
      case "MEDIUM": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "LOW": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "LEVEL_1": return { text: "L1", color: "bg-green-100 text-green-800 border-green-200" }
      case "LEVEL_2": return { text: "L2", color: "bg-blue-100 text-blue-800 border-blue-200" }
      default: return { text: level, color: "bg-gray-100 text-gray-800 border-gray-200" }
    }
  }

  const getColumnItems = (columnId: string, idea: Idea) => {
    switch (columnId) {
      case 'ideas':
        return [{ type: 'idea', data: idea }]
      case 'hypothesis_l1':
        return idea.hypotheses
          .filter(h => h.level === 'LEVEL_1')
          .map(h => ({ type: 'hypothesis', data: h }))
      case 'hypothesis_l2':
        return idea.hypotheses
          .filter(h => h.level === 'LEVEL_2')
          .map(h => ({ type: 'hypothesis', data: h }))
      case 'experiment':
        return idea.hypotheses
          .flatMap(h => h.experiments)
          .map(e => ({ type: 'experiment', data: e }))
      case 'inlab':
        return idea.hypotheses.some(h => h.status === 'VALIDATED')
          ? [{ type: 'result', data: { status: 'validated', idea } }]
          : []
      case 'm2':
        return idea.hypotheses.some(h => h.status === 'VALIDATED')
          ? [{ type: 'result', data: { status: 'product_ready', idea } }]
          : []
      default:
        return []
    }
  }

  const handleDragStart = (e: React.DragEvent, type: string, id: string, sourceColumn: string) => {
    setDraggedItem({ type, id, sourceColumn })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (columnId: string) => {
    setHoveredColumn(columnId)
  }

  const handleDragLeave = () => {
    setHoveredColumn(null)
  }

  const handleDrop = async (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault()
    setHoveredColumn(null)

    if (!draggedItem) return

    console.log(`Moving ${draggedItem.type} ${draggedItem.id} from ${draggedItem.sourceColumn} to ${targetColumn}`)

    // Здесь можно добавить логику обновления статуса через API
    // await updateItemStatus(draggedItem.type, draggedItem.id, targetColumn)

    setDraggedItem(null)
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
    <AppLayout>
      <div className="p-6">
        {isReadOnlyUser && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 max-w-7xl mx-auto">
            <h3 className="font-medium text-amber-900 mb-2">Режим просмотра</h3>
            <p className="text-amber-800 text-sm">
              У вас есть доступ только для просмотра данных. Создание и редактирование недоступны.
            </p>
          </div>
        )}

        {/* Заголовки колонок */}
        <div className="grid grid-cols-6 gap-4 mb-6 max-w-full mx-auto">
          {BOARD_COLUMNS.map((column) => (
            <div
              key={column.id}
              className={`bg-white/70 backdrop-blur-sm rounded-lg p-4 border-2 transition-all duration-200 ${
                hoveredColumn === column.id
                  ? 'border-blue-400 bg-blue-50/50'
                  : 'border-gray-200'
              }`}
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter(column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <h3 className="font-bold text-sm text-gray-900 mb-1">{column.title}</h3>
              <p className="text-xs text-gray-600">{column.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Swimlanes для каждой идеи */}
        <div className="space-y-4 max-w-full mx-auto">
          {ideas.map((idea) => (
            <div key={idea.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="grid grid-cols-6 gap-4 items-start min-h-[120px]">
                {BOARD_COLUMNS.map((column) => {
                  const columnItems = getColumnItems(column.id, idea)

                  return (
                    <div key={`${idea.id}-${column.id}`} className="space-y-2">
                      {columnItems.map((item, index) => {
                        if (item.type === 'idea') {
                          const ideaData = item.data as Idea
                          return (
                            <div
                              key={ideaData.id}
                              draggable={!isReadOnlyUser}
                              onDragStart={(e) => handleDragStart(e, 'idea', ideaData.id, column.id)}
                              className="group bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(ideaData.status, 'idea')}`}>
                                  {getStatusText(ideaData.status, 'idea')}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(ideaData.priority)}`}>
                                  {ideaData.priority}
                                </span>
                              </div>
                              <Link href={`/ideas/${ideaData.id}`} className="block">
                                <h4 className="font-medium text-sm text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                  {ideaData.title}
                                </h4>
                                <p className="text-xs text-gray-600 line-clamp-2">{ideaData.description}</p>
                                {ideaData.riceScore && (
                                  <div className="text-xs text-blue-600 font-medium mt-1">
                                    RICE: {Math.round(ideaData.riceScore)}
                                  </div>
                                )}
                              </Link>
                            </div>
                          )
                        } else if (item.type === 'hypothesis') {
                          const hypothesisData = item.data as Hypothesis
                          const levelBadge = getLevelBadge(hypothesisData.level)
                          return (
                            <div
                              key={hypothesisData.id}
                              draggable={!isReadOnlyUser}
                              onDragStart={(e) => handleDragStart(e, 'hypothesis', hypothesisData.id, column.id)}
                              className="group bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs border ${levelBadge.color}`}>
                                  {levelBadge.text}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(hypothesisData.status, 'hypothesis')}`}>
                                  {getStatusText(hypothesisData.status, 'hypothesis')}
                                </span>
                              </div>
                              <Link href={`/hypotheses/${hypothesisData.id}`} className="block">
                                <h4 className="font-medium text-sm text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                  {hypothesisData.title}
                                </h4>
                                <p className="text-xs text-gray-600 line-clamp-2">{hypothesisData.statement}</p>
                                <div className="text-xs text-gray-500 mt-1">
                                  Уверенность: {hypothesisData.confidenceLevel}%
                                </div>
                              </Link>
                            </div>
                          )
                        } else if (item.type === 'experiment') {
                          const experimentData = item.data as Experiment
                          return (
                            <div
                              key={experimentData.id}
                              draggable={!isReadOnlyUser}
                              onDragStart={(e) => handleDragStart(e, 'experiment', experimentData.id, column.id)}
                              className="group bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(experimentData.status, 'experiment')}`}>
                                  {getStatusText(experimentData.status, 'experiment')}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {experimentData.type}
                                </span>
                              </div>
                              <Link href={`/experiments/${experimentData.id}`} className="block">
                                <h4 className="font-medium text-sm text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                  {experimentData.title}
                                </h4>
                              </Link>
                            </div>
                          )
                        } else if (item.type === 'result') {
                          const resultData = item.data as any
                          if (resultData.status === 'validated') {
                            return (
                              <div key={`result-inlab-${idea.id}`} className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-3 border-2 border-emerald-200">
                                <div className="text-center">
                                  <div className="text-2xl mb-1">🚀</div>
                                  <div className="text-xs font-medium text-emerald-800">Готово к запуску</div>
                                  <div className="text-xs text-emerald-600">в InLab</div>
                                </div>
                              </div>
                            )
                          } else if (resultData.status === 'product_ready') {
                            return (
                              <div key={`result-m2-${idea.id}`} className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-3 border-2 border-orange-200">
                                <div className="text-center">
                                  <div className="text-2xl mb-1">🏢</div>
                                  <div className="text-xs font-medium text-orange-800">Потенциал для</div>
                                  <div className="text-xs text-orange-600">продуктовой линейки</div>
                                </div>
                              </div>
                            )
                          }
                        }

                        // Показать кнопки создания для пустых колонок
                        return null
                      })}

                      {/* Кнопки создания для пустых колонок */}
                      {columnItems.length === 0 && canCreate(userRole) && (
                        <>
                          {column.id === 'hypothesis_l1' && idea.status === 'SELECTED' && (
                            <Link
                              href={`/hypotheses/new?ideaId=${idea.id}&level=LEVEL_1`}
                              className="block border-2 border-dashed border-gray-300 rounded-lg p-3 text-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-xs"
                            >
                              + Создать гипотезу L1
                            </Link>
                          )}
                          {column.id === 'hypothesis_l2' && idea.hypotheses.some(h => h.level === 'LEVEL_1' && h.status === 'RESEARCH') && (
                            <Link
                              href={`/hypotheses/new?ideaId=${idea.id}&level=LEVEL_2`}
                              className="block border-2 border-dashed border-gray-300 rounded-lg p-3 text-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-xs"
                            >
                              + Перевести в L2
                            </Link>
                          )}
                          {column.id === 'experiment' && idea.hypotheses.some(h => h.level === 'LEVEL_2' && h.status === 'READY_FOR_TESTING') && (
                            <Link
                              href={`/experiments/new?ideaId=${idea.id}`}
                              className="block border-2 border-dashed border-gray-300 rounded-lg p-3 text-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-xs"
                            >
                              + Создать эксперимент
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Футер строки с информацией об идее */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>📅 {new Date(idea.createdAt).toLocaleDateString('ru-RU')}</span>
                  <span>👤 {idea.creator.name}</span>
                  <span>🏷️ {idea.category}</span>
                </div>
                <div className="flex space-x-4">
                  <span>🔬 Гипотез: {idea.hypotheses.length}</span>
                  <span>⚗️ Экспериментов: {idea.hypotheses.reduce((sum, h) => sum + h.experiments.length, 0)}</span>
                  <Link href={`/ideas/${idea.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    Подробнее →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {ideas.length === 0 && (
          <div className="text-center py-12 max-w-2xl mx-auto">
            <span className="text-6xl mb-4 block">🌊</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Канбан-доска пуста</h3>
            <p className="text-gray-500 mb-4">
              Создайте первую идею, чтобы увидеть весь инновационный процесс на канбан-доске
            </p>
            {canCreate(userRole) && (
              <Link
                href="/ideas/new"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-md hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Создать идею
              </Link>
            )}
          </div>
        )}

        {/* Help Hint */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Нужна помощь? Нажмите кнопку <strong>?</strong> в правом верхнем углу для подробной справки
        </div>
      </div>
    </AppLayout>
  )
}