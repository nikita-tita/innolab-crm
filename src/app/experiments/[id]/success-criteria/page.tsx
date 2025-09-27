import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import ExperimentSuccessCriteriaWrapper from "../success-criteria-wrapper"
import { Breadcrumbs, breadcrumbPatterns } from "@/components/ui/Breadcrumbs"

export default async function ExperimentSuccessCriteriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const experiment = await prisma.experiment.findUnique({
    where: { id },
    include: {
      hypothesis: {
        select: {
          id: true,
          title: true,
          idea: { select: { id: true, title: true } }
        }
      },
      successCriteria: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!experiment) return notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Link href="/experiments" className="text-2xl font-bold text-gray-900">
              Эксперименты
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbPatterns.experiments.detail(
          experiment.title,
          experiment.hypothesis.title,
          experiment.hypothesis.idea.title
        )} />

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Критерии успеха: {experiment.title}
            </h1>
            <div className="text-sm text-gray-500">
              Гипотеза: <Link href={`/hypotheses/${experiment.hypothesis.id}`} className="text-blue-600 hover:text-blue-800">{experiment.hypothesis.title}</Link>{' '}
              · Идея: <Link href={`/ideas/${experiment.hypothesis.idea.id}`} className="text-blue-600 hover:text-blue-800">{experiment.hypothesis.idea.title}</Link>
            </div>
          </div>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Что такое критерии успеха?</h3>
            <p className="text-sm text-blue-800">
              Критерии успеха — это конкретные, измеримые показатели, которые определяют,
              достиг ли эксперимент поставленных целей. Они должны быть заданы до начала эксперимента.
            </p>
          </div>

          <ExperimentSuccessCriteriaWrapper
            experimentId={experiment.id}
            initialCriteria={experiment.successCriteria}
            showActualValues={experiment.status === 'IN_PROGRESS' || experiment.status === 'COMPLETED'}
            disabled={experiment.status === 'COMPLETED'}
          />

          <div className="mt-6 flex gap-3">
            <Link
              href={`/experiments/${experiment.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Вернуться к эксперименту
            </Link>
            <Link
              href="/experiments"
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              К списку экспериментов
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}