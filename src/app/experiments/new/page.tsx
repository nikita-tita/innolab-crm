"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import Link from "next/link"

interface Hypothesis {
  id: string
  title: string
  statement: string
  idea: {
    title: string
  }
}

function NewExperimentInner() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const hypothesisId = searchParams.get("hypothesisId")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    hypothesisId: hypothesisId || "",
    methodology: "",
    timeline: "",
    resources: "",
    successMetrics: "",
    startDate: "",
    endDate: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([])
  const [loadingHypotheses, setLoadingHypotheses] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    const fetchHypotheses = async () => {
      try {
        const response = await fetch('/api/hypotheses')
        if (response.ok) {
          const data = await response.json()
          setHypotheses(data.map((hypothesis: unknown) => {
            const h = hypothesis as {
              id: string;
              title: string;
              statement: string;
              idea: { title: string };
            };
            return {
            id: h.id,
            title: h.title,
            statement: h.statement,
            idea: {
              title: h.idea.title
            }
          }}))
        }
      } catch (error) {
        console.error('Error fetching hypotheses:', error)
      } finally {
        setLoadingHypotheses(false)
      }
    }

    if (status !== "loading") {
      fetchHypotheses()
    }
  }, [status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/experiments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/experiments")
      } else {
        const error = await response.json()
        alert(`Ошибка: ${error.error}`)
      }
    } catch (error) {
      alert("Произошла ошибка при создании эксперимента")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (status === "loading" || loadingHypotheses) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const selectedHypothesis = hypotheses.find(h => h.id === formData.hypothesisId)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
                InLab CRM
              </Link>
            </div>
            <div className="text-sm text-gray-600">
              {session.user?.name || session.user?.email}
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
            <Link href="/hypotheses" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Гипотезы
            </Link>
            <Link href="/experiments" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
              Эксперименты
            </Link>
            <Link href="/knowledge" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              База знаний
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <Link href="/experiments" className="text-gray-400 hover:text-gray-500">
                    Эксперименты
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="text-gray-400 mx-2">/</span>
                    <span className="text-gray-600">Новый эксперимент</span>
                  </div>
                </li>
              </ol>
            </nav>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Создать новый эксперимент</h1>
            <p className="mt-2 text-gray-600">
              Спланируйте эксперимент для проверки выбранной гипотезы. Определите методологию, ресурсы и критерии успеха.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div>
                <label htmlFor="hypothesisId" className="block text-sm font-medium text-gray-700 mb-2">
                  Тестируемая гипотеза *
                </label>
                <select
                  id="hypothesisId"
                  name="hypothesisId"
                  required
                  value={formData.hypothesisId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Выберите гипотезу</option>
                  {hypotheses.map((hypothesis) => (
                    <option key={hypothesis.id} value={hypothesis.id}>
                      {hypothesis.title} (Идея: {hypothesis.idea.title})
                    </option>
                  ))}
                </select>
                {selectedHypothesis && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Гипотеза:</span> {selectedHypothesis.statement}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Название эксперимента *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Краткое название эксперимента"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Описание эксперимента *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Подробное описание того, что будет делаться в рамках эксперимента..."
                />
              </div>

              <div>
                <label htmlFor="methodology" className="block text-sm font-medium text-gray-700 mb-2">
                  Методология
                </label>
                <textarea
                  id="methodology"
                  name="methodology"
                  rows={3}
                  value={formData.methodology}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="A/B тест, интервью, фокус-группы, прототипирование, анализ данных..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Дата начала
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Планируемая дата окончания
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                  Временные рамки
                </label>
                <textarea
                  id="timeline"
                  name="timeline"
                  rows={3}
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Детальный план по этапам и срокам выполнения..."
                />
              </div>

              <div>
                <label htmlFor="resources" className="block text-sm font-medium text-gray-700 mb-2">
                  Необходимые ресурсы
                </label>
                <textarea
                  id="resources"
                  name="resources"
                  rows={3}
                  value={formData.resources}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Команда, бюджет, инструменты, технологии..."
                />
              </div>

              <div>
                <label htmlFor="successMetrics" className="block text-sm font-medium text-gray-700 mb-2">
                  Метрики успеха
                </label>
                <textarea
                  id="successMetrics"
                  name="successMetrics"
                  rows={3}
                  value={formData.successMetrics}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Конкретные показатели и пороговые значения для оценки результатов..."
                />
              </div>

              {/* Help Section */}
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-green-900 mb-2">🧪 Советы по планированию эксперимента:</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Четко определите что именно вы хотите узнать</li>
                  <li>• Выберите подходящую методологию для вашего типа гипотезы</li>
                  <li>• Определите минимальный размер выборки для статистической значимости</li>
                  <li>• Подготовьте план действий для обоих исходов (подтверждение/опровержение)</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Link
                  href="/experiments"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Отмена
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.description.trim() || !formData.hypothesisId}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Создание..." : "Создать эксперимент"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function NewExperiment() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-lg">Загрузка...</div></div>}>
      <NewExperimentInner />
    </Suspense>
  )
}