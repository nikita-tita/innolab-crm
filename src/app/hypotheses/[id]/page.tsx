import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
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

export default async function HypothesisDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const hypothesis = await prisma.hypothesis.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, email: true, role: true } },
      idea: { select: { id: true, title: true } },
      experiments: { select: { id: true, title: true, status: true } },
      _count: { select: { experiments: true, comments: true } },
    },
  })

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
                <p className="text-gray-700 leading-7 whitespace-pre-wrap">{hypothesis.statement}</p>
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
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Описание гипотезы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{hypothesis.description || "Описание не указано"}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Информация о создании</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><span className="font-medium">Автор:</span> {hypothesis.creator.name ?? hypothesis.creator.email}</div>
                    <div><span className="font-medium">Создано:</span> {new Date(hypothesis.createdAt).toLocaleDateString()}</div>
                    <div><span className="font-medium">Обновлено:</span> {new Date(hypothesis.updatedAt).toLocaleDateString()}</div>
                  </CardContent>
                </Card>
              </div>

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
                onSave={(data) => {
                  console.log("Saving desk research:", data);
                  // Здесь будет API вызов для сохранения данных Desk Research
                }}
                onStatusChange={(newStatus) => {
                  console.log("Status change:", newStatus);
                  // Здесь будет API вызов для обновления статуса
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
                onScoreChange={(score, values) => {
                  console.log("RICE score updated:", score, values);
                  // Здесь будет API вызов для сохранения RICE оценки
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


