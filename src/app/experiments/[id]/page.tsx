import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import Comments from "@/components/ui/Comments"
import StatusControls from "./status-controls"
import ExperimentResultsPanel from "@/components/ui/ExperimentResultsPanel"

export default async function ExperimentDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const exp = await prisma.experiment.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, email: true, role: true } },
      hypothesis: { select: { id: true, title: true, idea: { select: { id: true, title: true } } } },
      mvps: { select: { id: true, title: true, status: true, type: true } },
      _count: { select: { mvps: true, comments: true } },
    },
  })

  if (!exp) return notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Link href="/experiments" className="text-2xl font-bold text-gray-900">
              Эксперименты
            </Link>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Автор:</span>
              <span>{exp.creator.name ?? exp.creator.email}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-2 text-sm text-gray-500">
            Гипотеза: <Link href={`/hypotheses/${exp.hypothesis.id}`} className="text-blue-600 hover:text-blue-800">{exp.hypothesis.title}</Link>{' '}
            · Идея: <Link href={`/ideas/${exp.hypothesis.idea.id}`} className="text-blue-600 hover:text-blue-800">{exp.hypothesis.idea.title}</Link>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">{exp.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="bg-gray-100 px-2 py-0.5 rounded">Статус: {exp.status}</span>
          </div>
          <StatusControls id={exp.id} current={exp.status} />
          <p className="text-gray-700 leading-7 whitespace-pre-wrap mb-4">{exp.description}</p>
          {exp.methodology && (
            <div className="mb-2 text-sm text-gray-700"><span className="font-medium">Методология:</span> {exp.methodology}</div>
          )}
          {exp.timeline && (
            <div className="mb-2 text-sm text-gray-700"><span className="font-medium">Сроки:</span> {exp.timeline}</div>
          )}
          {exp.resources && (
            <div className="mb-2 text-sm text-gray-700"><span className="font-medium">Ресурсы:</span> {exp.resources}</div>
          )}
          {exp.successMetrics && (
            <div className="mb-2 text-sm text-gray-700"><span className="font-medium">Метрики успеха:</span> {exp.successMetrics}</div>
          )}

          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-medium text-gray-900 mb-2">MVP ({exp._count.mvps})</h2>
            {exp.mvps.length === 0 ? (
              <div className="text-sm text-gray-500">Пока нет связанных MVP</div>
            ) : (
              <ul className="space-y-2">
                {exp.mvps.map(m => (
                  <li key={m.id} className="flex items-center justify-between bg-gray-50 rounded p-3">
                    <div className="truncate pr-2">
                      <Link href={`/mvps/${m.id}`} className="text-blue-600 hover:text-blue-800">
                        {m.title}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded">{m.type}</span>
                      <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded">{m.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <Link href={`/mvps/new?experimentId=${exp.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Создать MVP
            </Link>
            <Link href="/experiments" className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
              Назад к списку
            </Link>
          </div>

          <Comments experimentId={exp.id} />
          <ExperimentResultsPanel experimentId={exp.id} />
        </div>
      </main>
    </div>
  )
}


