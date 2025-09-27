"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import AppLayout from "@/components/layout/AppLayout"

interface HypothesisData {
  id: string
  title: string
  description?: string
  statement: string
  status: string
  priority: string
  confidenceLevel: number
  testingMethod?: string
  successCriteriaText?: string
  level: string
  deskResearchNotes?: string
  reach?: number
  impact?: number
  confidence?: number
  effort?: number
  riceScore?: number
}

export default function EditHypothesis({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [hypothesis, setHypothesis] = useState<HypothesisData | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    statement: "",
    status: "DRAFT",
    priority: "MEDIUM",
    confidenceLevel: 70,
    testingMethod: "",
    successCriteriaText: "",
    level: "LEVEL_1",
    deskResearchNotes: "",
    reach: 0,
    impact: 1,
    confidence: 50,
    effort: 1
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    const fetchHypothesis = async () => {
      try {
        const response = await fetch(`/api/hypotheses/${params.id}`)
        if (response.ok) {
          const hypothesisData = await response.json()
          setHypothesis(hypothesisData)
          setFormData({
            title: hypothesisData.title || "",
            description: hypothesisData.description || "",
            statement: hypothesisData.statement || "",
            status: hypothesisData.status || "DRAFT",
            priority: hypothesisData.priority || "MEDIUM",
            confidenceLevel: hypothesisData.confidenceLevel || 70,
            testingMethod: hypothesisData.testingMethod || "",
            successCriteriaText: hypothesisData.successCriteriaText || "",
            level: hypothesisData.level || "LEVEL_1",
            deskResearchNotes: hypothesisData.deskResearchNotes || "",
            reach: hypothesisData.reach || 0,
            impact: hypothesisData.impact || 1,
            confidence: hypothesisData.confidence || 50,
            effort: hypothesisData.effort || 1
          })
        } else {
          console.error("Ошибка при загрузке гипотезы")
          router.push("/hypotheses")
        }
      } catch (error) {
        console.error("Ошибка при загрузке гипотезы:", error)
        router.push("/hypotheses")
      } finally {
        setLoading(false)
      }
    }

    if (status !== "loading") {
      fetchHypothesis()
    }
  }, [params.id, status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/hypotheses/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push(`/hypotheses/${params.id}`)
      } else {
        const error = await response.json()
        alert(`Ошибка: ${error.error}`)
      }
    } catch (error) {
      alert("Произошла ошибка при обновлении гипотезы")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: ['confidenceLevel', 'reach', 'impact', 'confidence', 'effort'].includes(name)
        ? parseInt(value) || 0
        : value
    }))
  }

  const calculateRiceScore = () => {
    if (formData.reach && formData.impact && formData.confidence && formData.effort) {
      return (formData.reach * formData.impact * formData.confidence / 100) / formData.effort
    }
    return 0
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

  if (!session || !hypothesis) {
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
                  <Link href="/hypotheses" className="text-gray-400 hover:text-gray-500">
                    Гипотезы
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="text-gray-400 mx-2">/</span>
                    <Link href={`/hypotheses/${params.id}`} className="text-gray-400 hover:text-gray-500">
                      {hypothesis.title}
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
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Редактировать гипотезу</h1>
            <p className="mt-2 text-gray-600">
              Внесите изменения в описание гипотезы. Изменения будут сохранены сразу после отправки формы.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Название гипотезы *
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
                  Описание гипотезы
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Подробное описание гипотезы, контекст и предпосылки"
                />
              </div>

              <div>
                <label htmlFor="statement" className="block text-sm font-medium text-gray-700 mb-2">
                  Формулировка гипотезы *
                </label>
                <textarea
                  id="statement"
                  name="statement"
                  required
                  rows={6}
                  value={formData.statement}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Если [действие/изменение], то [ожидаемый результат], потому что [обоснование]"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
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
                    <option value="DRAFT">Черновик</option>
                    <option value="READY">Готова к тестированию</option>
                    <option value="TESTING">Тестируется</option>
                    <option value="VALIDATED">Подтверждена</option>
                    <option value="REJECTED">Отклонена</option>
                    <option value="ARCHIVED">Архивирована</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                    Приоритет
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="CRITICAL">Критический</option>
                    <option value="HIGH">Высокий</option>
                    <option value="MEDIUM">Средний</option>
                    <option value="LOW">Низкий</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                    Уровень гипотезы
                  </label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="LEVEL_1">Уровень 1 - Проблема/возможность</option>
                    <option value="LEVEL_2">Уровень 2 - Решение</option>
                    <option value="LEVEL_3">Уровень 3 - Реализация</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="confidenceLevel" className="block text-sm font-medium text-gray-700 mb-2">
                    Уровень уверенности: {formData.confidenceLevel}%
                  </label>
                  <input
                    type="range"
                    id="confidenceLevel"
                    name="confidenceLevel"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.confidenceLevel}
                    onChange={handleChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="testingMethod" className="block text-sm font-medium text-gray-700 mb-2">
                  Метод тестирования
                </label>
                <textarea
                  id="testingMethod"
                  name="testingMethod"
                  rows={3}
                  value={formData.testingMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Как будет тестироваться гипотеза? Какие эксперименты планируются?"
                />
              </div>

              <div>
                <label htmlFor="successCriteriaText" className="block text-sm font-medium text-gray-700 mb-2">
                  Критерии успеха
                </label>
                <textarea
                  id="successCriteriaText"
                  name="successCriteriaText"
                  rows={4}
                  value={formData.successCriteriaText}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Какие результаты будут считаться успешными? Какие метрики и пороговые значения?"
                />
              </div>

              <div>
                <label htmlFor="deskResearchNotes" className="block text-sm font-medium text-gray-700 mb-2">
                  Результаты Desk Research
                </label>
                <textarea
                  id="deskResearchNotes"
                  name="deskResearchNotes"
                  rows={5}
                  value={formData.deskResearchNotes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="Результаты кабинетного исследования, ключевые выводы и ссылки на источники...

Примеры:
• Основные выводы исследования
• Статистика и данные
• Ссылки на источники: https://example.com
• Анализ конкурентов"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Совет: Добавляйте прямые ссылки на источники - они станут кликабельными при просмотре
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-medium text-purple-900 mb-4">📊 RICE оценка эксперимента</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <label htmlFor="reach" className="block text-sm font-medium text-gray-700">
                      Охват (Reach)
                    </label>
                    <input
                      type="number"
                      id="reach"
                      name="reach"
                      min="0"
                      value={formData.reach}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Количество участников"
                    />
                    <p className="text-xs text-gray-500">Кол-во участников эксперимента</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="impact" className="block text-sm font-medium text-gray-700">
                      Влияние (Impact)
                    </label>
                    <select
                      id="impact"
                      name="impact"
                      value={formData.impact}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={1}>1 - Минимальное</option>
                      <option value={2}>2 - Низкое</option>
                      <option value={3}>3 - Среднее</option>
                      <option value={4}>4 - Высокое</option>
                      <option value={5}>5 - Максимальное</option>
                    </select>
                    <p className="text-xs text-gray-500">Влияние при подтверждении</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confidence" className="block text-sm font-medium text-gray-700">
                      Уверенность: {formData.confidence}%
                    </label>
                    <input
                      type="range"
                      id="confidence"
                      name="confidence"
                      min="0"
                      max="100"
                      step="5"
                      value={formData.confidence}
                      onChange={handleChange}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="effort" className="block text-sm font-medium text-gray-700">
                      Затраты (Effort)
                    </label>
                    <input
                      type="number"
                      id="effort"
                      name="effort"
                      min="1"
                      value={formData.effort}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Человеко-дни"
                    />
                    <p className="text-xs text-gray-500">Затраты на эксперимент</p>
                  </div>
                </div>

                {calculateRiceScore() > 0 && (
                  <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900">RICE Score:</span>
                      <span className="text-lg font-bold text-blue-600">
                        {Math.round(calculateRiceScore())}
                      </span>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">
                      ({formData.reach} × {formData.impact} × {formData.confidence}%) ÷ {formData.effort}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-amber-900 mb-2">⚠️ Важно:</h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Изменения в формулировке гипотезы могут повлиять на связанные эксперименты</li>
                  <li>• После значительных изменений рекомендуется пересмотреть критерии успеха</li>
                  <li>• Если гипотеза уже проходит тестирование, будьте осторожны с изменениями</li>
                  <li>• Вы можете очистить любое поле, оставив его пустым (кроме обязательных)</li>
                  <li>• RICE оценка поможет приоритизировать эксперименты для тестирования гипотезы</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-4">
                <Link
                  href={`/hypotheses/${params.id}`}
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