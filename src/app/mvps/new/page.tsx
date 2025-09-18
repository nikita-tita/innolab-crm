"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import Link from "next/link"

interface Experiment {
  id: string
  title: string
  description: string
  hypothesis: {
    title: string
    idea: {
      title: string
    }
  }
}

function NewMVPInner() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const experimentId = searchParams.get("experimentId")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    experimentId: experimentId || "",
    type: "PROTOTYPE",
    features: "",
    technicalSpecs: "",
    resources: "",
    timeline: "",
    successCriteria: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [loadingExperiments, setLoadingExperiments] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        const response = await fetch('/api/experiments')
        if (response.ok) {
          const data = await response.json()
          setExperiments(data.map((experiment: unknown) => {
            const e = experiment as {
              id: string;
              title: string;
              description: string;
              hypothesis: {
                title: string;
                idea: { title: string };
              };
            };
            return {
            id: e.id,
            title: e.title,
            description: e.description,
            hypothesis: {
              title: e.hypothesis.title,
              idea: {
                title: e.hypothesis.idea.title
              }
            }
          }}))
        }
      } catch (error) {
        console.error('Error fetching experiments:', error)
      } finally {
        setLoadingExperiments(false)
      }
    }

    if (status !== "loading") {
      fetchExperiments()
    }
  }, [status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/mvps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/mvps")
      } else {
        const error = await response.json()
        alert(`Ошибка: ${error.error}`)
      }
    } catch (error) {
      alert("Произошла ошибка при создании MVP")
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

  if (status === "loading" || loadingExperiments) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const selectedExperiment = experiments.find(e => e.id === formData.experimentId)

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
            <Link href="/ideas" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Идеи
            </Link>
            <Link href="/hypotheses" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Гипотезы
            </Link>
            <Link href="/experiments" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Эксперименты
            </Link>
            <Link href="/mvps" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
              MVP
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
                  <Link href="/mvps" className="text-gray-400 hover:text-gray-500">
                    MVP
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="text-gray-400 mx-2">/</span>
                    <span className="text-gray-600">Новый MVP</span>
                  </div>
                </li>
              </ol>
            </nav>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Создать новый MVP</h1>
            <p className="mt-2 text-gray-600">
              Определите минимально жизнеспособный продукт для проверки вашего эксперимента. MVP поможет быстро протестировать ключевые гипотезы.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div>
                <label htmlFor="experimentId" className="block text-sm font-medium text-gray-700 mb-2">
                  Связанный эксперимент *
                </label>
                <select
                  id="experimentId"
                  name="experimentId"
                  required
                  value={formData.experimentId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Выберите эксперимент</option>
                  {experiments.map((experiment) => (
                    <option key={experiment.id} value={experiment.id}>
                      {experiment.title} (Гипотеза: {experiment.hypothesis.title})
                    </option>
                  ))}
                </select>
                {selectedExperiment && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Эксперимент:</span> {selectedExperiment.description}
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      <span className="font-medium">Идея:</span> {selectedExperiment.hypothesis.idea.title}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Название MVP *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Краткое название MVP"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Описание MVP *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Подробное описание того, что представляет собой этот MVP..."
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Тип MVP
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="PROTOTYPE">Прототип</option>
                  <option value="WIREFRAME">Wireframe</option>
                  <option value="MOCKUP">Макет</option>
                  <option value="LANDING_PAGE">Landing Page</option>
                  <option value="DEMO">Демо</option>
                </select>
              </div>

              <div>
                <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">
                  Ключевые функции
                </label>
                <textarea
                  id="features"
                  name="features"
                  rows={4}
                  value={formData.features}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Список основных функций и возможностей MVP..."
                />
              </div>

              <div>
                <label htmlFor="technicalSpecs" className="block text-sm font-medium text-gray-700 mb-2">
                  Технические требования
                </label>
                <textarea
                  id="technicalSpecs"
                  name="technicalSpecs"
                  rows={3}
                  value={formData.technicalSpecs}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Технические спецификации, платформы, инструменты..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="Команда, бюджет, инструменты..."
                  />
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
                    placeholder="Сроки разработки и этапы..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="successCriteria" className="block text-sm font-medium text-gray-700 mb-2">
                  Критерии успеха
                </label>
                <textarea
                  id="successCriteria"
                  name="successCriteria"
                  rows={3}
                  value={formData.successCriteria}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Метрики и показатели успешности MVP..."
                />
              </div>

              {/* Help Section */}
              <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-purple-900 mb-2">🚀 Советы по созданию MVP:</h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Сосредоточьтесь на минимальном наборе функций для проверки гипотезы</li>
                  <li>• Выберите самый быстрый способ получить обратную связь от пользователей</li>
                  <li>• Определите четкие метрики для измерения успеха</li>
                  <li>• Планируйте итерации на основе полученных данных</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Link
                  href="/mvps"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Отмена
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.description.trim() || !formData.experimentId}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Создание..." : "Создать MVP"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function NewMVP() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-lg">Загрузка...</div></div>}>
      <NewMVPInner />
    </Suspense>
  )
}