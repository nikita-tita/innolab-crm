"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function NewIdea() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM",
    context: "",
    reach: 0,
    impact: 1,
    confidence: 50,
    effort: 1
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/ideas")
      } else {
        const error = await response.json()
        alert(`Ошибка: ${error.error}`)
      }
    } catch (error) {
      alert("Произошла ошибка при создании идеи")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const processedValue = ['reach', 'impact', 'confidence', 'effort'].includes(name) ?
      parseInt(value) || 0 : value
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
  }

  const calculateRiceScore = () => {
    const { reach, impact, confidence, effort } = formData
    if (reach > 0 && impact > 0 && confidence > 0 && effort > 0) {
      return Math.round((reach * impact * confidence) / effort)
    }
    return 0
  }

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
                InnoLab CRM
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
            <Link href="/ideas" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
              Идеи
            </Link>
            <Link href="/hypotheses" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Гипотезы
            </Link>
            <Link href="/experiments" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Эксперименты
            </Link>
            <Link href="/knowledge" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              База знаний
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <Link href="/ideas" className="text-gray-400 hover:text-gray-500">
                    Идеи
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="text-gray-400 mx-2">/</span>
                    <span className="text-gray-600">Новая идея</span>
                  </div>
                </li>
              </ol>
            </nav>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Создать новую идею</h1>
            <p className="mt-2 text-gray-600">
              Опишите вашу инновационную идею. Она может стать основой для будущих гипотез и экспериментов.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Название идеи *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Краткое и понятное название идеи"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Описание идеи *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Подробно опишите идею: какую проблему она решает, каково предлагаемое решение, какая ожидается ценность..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Хорошее описание включает: проблему, решение, целевую аудиторию и ожидаемые результаты
                </p>
              </div>

              <div>
                <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
                  Контекст возникновения идеи
                </label>
                <textarea
                  id="context"
                  name="context"
                  rows={3}
                  value={formData.context}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Какие обстоятельства привели к появлению этой идеи? Какие данные или наблюдения послужили основанием?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Категория
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Например: UX/UI, Аналитика, Автоматизация"
                  />
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
                    <option value="LOW">Низкий</option>
                    <option value="MEDIUM">Средний</option>
                    <option value="HIGH">Высокий</option>
                    <option value="CRITICAL">Критический</option>
                  </select>
                </div>
              </div>

              {/* RICE Scoring Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">RICE-приоритизация</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Оцените идею по методологии RICE для определения приоритета
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label htmlFor="reach" className="block text-sm font-medium text-gray-700 mb-2">
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
                      placeholder="1000"
                    />
                    <p className="mt-1 text-xs text-gray-500">Количество людей/событий в месяц</p>
                  </div>

                  <div>
                    <label htmlFor="impact" className="block text-sm font-medium text-gray-700 mb-2">
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
                    <p className="mt-1 text-xs text-gray-500">Сила воздействия на пользователя</p>
                  </div>

                  <div>
                    <label htmlFor="confidence" className="block text-sm font-medium text-gray-700 mb-2">
                      Уверенность (Confidence)
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        id="confidence"
                        name="confidence"
                        min="10"
                        max="100"
                        step="10"
                        value={formData.confidence}
                        onChange={handleChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-center mt-1">
                        <span className="text-sm font-medium text-gray-700">{formData.confidence}%</span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Уверенность в оценках</p>
                  </div>

                  <div>
                    <label htmlFor="effort" className="block text-sm font-medium text-gray-700 mb-2">
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
                      placeholder="5"
                    />
                    <p className="mt-1 text-xs text-gray-500">Человеко-дни для реализации</p>
                  </div>
                </div>

                {/* RICE Score Display */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">RICE Score</h4>
                      <p className="text-xs text-blue-700">({formData.reach} × {formData.impact} × {formData.confidence}%) ÷ {formData.effort}</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
                      {calculateRiceScore()}
                    </div>
                  </div>
                  {calculateRiceScore() > 0 && (
                    <div className="mt-2 text-xs text-blue-700">
                      {calculateRiceScore() >= 100 && "🟢 Высокий приоритет"}
                      {calculateRiceScore() >= 50 && calculateRiceScore() < 100 && "🟡 Средний приоритет"}
                      {calculateRiceScore() < 50 && "🔴 Низкий приоритет"}
                    </div>
                  )}
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Советы по формулированию идеи:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Четко определите проблему, которую решает ваша идея</li>
                  <li>• Опишите целевую аудиторию и ее потребности</li>
                  <li>• Укажите ожидаемые результаты и метрики успеха</li>
                  <li>• Рассмотрите возможные риски и ограничения</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Link
                  href="/ideas"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Отмена
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Создание..." : "Создать идею"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}