import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function IdeaDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const idea = await prisma.idea.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, email: true, role: true } },
      hypotheses: { select: { id: true, title: true, status: true } },
      _count: { select: { hypotheses: true, comments: true } },
    },
  })

  if (!idea) return notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Link href="/ideas" className="text-2xl font-bold text-gray-900">
              Идеи
            </Link>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Автор:</span>
              <span>{idea.creator.name ?? idea.creator.email}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">{idea.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="bg-gray-100 px-2 py-0.5 rounded">{idea.category ?? "Без категории"}</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded">Приоритет: {idea.priority}</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded">Статус: {idea.status}</span>
          </div>
          <p className="text-gray-700 leading-7 whitespace-pre-wrap">{idea.description}</p>

          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Гипотезы ({idea._count.hypotheses})</h2>
            {idea.hypotheses.length === 0 ? (
              <div className="text-sm text-gray-500">Пока нет связанных гипотез</div>
            ) : (
              <ul className="space-y-2">
                {idea.hypotheses.map(h => (
                  <li key={h.id} className="flex items-center justify-between bg-gray-50 rounded p-3">
                    <div className="truncate pr-2">
                      <Link href={`/hypotheses/${h.id}`} className="text-blue-600 hover:text-blue-800">
                        {h.title}
                      </Link>
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">{h.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <Link href={`/hypotheses/new?ideaId=${idea.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Создать гипотезу
            </Link>
            <Link href="/ideas" className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
              Назад к списку
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}


