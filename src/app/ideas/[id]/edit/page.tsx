"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import AppLayout from "@/components/layout/AppLayout"

interface IdeaData {
  id: string
  title: string
  description: string
  category: string
  context?: string
}

export default function EditIdea({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [idea, setIdea] = useState<IdeaData | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    context: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await fetch(`/api/ideas/${params.id}`)
        if (response.ok) {
          const ideaData = await response.json()
          setIdea(ideaData)
          setFormData({
            title: ideaData.title || "",
            description: ideaData.description || "",
            category: ideaData.category || "",
            context: ideaData.context || ""
          })
        } else {
          console.error("Ошибка при загрузке идеи")
          router.push("/ideas")
        }
      } catch (error) {
        console.error("Ошибка при загрузке идеи:", error)
        router.push("/ideas")
      } finally {
        setLoading(false)
      }
    }

    if (status !== "loading") {
      fetchIdea()
    }
  }, [params.id, status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/ideas/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push(`/ideas/${params.id}`)
      } else {
        const error = await response.json()
        alert(`Ошибка: ${error.error}`)
      }
    } catch (error) {
      alert("Произошла ошибка при обновлении идеи")
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

  if (!session || !idea) {
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
                  <Link href="/ideas" className="text-gray-400 hover:text-gray-500">
                    Идеи
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="text-gray-400 mx-2">/</span>
                    <Link href={`/ideas/${params.id}`} className="text-gray-400 hover:text-gray-500">
                      {idea.title}
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
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Редактировать идею</h1>
            <p className="mt-2 text-gray-600">
              Внесите изменения в описание идеи. Изменения будут сохранены сразу после отправки формы.
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

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-amber-900 mb-2">⚠️ Важно:</h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Изменения в описании идеи могут повлиять на уже проставленные ICE-оценки</li>
                  <li>• После значительных изменений рекомендуется пересмотреть оценки команды</li>
                  <li>• Если идея уже перешла в статус гипотезы, будьте осторожны с изменениями</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-4">
                <Link
                  href={`/ideas/${params.id}`}
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