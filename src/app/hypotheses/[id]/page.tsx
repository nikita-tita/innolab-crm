"use client"

import { notFound } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import Comments from "@/components/ui/Comments"
import HADIStepper from "@/components/ui/HADIStepper"
import StatusControls from "./status-controls"
import SuccessCriteriaPanel from "@/components/ui/SuccessCriteriaPanel"
import { RiceScoring } from "@/components/ui/rice-scoring"
import { DeskResearch } from "@/components/ui/desk-research"
import { SuccessCriteriaManager } from "@/components/ui/success-criteria-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HypothesisDetails({ params }: { params: Promise<{ id: string }> }) {
  const [hypothesis, setHypothesis] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>("")

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params
      setId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!id) return

    async function fetchHypothesis() {
      try {
        const response = await fetch(`/api/hypotheses/${id}`)
        if (!response.ok) {
          return notFound()
        }
        const data = await response.json()
        setHypothesis(data)
      } catch (error) {
        console.error("Error fetching hypothesis:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHypothesis()
  }, [id])

  if (loading) return <div className="p-8">Loading...</div>
  if (!hypothesis) return notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Link href="/hypotheses" className="text-2xl font-bold text-gray-900">
              Гипотезы
            </Link>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Автор:</span>
              <span>{hypothesis.creator.name ?? hypothesis.creator.email}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Заголовок гипотезы */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-2 text-sm text-gray-500">
                Идея: <Link href={`/ideas/${hypothesis.idea.id}`} className="text-blue-600 hover:text-blue-800">{hypothesis.idea.title}</Link>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">{hypothesis.title}</h1>

              <div className="flex items-center gap-2 mb-4">
                <Badge variant={hypothesis.status === 'DRAFT' ? 'secondary' : hypothesis.status === 'DESK_RESEARCH' ? 'default' : hypothesis.status === 'READY_FOR_TESTING' ? 'secondary' : 'default'}>
                  {hypothesis.status === 'DRAFT' ? 'Черновик' :
                   hypothesis.status === 'DESK_RESEARCH' ? 'Desk Research' :
                   hypothesis.status === 'READY_FOR_TESTING' ? 'Готова к тесту' :
                   hypothesis.status === 'IN_EXPERIMENT' ? 'В эксперименте' : hypothesis.status}
                </Badge>
                <Badge variant={hypothesis.priority === 'HIGH' ? 'destructive' : hypothesis.priority === 'MEDIUM' ? 'default' : 'secondary'}>
                  {hypothesis.priority}
                </Badge>
                <Badge variant="outline">
                  Уверенность: {hypothesis.confidenceLevel}%
                </Badge>
                {hypothesis.riceScore && (
                  <Badge variant="outline">
                    RICE: {hypothesis.riceScore.toFixed(1)}
                  </Badge>
                )}
              </div>

              <StatusControls id={hypothesis.id} current={hypothesis.status} type="hypothesis" />
              <HADIStepper current={hypothesis.status === 'DRAFT' ? 'H' : hypothesis.status === 'IN_EXPERIMENT' || hypothesis.status === 'READY_FOR_TESTING' ? 'A' : hypothesis.status === 'VALIDATED' || hypothesis.status === 'INVALIDATED' ? 'I' : 'D'} />

              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                <h3 className="font-medium text-blue-900 mb-2">🔬 Формулировка гипотезы</h3>
                <p className="text-gray-700 leading-7 whitespace-pre-wrap">{hypothesis.statement}</p>
              </div>

              {/* Подсказки по работе с гипотезой */}
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <h3 className="text-sm font-medium text-amber-900 mb-2">💡 Как работать с гипотезой:</h3>
                <div className="text-sm text-amber-700 space-y-1">
                  <p>• <strong>Запланируйте и выполните эксперимент</strong> - переходите на вкладку "Эксперименты"</p>
                  <p>• <strong>Desk Research</strong> - изучите существующие данные и источники</p>
                  <p>• <strong>RICE Scoring</strong> - оцените приоритет для тестирования</p>
                  <p>• <strong>Критерии успеха</strong> - определите четкие метрики для измерения результата</p>
                </div>
              </div>

              {hypothesis.testingMethod && (
                <div className="mt-4 text-sm text-gray-700"><span className="font-medium">Метод тестирования:</span> {hypothesis.testingMethod}</div>
              )}
              {hypothesis.successCriteriaText && (
                <div className="mt-2 text-sm text-gray-700"><span className="font-medium">Критерии успеха:</span> {hypothesis.successCriteriaText}</div>
              )}
            </CardContent>
          </Card>

          {/* Вкладки с детальной информацией */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="desk-research">Desk Research</TabsTrigger>
              <TabsTrigger value="rice-scoring">RICE Scoring</TabsTrigger>
              <TabsTrigger value="success-criteria">Критерии успеха</TabsTrigger>
              <TabsTrigger value="experiments">Эксперименты</TabsTrigger>
              <TabsTrigger value="comments">Комментарии</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Теория методологии HADI */}
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                <CardHeader>
                  <CardTitle className="text-indigo-900">📚 Методология HADI</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-indigo-800 space-y-3">
                  <p><strong>H - Hypothesis (Гипотеза):</strong> Формулируйте четкую проверяемую гипотезу в формате "Если X, то Y, потому что Z"</p>
                  <p><strong>A - Action (Действие):</strong> Планируйте конкретные шаги для проверки гипотезы через эксперимент</p>
                  <p><strong>D - Data (Данные):</strong> Собирайте количественные и качественные данные в ходе эксперимента</p>
                  <p><strong>I - Insight (Инсайт):</strong> Анализируйте результаты и делайте выводы для следующих итераций</p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Описание гипотезы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{hypothesis.description || "Описание не указано"}</p>
                    {hypothesis.targetAudience && (
                      <div className="mt-4 p-3 bg-blue-50 rounded">
                        <p className="text-sm font-medium text-blue-900">Целевая аудитория:</p>
                        <p className="text-sm text-blue-800">{hypothesis.targetAudience}</p>
                      </div>
                    )}
                    {hypothesis.userValue && (
                      <div className="mt-2 p-3 bg-green-50 rounded">
                        <p className="text-sm font-medium text-green-900">Ценность для пользователя:</p>
                        <p className="text-sm text-green-800">{hypothesis.userValue}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Бизнес-контекст</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {hypothesis.businessImpact && (
                      <div>
                        <span className="font-medium text-gray-900">Влияние на метрики:</span>
                        <p className="text-gray-700 mt-1">{hypothesis.businessImpact}</p>
                      </div>
                    )}
                    {hypothesis.financialImpact && (
                      <div>
                        <span className="font-medium text-gray-900">Финансовое обоснование:</span>
                        <p className="text-gray-700 mt-1">{hypothesis.financialImpact}</p>
                      </div>
                    )}
                    {hypothesis.strategicAlignment && (
                      <div>
                        <span className="font-medium text-gray-900">Связь с целями компании:</span>
                        <p className="text-gray-700 mt-1">{hypothesis.strategicAlignment}</p>
                      </div>
                    )}
                    <div className="mt-4 pt-3 border-t">
                      <div><span className="font-medium">Автор:</span> {hypothesis.creator.name ?? hypothesis.creator.email}</div>
                      <div><span className="font-medium">Создано:</span> {new Date(hypothesis.createdAt).toLocaleDateString()}</div>
                      <div><span className="font-medium">Обновлено:</span> {new Date(hypothesis.updatedAt).toLocaleDateString()}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Рекомендации по следующим шагам */}
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-yellow-900">🎯 Следующие шаги</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-yellow-800">
                  {hypothesis.status === 'DRAFT' && (
                    <div className="space-y-2">
                      <p>• Завершите формулировку гипотезы и добавьте бизнес-контекст</p>
                      <p>• Проведите RICE-оценку для определения приоритета</p>
                      <p>• Переходите к этапу Desk Research для изучения существующих данных</p>
                    </div>
                  )}
                  {hypothesis.status === 'DESK_RESEARCH' && (
                    <div className="space-y-2">
                      <p>• Соберите и проанализируйте существующие данные по теме</p>
                      <p>• Изучите опыт конкурентов и индустрии</p>
                      <p>• Уточните критерии успеха на основе полученной информации</p>
                    </div>
                  )}
                  {hypothesis.status === 'READY_FOR_TESTING' && (
                    <div className="space-y-2">
                      <p>• Создайте детальный план эксперимента</p>
                      <p>• Определите необходимые ресурсы и временные рамки</p>
                      <p>• Запустите эксперимент и начните сбор данных</p>
                    </div>
                  )}
                  {hypothesis.status === 'IN_EXPERIMENT' && (
                    <div className="space-y-2">
                      <p>• Отслеживайте ключевые метрики эксперимента</p>
                      <p>• Собирайте качественную обратную связь от пользователей</p>
                      <p>• Готовьтесь к анализу результатов по завершении</p>
                    </div>
                  )}
                </CardContent>
              </Card>

            </TabsContent>

            <TabsContent value="desk-research">
              <DeskResearch
                hypothesisId={hypothesis.id}
                initialData={{
                  notes: hypothesis.deskResearchNotes || "",
                  sources: hypothesis.deskResearchSources || [],
                  targetAudience: hypothesis.targetAudience,
                  businessImpact: hypothesis.businessImpact,
                  risks: hypothesis.risks || [],
                  opportunities: hypothesis.opportunities || [],
                  researchDate: hypothesis.deskResearchDate
                }}
                onSave={async (data) => {
                  try {
                    const response = await fetch(`/api/hypotheses/${hypothesis.id}/desk-research`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(data)
                    });
                    if (response.ok) {
                      window.location.reload();
                    }
                  } catch (error) {
                    console.error("Error saving desk research:", error);
                  }
                }}
                onStatusChange={async (newStatus) => {
                  try {
                    const response = await fetch(`/api/hypotheses/${hypothesis.id}/status`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: newStatus })
                    });
                    if (response.ok) {
                      window.location.reload();
                    }
                  } catch (error) {
                    console.error("Error updating status:", error);
                  }
                }}
                disabled={hypothesis.status !== "DESK_RESEARCH"}
              />
            </TabsContent>

            <TabsContent value="rice-scoring">
              <RiceScoring
                reach={hypothesis.reach || 0}
                impact={hypothesis.impact || 1}
                confidence={hypothesis.confidence || 50}
                effort={hypothesis.effort || 1}
                onScoreChange={async (score, values) => {
                  try {
                    const response = await fetch(`/api/hypotheses/${hypothesis.id}/rice-score`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ ...values, score })
                    });
                    if (response.ok) {
                      window.location.reload();
                    }
                  } catch (error) {
                    console.error("Error updating RICE score:", error);
                  }
                }}
                disabled={hypothesis.status === "COMPLETED"}
              />
            </TabsContent>

            <TabsContent value="success-criteria">
              <SuccessCriteriaManager
                hypothesisId={hypothesis.id}
                initialCriteria={[
                  {
                    id: "1",
                    name: "Удержание пользователей",
                    description: "Процент пользователей, остающихся активными через 30 дней",
                    targetValue: 25,
                    unit: "%",
                    actualValue: 28.5,
                    status: "achieved",
                    priority: "high"
                  },
                  {
                    id: "2",
                    name: "Активность пользователей (DAU)",
                    description: "Увеличение ежедневной активности пользователей",
                    targetValue: 30,
                    unit: "%",
                    actualValue: 35.2,
                    status: "achieved",
                    priority: "medium"
                  }
                ]}
                onSave={(criteria) => {
                  console.log("Saving success criteria:", criteria);
                  // Здесь будет API вызов для сохранения критериев успеха
                }}
                disabled={hypothesis.status === "DRAFT"}
                showProgress={true}
              />
            </TabsContent>

            <TabsContent value="experiments">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Эксперименты ({hypothesis._count.experiments})</CardTitle>
                  <Link
                    href={`/experiments/new?hypothesisId=${hypothesis.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Создать эксперимент
                  </Link>
                </CardHeader>
                <CardContent>
                  {hypothesis.experiments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>Пока нет связанных экспериментов</p>
                      <p className="text-sm mt-2">Создайте первый эксперимент для проверки этой гипотезы</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {hypothesis.experiments.map(e => (
                        <div key={e.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                          <div>
                            <Link href={`/experiments/${e.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                              {e.title}
                            </Link>
                          </div>
                          <Badge variant="secondary">{e.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments">
              <Comments hypothesisId={hypothesis.id} />
            </TabsContent>
          </Tabs>

          {/* Действия */}
          <div className="flex gap-3">
            <Link href="/hypotheses" className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
              Назад к списку
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}


