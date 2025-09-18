import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function MVPDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const mvp = await prisma.mVP.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, email: true, role: true } },
      experiment: { select: { id: true, title: true, hypothesis: { select: { id: true, title: true, idea: { select: { id: true, title: true } } } } } },
      attachments: true,
      _count: { select: { comments: true } },
    },
  })

  if (!mvp) return notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Link href="/mvps" className="text-2xl font-bold text-gray-900">
              MVP
            </Link>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Автор:</span>
              <span>{mvp.creator.name ?? mvp.creator.email}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-2 text-sm text-gray-500">
            Эксперимент: <Link href={`/experiments/${mvp.experiment.id}`} className="text-blue-600 hover:text-blue-800">{mvp.experiment.title}</Link>{' '}
            · Гипотеза: <Link href={`/hypotheses/${mvp.experiment.hypothesis.id}`} className="text-blue-600 hover:text-blue-800">{mvp.experiment.hypothesis.title}</Link>{' '}
            · Идея: <Link href={`/ideas/${mvp.experiment.hypothesis.idea.id}`} className="text-blue-600 hover:text-blue-800">{mvp.experiment.hypothesis.idea.title}</Link>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">{mvp.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="bg-gray-100 px-2 py-0.5 rounded">Тип: {mvp.type}</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded">Статус: {mvp.status}</span>
          </div>
          <p className="text-gray-700 leading-7 whitespace-pre-wrap mb-4">{mvp.description}</p>
          {mvp.features && (
            <div className="mb-2 text-sm text-gray-700"><span className="font-medium">Функции:</span> {mvp.features}</div>
          )}
          {mvp.technicalSpecs && (
            <div className="mb-2 text-sm text-gray-700"><span className="font-medium">Технические требования:</span> {mvp.technicalSpecs}</div>
          )}
          {mvp.resources && (
            <div className="mb-2 text-sm text-gray-700"><span className="font-medium">Ресурсы:</span> {mvp.resources}</div>
          )}
          {mvp.timeline && (
            <div className="mb-2 text-sm text-gray-700"><span className="font-medium">Сроки:</span> {mvp.timeline}</div>
          )}
          {mvp.successCriteria && (
            <div className="mb-2 text-sm text-gray-700"><span className="font-medium">Критерии успеха:</span> {mvp.successCriteria}</div>
          )}

          <div className="mt-6 flex gap-3">
            <Link href="/mvps" className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
              Назад к списку
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}


