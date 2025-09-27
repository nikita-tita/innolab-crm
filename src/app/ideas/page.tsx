"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import ExportButton from "@/components/ui/ExportButton"
import AppLayout from "@/components/layout/AppLayout"
import { canEdit, canDelete, canCreate } from "@/lib/permissions"
import { Edit2, Trash2 } from "lucide-react"
import QuickActions, { QuickICEModal } from "@/components/ui/QuickActions"
import { Breadcrumbs, breadcrumbPatterns } from "@/components/ui/Breadcrumbs"

interface Idea {
  id: string
  title: string
  description: string
  category: string
  status: string
  priority: string
  reach?: number
  impact?: number
  confidence?: number
  effort?: number
  riceScore?: number
  context?: string
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
  const [view, setView] = useState<'cards' | 'create'>('cards')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [iceModalOpen, setIceModalOpen] = useState(false)
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        console.log('🔄 Fetching ideas...')
        const response = await fetch('/api/ideas')
        console.log('📡 Ideas API response status:', response.status)

        if (response.ok) {
          const data = await response.json()
          console.log('📊 Ideas API response data:', data)
          console.log('💡 Ideas count:', data.data?.length || data.length || 0)
          setIdeas(data.data || data)
        } else {
          console.error('❌ Failed to fetch ideas:', response.status)
          const errorText = await response.text()
          console.error('❌ Error details:', errorText)
        }
      } catch (error) {
        console.error('💥 Error fetching ideas:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status !== "loading") {
      fetchIdeas()
    }
  }, [status])

  const handleDeleteIdea = async (ideaId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту идею? Это действие необратимо.')) {
      return
    }

    setDeletingId(ideaId)

    try {
      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setIdeas(prev => prev.filter(idea => idea.id !== ideaId))
      } else {
        console.error('Ошибка при удалении идеи')
        alert('Ошибка при удалении идеи')
      }
    } catch (error) {
      console.error('Ошибка при удалении идеи:', error)
      alert('Ошибка при удалении идеи')
    } finally {
      setDeletingId(null)
    }
  }

  const handleICESubmit = async (scores: { impact: number; confidence: number; ease: number }) => {
    if (!selectedIdeaId) return

    try {
      const response = await fetch(`/api/ideas/${selectedIdeaId}/ice-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scores),
      })

      if (response.ok) {
        // Refresh the ideas list to show updated status
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`Ошибка: ${error.error}`)
      }
    } catch (error) {
      console.error("Error submitting ICE score:", error)
      alert("Произошла ошибка при отправке оценки")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW": return "bg-blue-100 text-blue-800"
      case "SCORED": return "bg-purple-100 text-purple-800"
      case "SELECTED": return "bg-green-100 text-green-800"
      case "IN_HYPOTHESIS": return "bg-yellow-100 text-yellow-800"
      case "COMPLETED": return "bg-emerald-100 text-emerald-800"
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
      case "SCORED": return "RICE-оценка"
      case "SELECTED": return "Отобрана"
      case "IN_HYPOTHESIS": return "Проработка"
      case "COMPLETED": return "Готова"
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
    <AppLayout>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Breadcrumbs items={breadcrumbPatterns.ideas.list()} />
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">💡 Идеи</h1>
            <div className="flex space-x-4">
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
                {canCreate(session?.user?.role as any) && (
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
                )}
              </div>
              {view === 'cards' && (
                <>
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
                </>
              )}
            </div>
          </div>

          {/* Content based on view */}
          {view === 'create' && canCreate(session?.user?.role as any) ? (
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                💡 Создание новой идеи
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Опишите вашу идею для оценки и проработки командой
              </p>
              <div className="text-center">
                <Link
                  href="/ideas/new"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors inline-block"
                >
                  Перейти к форме создания
                </Link>
              </div>
              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h3 className="font-medium text-blue-900 mb-3">💡 Что такое хорошая идея?</h3>
                <ul className="text-blue-800 text-sm space-y-2">
                  <li>• Четко описывает проблему или возможность</li>
                  <li>• Предлагает конкретное решение</li>
                  <li>• Имеет потенциал для создания ценности</li>
                  <li>• Может быть проверена экспериментально</li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              {/* Info Section */}
              {ideas.length === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h2 className="text-lg font-semibold text-blue-900 mb-2">🚀 Начните с создания первой идеи!</h2>
                  <p className="text-blue-800 mb-4">
                    Идеи — это отправная точка инновационного процесса. Здесь команда собирает и оценивает предложения
                    по улучшению продуктов и созданию новых решений.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <h3 className="font-medium text-blue-900 mb-1">1. Создание</h3>
                      <p className="text-blue-800">Опишите идею в свободной форме</p>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-3">
                      <h3 className="font-medium text-blue-900 mb-1">2. Оценка ICE</h3>
                      <p className="text-blue-800">Команда оценивает Impact, Confidence, Ease</p>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-3">
                      <h3 className="font-medium text-blue-900 mb-1">3. Приоритизация</h3>
                      <p className="text-blue-800">Лучшие идеи становятся гипотезами</p>
                    </div>
                  </div>
                </div>
              )}

              {ideas.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-green-900">
                        📊 Всего идей: {ideas.length}
                      </h3>
                      <p className="text-xs text-green-700 mt-1">
                        Посмотрите весь процесс развития идей на канбан-доске или нажмите на карточку для детального просмотра
                      </p>
                    </div>
                    <Link
                      href="/ideas/new"
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                    >
                      + Добавить еще
                    </Link>
                  </div>
                </div>
              )}

              {/* Ideas Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ideas
                  .sort((a, b) => {
                    // Sort by RICE score first (descending), then by creation date
                    if (a.riceScore && b.riceScore) {
                      return b.riceScore - a.riceScore
                    }
                    if (a.riceScore && !b.riceScore) return -1
                    if (!a.riceScore && b.riceScore) return 1
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  })
                  .map((idea) => (
                  <div key={idea.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
                        {idea.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(idea.status)}`}>
                          {getStatusText(idea.status)}
                        </span>
                        <QuickActions
                          ideaId={idea.id}
                          userRole={session?.user?.role}
                          onICEScore={() => {
                            setSelectedIdeaId(idea.id)
                            setIceModalOpen(true)
                          }}
                        />
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {idea.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">{idea.category || 'Без категории'}</span>
                        <span className={`px-2 py-1 rounded ${getPriorityColor(idea.priority)}`}>
                          {getPriorityText(idea.priority)}
                        </span>
                      </div>

                      {/* RICE Score Display */}
                      {idea.riceScore && (
                        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 rounded-md">
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">RICE Score:</span>
                            <div className="text-xs text-gray-500">
                              {idea.reach} × {idea.impact} × {idea.confidence}% ÷ {idea.effort}
                            </div>
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            {Math.round(idea.riceScore)}
                          </div>
                        </div>
                      )}
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

                      {/* Edit and Delete buttons for non-VIEWER roles */}
                      {session?.user?.role && (canEdit(session.user.role) || canDelete(session.user.role)) && (
                        <div className="flex justify-end space-x-2 mt-3 pt-3 border-t border-gray-100">
                          {canEdit(session.user.role) && (
                            <Link
                              href={`/ideas/${idea.id}/edit`}
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <Edit2 className="h-3 w-3" />
                              <span>Редактировать</span>
                            </Link>
                          )}
                          {canDelete(session.user.role) && (
                            <button
                              onClick={() => handleDeleteIdea(idea.id)}
                              disabled={deletingId === idea.id}
                              className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                            >
                              {deletingId === idea.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                                  <span>Удаление...</span>
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-3 w-3" />
                                  <span>Удалить</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

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

      <QuickICEModal
        ideaId={selectedIdeaId || ""}
        isOpen={iceModalOpen}
        onClose={() => {
          setIceModalOpen(false)
          setSelectedIdeaId(null)
        }}
        onSubmit={handleICESubmit}
      />
    </AppLayout>
  )
}