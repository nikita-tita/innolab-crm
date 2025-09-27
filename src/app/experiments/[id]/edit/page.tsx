"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import AppLayout from "@/components/layout/AppLayout"

interface ExperimentData {
  id: string
  title: string
  description: string
  type: string
  status: string
  startDate?: string
  endDate?: string
  actualStartDate?: string
  actualEndDate?: string
  methodology?: string
  timeline?: string
  resources?: string
  successMetrics?: string
}

export default function EditExperiment({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [experiment, setExperiment] = useState<ExperimentData | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "OTHER",
    status: "PLANNING",
    startDate: "",
    endDate: "",
    actualStartDate: "",
    actualEndDate: "",
    methodology: "",
    timeline: "",
    resources: "",
    successMetrics: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    const fetchExperiment = async () => {
      try {
        const response = await fetch(`/api/experiments/${params.id}`)
        if (response.ok) {
          const experimentData = await response.json()
          setExperiment(experimentData)
          setFormData({
            title: experimentData.title || "",
            description: experimentData.description || "",
            type: experimentData.type || "OTHER",
            status: experimentData.status || "PLANNING",
            startDate: experimentData.startDate ? experimentData.startDate.split('T')[0] : "",
            endDate: experimentData.endDate ? experimentData.endDate.split('T')[0] : "",
            actualStartDate: experimentData.actualStartDate ? experimentData.actualStartDate.split('T')[0] : "",
            actualEndDate: experimentData.actualEndDate ? experimentData.actualEndDate.split('T')[0] : "",
            methodology: experimentData.methodology || "",
            timeline: experimentData.timeline || "",
            resources: experimentData.resources || "",
            successMetrics: experimentData.successMetrics || ""
          })
        } else {
          console.error("Ошибка при загрузке эксперимента")
          router.push("/experiments")
        }
      } catch (error) {
        console.error("Ошибка при загрузке эксперимента:", error)
        router.push("/experiments")
      } finally {
        setLoading(false)
      }
    }

    if (status !== "loading") {
      fetchExperiment()
    }
  }, [params.id, status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/experiments/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push(`/experiments/${params.id}`)
      } else {
        const error = await response.json()
        alert(`Ошибка: ${error.error}`)
      }
    } catch (error) {
      alert("Произошла ошибка при обновлении эксперимента")
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

  if (status === "loading" || loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Загрузка...</div>
        </div>
      </AppLayout>
    )
  }

  if (!session || !experiment) {
    return null
  }

  return (
    <AppLayout>
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
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
                    <Link href={`/experiments/${params.id}`} className="text-gray-400 hover:text-gray-500">
                      {experiment.title}
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="text-gray-400 mx-2">/</span>
                    <span className="text-gray-600">Редактирование</span>
                  </div>
                </li>
              </ol>
            </nav>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Редактировать эксперимент</h1>
            <p className="mt-2 text-gray-600">
              Внесите изменения в описание эксперимента. Изменения будут сохранены сразу после отправки формы.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
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
                  placeholder="Краткое и понятное название"
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
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Подробно опишите что будет тестироваться, как и зачем..."
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Тип эксперимента
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="A_B_TEST">A/B тест</option>
                    <option value="PROTOTYPE">Прототип</option>
                    <option value="SURVEY">Опрос</option>
                    <option value="INTERVIEW">Интервью</option>
                    <option value="LANDING_PAGE">Лендинг</option>
                    <option value="ANALYTICS">Аналитика</option>
                    <option value="OTHER">Другое</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Статус
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="PLANNING">Планирование</option>
                    <option value="IN_PROGRESS">Выполняется</option>
                    <option value="COMPLETED">Завершен</option>
                    <option value="PAUSED">Приостановлен</option>
                    <option value="CANCELLED">Отменен</option>
                    <option value="ARCHIVED">Архивирован</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-medium text-blue-900 mb-4">📅 Временные рамки</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Планируемое начало
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
                      Планируемое окончание
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

                  <div>
                    <label htmlFor="actualStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Фактическое начало
                    </label>
                    <input
                      type="date"
                      id="actualStartDate"
                      name="actualStartDate"
                      value={formData.actualStartDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="actualEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Фактическое окончание
                    </label>
                    <input
                      type="date"
                      id="actualEndDate"
                      name="actualEndDate"
                      value={formData.actualEndDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="methodology" className="block text-sm font-medium text-gray-700 mb-2">
                  Методология проведения
                </label>
                <textarea
                  id="methodology"
                  name="methodology"
                  rows={4}
                  value={formData.methodology}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Как будет проводиться эксперимент? Какие инструменты и подходы будут использованы?"
                />
              </div>

              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                  План выполнения
                </label>
                <textarea
                  id="timeline"
                  name="timeline"
                  rows={3}
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Основные этапы и временные рамки выполнения"
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
                  placeholder="Какие ресурсы потребуются: время, бюджет, инструменты, люди..."
                />
              </div>

              <div>
                <label htmlFor="successMetrics" className="block text-sm font-medium text-gray-700 mb-2">
                  Метрики успеха
                </label>
                <textarea
                  id="successMetrics"
                  name="successMetrics"
                  rows={4}
                  value={formData.successMetrics}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Какие показатели будут измеряться? Какие значения будут считаться успешными?"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-amber-900 mb-2">⚠️ Важно:</h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Изменения в эксперименте могут повлиять на валидность результатов</li>
                  <li>• Если эксперимент уже запущен, будьте осторожны с изменениями методологии</li>
                  <li>• Обновление дат поможет отслеживать фактическое выполнение</li>
                  <li>• Вы можете очистить любое поле, оставив его пустым (кроме обязательных)</li>
                  <li>• Четкие метрики успеха помогут правильно интерпретировать результаты</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-4">
                <Link
                  href={`/experiments/${params.id}`}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Отмена
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}