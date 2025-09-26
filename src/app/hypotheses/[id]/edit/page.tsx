"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import AppLayout from "@/components/layout/AppLayout"

interface HypothesisData {
  id: string
  title: string
  statement: string
  priority: string
  confidenceLevel: number
}

export default function EditHypothesis({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [hypothesis, setHypothesis] = useState<HypothesisData | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    statement: "",
    priority: "MEDIUM",
    confidenceLevel: 70
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
            statement: hypothesisData.statement || "",
            priority: hypothesisData.priority || "MEDIUM",
            confidenceLevel: hypothesisData.confidenceLevel || 70
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
      [name]: name === 'confidenceLevel' ? parseInt(value) : value
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

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-amber-900 mb-2">⚠️ Важно:</h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Изменения в формулировке гипотезы могут повлиять на связанные эксперименты</li>
                  <li>• После значительных изменений рекомендуется пересмотреть критерии успеха</li>
                  <li>• Если гипотеза уже проходит тестирование, будьте осторожны с изменениями</li>
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