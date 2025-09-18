import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import Comments from "@/components/ui/Comments"
import HADIStepper from "@/components/ui/HADIStepper"
import StatusControls from "./status-controls"
import SuccessCriteriaPanel from "@/components/ui/SuccessCriteriaPanel"

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

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-2 text-sm text-gray-500">
            Идея: <Link href={`/ideas/${hypothesis.idea.id}`} className="text-blue-600 hover:text-blue-800">{hypothesis.idea.title}</Link>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">{hypothesis.title}</h1>
          <StatusControls id={hypothesis.id} current={hypothesis.status} type="hypothesis" />
          <HADIStepper current={hypothesis.status === 'DRAFT' ? 'H' : hypothesis.status === 'IN_EXPERIMENT' || hypothesis.status === 'READY_FOR_TESTING' ? 'A' : hypothesis.status === 'VALIDATED' || hypothesis.status === 'INVALIDATED' ? 'I' : 'D'} />
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="bg-gray-100 px-2 py-0.5 rounded">Приоритет: {hypothesis.priority}</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded">Статус: {hypothesis.status}</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded">Уверенность: {hypothesis.confidenceLevel}%</span>
          </div>
          <p className="text-gray-700 leading-7 whitespace-pre-wrap mb-4">{hypothesis.statement}</p>
          {hypothesis.testingMethod && (
            <div className="mb-2 text-sm text-gray-700"><span className="font-medium">Метод:</span> {hypothesis.testingMethod}</div>
          )}
          {hypothesis.successCriteriaText && (
            <div className="mb-2 text-sm text-gray-700"><span className="font-medium">Критерии успеха:</span> {hypothesis.successCriteriaText}</div>
          )}

          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Эксперименты ({hypothesis._count.experiments})</h2>
            {hypothesis.experiments.length === 0 ? (
              <div className="text-sm text-gray-500">Пока нет связанных экспериментов</div>
            ) : (
              <ul className="space-y-2">
                {hypothesis.experiments.map(e => (
                  <li key={e.id} className="flex items-center justify-between bg-gray-50 rounded p-3">
                    <div className="truncate pr-2">
                      <Link href={`/experiments/${e.id}`} className="text-blue-600 hover:text-blue-800">
                        {e.title}
                      </Link>
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">{e.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <Link href={`/experiments/new?hypothesisId=${hypothesis.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Создать эксперимент
            </Link>
            <Link href="/hypotheses" className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
              Назад к списку
            </Link>
          </div>

          <Comments hypothesisId={hypothesis.id} />
          <SuccessCriteriaPanel hypothesisId={hypothesis.id} />
        </div>
      </main>
    </div>
  )
}


