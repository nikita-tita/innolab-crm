"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAutosave, AutosaveIndicator } from "@/hooks/useAutosave"
import { Breadcrumbs, breadcrumbPatterns } from "@/components/ui/Breadcrumbs"

export default function NewIdea() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    context: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const { loadSaved, clearSaved, hasSaved } = useAutosave({
    key: "new-idea-form",
    data: formData,
    onSave: () => setLastSaved(new Date()),
    enabled: !isSubmitting
  })

  // Load saved data on mount
  useEffect(() => {
    if (status === "authenticated" && hasSaved()) {
      const saved = loadSaved()
      if (saved) {
        setFormData(saved)
      }
    }
  }, [status, loadSaved, hasSaved])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
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
        clearSaved() // Clear autosaved data on successful submission
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>
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
            <Link href="/ideas" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
              Идеи
            </Link>
            <Link href="/hypotheses" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Гипотезы
            </Link>
            <Link href="/experiments" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Эксперименты
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbPatterns.ideas.new()} />
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Создать новую идею</h1>
              <AutosaveIndicator lastSaved={lastSaved} />
            </div>
            <p className="mt-2 text-gray-600">
              Опишите вашу инновационную идею. После создания команда сможет оценить ее по методологии ICE.
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
                  placeholder="Краткое и понятное название"
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
                  placeholder="Подробно опишите вашу идею: что именно предлагается сделать, какую проблему это решает, кто будет пользоваться..."
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Категория
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Выберите категорию</option>
                  <option value="UX_UI">UX/UI</option>
                  <option value="ANALYTICS">Аналитика</option>
                  <option value="AUTOMATION">Автоматизация</option>
                  <option value="PRODUCT">Продукт</option>
                  <option value="MARKETING">Маркетинг</option>
                  <option value="SALES">Продажи</option>
                  <option value="OPERATIONS">Операции</option>
                  <option value="OTHER">Другое</option>
                </select>
              </div>

              <div>
                <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
                  Контекст и обоснование
                </label>
                <textarea
                  id="context"
                  name="context"
                  rows={4}
                  value={formData.context}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Что привело к появлению этой идеи? Какие данные или наблюдения ее подтверждают?"
                />
              </div>

              {/* Информационный блок с процессом */}
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Что происходит с идеей дальше?</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li><strong>1. Командная оценка:</strong> Каждый участник команды оценит идею по ICE-критериям</li>
                    <li><strong>2. Приоритизация:</strong> Система автоматически рассчитает средний балл</li>
                    <li><strong>3. Проработка:</strong> Лучшие идеи превращаются в проверяемые гипотезы</li>
                    <li><strong>4. Тестирование:</strong> Гипотезы проверяются быстрыми экспериментами</li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-amber-900 mb-2">💭 Что такое ICE-оценка?</h3>
                  <div className="text-sm text-amber-800 space-y-1">
                    <p><strong>Impact (Влияние):</strong> Насколько сильно идея повлияет на ключевые метрики?</p>
                    <p><strong>Confidence (Уверенность):</strong> Насколько команда уверена в успехе идеи?</p>
                    <p><strong>Ease (Простота):</strong> Насколько легко реализовать идею?</p>
                    <p className="text-xs pt-1">Каждый критерий оценивается от 1 до 10 баллов</p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-900 mb-2">✅ Советы для хорошей идеи:</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Четко опишите проблему, которую решает идея</li>
                    <li>• Укажите целевую аудиторию или сегмент пользователей</li>
                    <li>• Добавьте контекст: откуда взялась эта идея?</li>
                    <li>• Будьте конкретны, избегайте общих формулировок</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Link
                  href="/ideas"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Отмена
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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