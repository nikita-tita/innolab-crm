"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { HypothesisTemplates } from "@/components/ui/hypothesis-templates"
import { RiceScoring } from "@/components/ui/rice-scoring"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Calculator, FileText } from "lucide-react"

interface Idea {
  id: string
  title: string
}

function NewHypothesisInner() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const ideaId = searchParams.get("ideaId")

  const [formData, setFormData] = useState({
    title: "",
    statement: "",
    description: "",
    ideaId: ideaId || "",
    priority: "MEDIUM",
    confidenceLevel: 70,
    testingMethod: "",
    successCriteria: "",
    reach: 0,
    impact: 1,
    confidence: 50,
    effort: 1,
    riceScore: 0
  })
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loadingIdeas, setLoadingIdeas] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch('/api/ideas')
        if (response.ok) {
          const data = await response.json()
          setIdeas(data.map((idea: unknown) => {
            const i = idea as { id: string; title: string };
            return {
            id: i.id,
            title: i.title
          }}))
        }
      } catch (error) {
        console.error('Error fetching ideas:', error)
      } finally {
        setLoadingIdeas(false)
      }
    }

    if (status !== "loading") {
      fetchIdeas()
    }
  }, [status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/hypotheses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/hypotheses")
      } else {
        const error = await response.json()
        alert(`Ошибка: ${error.error}`)
      }
    } catch (error) {
      alert("Произошла ошибка при создании гипотезы")
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

  const handleTemplateSelect = (template: any, variables: Record<string, string>) => {
    // Заполняем данные из шаблона
    let statement = template.template;
    Object.entries(variables).forEach(([variable, value]) => {
      statement = statement.replace(`{${variable}}`, value);
    });

    setFormData(prev => ({
      ...prev,
      title: template.name + " - " + Object.values(variables).slice(0, 2).join(", "),
      statement: statement,
      description: template.description
    }));

    // Переходим на вкладку основной информации
    setActiveTab("basic");
  }

  const handleRiceScoreChange = (score: number, values: any) => {
    setFormData(prev => ({
      ...prev,
      reach: values.reach,
      impact: values.impact,
      confidence: values.confidence,
      effort: values.effort,
      riceScore: score
    }));
  }

  if (status === "loading" || loadingIdeas) {
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
            <Link href="/ideas" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Идеи
            </Link>
            <Link href="/hypotheses" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
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
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
                    <span className="text-gray-600">Новая гипотеза</span>
                  </div>
                </li>
              </ol>
            </nav>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Создать новую гипотезу</h1>
            <p className="mt-2 text-gray-600">
              Используйте шаблоны или создайте гипотезу с нуля в формате "Если X, то Y, потому что Z"
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="templates">
                <Lightbulb className="h-4 w-4 mr-2" />
                Шаблоны
              </TabsTrigger>
              <TabsTrigger value="basic">
                <FileText className="h-4 w-4 mr-2" />
                Основная информация
              </TabsTrigger>
              <TabsTrigger value="rice">
                <Calculator className="h-4 w-4 mr-2" />
                RICE Scoring
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates">
              <HypothesisTemplates
                onCreateFromTemplate={handleTemplateSelect}
              />
            </TabsContent>

            <TabsContent value="basic">
              <div className="bg-white shadow rounded-lg">
                <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div>
                <label htmlFor="ideaId" className="block text-sm font-medium text-gray-700 mb-2">
                  Связанная идея *
                </label>
                <select
                  id="ideaId"
                  name="ideaId"
                  required
                  value={formData.ideaId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Выберите идею</option>
                  {ideas.map((idea) => (
                    <option key={idea.id} value={idea.id}>
                      {idea.title}
                    </option>
                  ))}
                </select>
              </div>

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
                  placeholder="Краткое название гипотезы"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Детальное описание гипотезы и контекста"
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
                  placeholder="Если мы [действие], то [ожидаемый результат], что мы измерим через [метрики]..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Используйте формат: &quot;Если мы [действие], то [результат], что мы измерим через [метрики]&quot;
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="testingMethod" className="block text-sm font-medium text-gray-700 mb-2">
                  Метод тестирования
                </label>
                <input
                  type="text"
                  id="testingMethod"
                  name="testingMethod"
                  value={formData.testingMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="A/B тест, интервью, прототип, анализ данных..."
                />
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
                  placeholder="Конкретные метрики и пороговые значения для подтверждения гипотезы..."
                />
              </div>

              {/* Help Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">🔬 Советы по формулированию гипотезы:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Формулируйте конкретное и проверяемое утверждение</li>
                  <li>• Определите четкие метрики для измерения результата</li>
                  <li>• Укажите временные рамки для тестирования</li>
                  <li>• Рассмотрите альтернативные объяснения результатов</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Link
                  href="/hypotheses"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Отмена
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.statement.trim() || !formData.ideaId}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Создание..." : "Создать гипотезу"}
                </button>
              </div>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="rice">
          <RiceScoring
            reach={formData.reach}
            impact={formData.impact}
            confidence={formData.confidence}
            effort={formData.effort}
            onScoreChange={handleRiceScoreChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  </main>
</div>
)
}

export default function NewHypothesis() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-lg">Загрузка...</div></div>}>
      <NewHypothesisInner />
    </Suspense>
  )
}