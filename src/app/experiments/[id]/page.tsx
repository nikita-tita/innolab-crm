import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import Comments from "@/components/ui/Comments"
import StatusControls from "./status-controls"
import ExperimentSuccessCriteriaWrapper from "./success-criteria-wrapper"
import { ExperimentStatusBadge } from "@/components/ui/experiment-status-badge"

export default async function ExperimentDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const exp = await prisma.experiment.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, email: true, role: true } },
      hypothesis: {
        select: {
          id: true,
          title: true,
          idea: { select: { id: true, title: true } }
        }
      },
      successCriteria: { orderBy: { createdAt: 'asc' } },
      _count: { select: { comments: true, successCriteria: true } },
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
            <ExperimentStatusBadge status={exp.status} type={exp.type} />
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

          <div className="mt-6 border-t pt-4">
            <ExperimentSuccessCriteriaWrapper
              experimentId={exp.id}
              initialCriteria={exp.successCriteria}
              showActualValues={exp.status === 'IN_PROGRESS' || exp.status === 'COMPLETED'}
              disabled={exp.status === 'COMPLETED'}
            />
          </div>

          <div className="mt-6 flex gap-3">
            <Link href={`/experiments/${exp.id}/edit`} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Редактировать
            </Link>
            <Link href="/experiments" className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
              Назад к списку
            </Link>
          </div>


          <Comments experimentId={exp.id} />
        </div>
      </main>
    </div>
  )
}


