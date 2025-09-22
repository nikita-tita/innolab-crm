"use client"

import React from 'react'
import Link from 'next/link'

interface ICEScore {
  id: string
  impact: number
  confidence: number
  ease: number
  user: {
    name: string
    role: string
  }
}

interface Artifact {
  id: string
  name: string
  type: string
  url?: string
  conclusion: string
}

interface HypothesisCardProps {
  hypothesis: {
    id: string
    title: string
    level: string
    stage: string
    actionDescription?: string
    expectedResult?: string
    reasoning?: string
    status: string
    owner?: {
      name: string
      role: string
    }
    creator: {
      name: string
    }
    createdAt: string
    idea: {
      title: string
    }
    finalPriority?: number
    northStarMetric?: string
    successThreshold?: string
    artifacts?: Artifact[]
    iceScores?: ICEScore[]
    conclusion?: string
    conclusionDescription?: string
    recommendations?: string
    nextSteps?: string
  }
}

export default function HypothesisCard({ hypothesis }: HypothesisCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-100 text-gray-800"
      case "SCORED": return "bg-blue-100 text-blue-800"
      case "RESEARCH": return "bg-yellow-100 text-yellow-800"
      case "EXPERIMENT_DESIGN": return "bg-orange-100 text-orange-800"
      case "READY_FOR_TESTING": return "bg-purple-100 text-purple-800"
      case "IN_EXPERIMENT": return "bg-indigo-100 text-indigo-800"
      case "COMPLETED": return "bg-green-100 text-green-800"
      case "VALIDATED": return "bg-emerald-100 text-emerald-800"
      case "INVALIDATED": return "bg-red-100 text-red-800"
      case "ITERATION": return "bg-amber-100 text-amber-800"
      case "ARCHIVED": return "bg-gray-100 text-gray-600"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "DRAFT": return "Черновик"
      case "SCORED": return "ICE-скоринг"
      case "RESEARCH": return "Исследование"
      case "EXPERIMENT_DESIGN": return "Дизайн эксперимента"
      case "READY_FOR_TESTING": return "Готова к тестированию"
      case "IN_EXPERIMENT": return "В эксперименте"
      case "COMPLETED": return "Завершена"
      case "VALIDATED": return "Подтверждена"
      case "INVALIDATED": return "Опровергнута"
      case "ITERATION": return "Итерация"
      case "ARCHIVED": return "Архивирована"
      default: return status
    }
  }

  // Вычисляем средние значения ICE
  const averageICE = hypothesis.iceScores?.length ? {
    impact: Math.round(hypothesis.iceScores.reduce((sum, score) => sum + score.impact, 0) / hypothesis.iceScores.length),
    confidence: Math.round(hypothesis.iceScores.reduce((sum, score) => sum + score.confidence, 0) / hypothesis.iceScores.length),
    ease: Math.round(hypothesis.iceScores.reduce((sum, score) => sum + score.ease, 0) / hypothesis.iceScores.length)
  } : null

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Заголовок */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-4">
          {hypothesis.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 text-xs rounded-full font-medium">
            {hypothesis.level === 'LEVEL_1' ? 'Уровень 1' : 'Уровень 2'}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${getStatusColor(hypothesis.status)}`}>
            {getStatusText(hypothesis.status)}
          </span>
          {hypothesis.finalPriority && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 text-xs rounded-full font-medium">
              #{hypothesis.finalPriority}
            </span>
          )}
        </div>
      </div>

      {/* Основная информация */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Левая колонка: Общее, Описание */}
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Общее</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Имя и Фамилия:</span> {hypothesis.creator.name}
              </div>
              <div>
                <span className="font-medium">Уровень:</span> {hypothesis.level === 'LEVEL_1' ? 'Уровень 1' : 'Уровень 2'}
              </div>
              <div>
                <span className="font-medium">Этап:</span> {hypothesis.stage}
              </div>
              <div>
                <span className="font-medium">Статус:</span> {getStatusText(hypothesis.status)}
              </div>
              <div>
                <span className="font-medium">Дата:</span> {new Date(hypothesis.createdAt).toLocaleDateString('ru-RU')}
              </div>
              <div>
                <span className="font-medium">Идея:</span>
                <Link href={`/ideas/${hypothesis.idea}`} className="text-blue-600 hover:underline ml-1">
                  {hypothesis.idea.title}
                </Link>
              </div>
              {hypothesis.owner && (
                <div>
                  <span className="font-medium">Владелец гипотезы:</span> {hypothesis.owner.name} ({hypothesis.owner.role})
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Описание</h4>
            <div className="space-y-3 text-sm bg-gray-50 p-3 rounded">
              {hypothesis.actionDescription && (
                <div>
                  <span className="font-medium text-blue-700">Если мы сделаем...</span>
                  <p className="mt-1">{hypothesis.actionDescription}</p>
                </div>
              )}
              {hypothesis.expectedResult && (
                <div>
                  <span className="font-medium text-green-700">То произойдёт...</span>
                  <p className="mt-1">{hypothesis.expectedResult}</p>
                </div>
              )}
              {hypothesis.reasoning && (
                <div>
                  <span className="font-medium text-purple-700">Потому что...</span>
                  <p className="mt-1">{hypothesis.reasoning}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Правая колонка: Артефакты */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Артефакты</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-gray-700 bg-gray-100 p-2 rounded">
              <div>[ссылка]</div>
              <div>[вывод]</div>
            </div>
            {hypothesis.artifacts?.map((artifact) => (
              <div key={artifact.id} className="grid grid-cols-2 gap-2 text-sm border-b border-gray-100 pb-2">
                <div>
                  {artifact.url ? (
                    <a href={artifact.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {artifact.name}
                    </a>
                  ) : (
                    <span>{artifact.name}</span>
                  )}
                </div>
                <div className="text-gray-600">{artifact.conclusion}</div>
              </div>
            )) || (
              <div className="text-gray-500 text-sm italic">Артефакты не добавлены</div>
            )}
          </div>
        </div>
      </div>

      {/* ICE Оценки */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Оценка (кто?)</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-3 font-medium">Эксперт</th>
                <th className="text-center py-2 px-3 font-medium">Impact</th>
                <th className="text-center py-2 px-3 font-medium">Confidence</th>
                <th className="text-center py-2 px-3 font-medium">Ease</th>
              </tr>
            </thead>
            <tbody>
              {hypothesis.iceScores?.map((score) => (
                <tr key={score.id} className="border-b border-gray-100">
                  <td className="py-2 px-3">{score.user.name}</td>
                  <td className="py-2 px-3 text-center">{score.impact}</td>
                  <td className="py-2 px-3 text-center">{score.confidence}</td>
                  <td className="py-2 px-3 text-center">{score.ease}</td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={4} className="py-3 px-3 text-gray-500 italic text-center">
                    Оценки не добавлены
                  </td>
                </tr>
              )}
              {averageICE && (
                <tr className="bg-blue-50 font-medium">
                  <td className="py-2 px-3">Итого</td>
                  <td className="py-2 px-3 text-center">{averageICE.impact}</td>
                  <td className="py-2 px-3 text-center">{averageICE.confidence}</td>
                  <td className="py-2 px-3 text-center">{averageICE.ease}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Метрики и эксперимент */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Эксперимент</h4>
          <div className="space-y-1 text-sm">
            {hypothesis.northStarMetric && (
              <div>
                <span className="font-medium">Ведущая метрика:</span> {hypothesis.northStarMetric}
              </div>
            )}
            {hypothesis.successThreshold && (
              <div>
                <span className="font-medium">Порог успеха:</span> {hypothesis.successThreshold}
              </div>
            )}
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Результат эксперимента</h4>
          <div className="text-sm text-gray-500">
            {hypothesis.status === 'COMPLETED' || hypothesis.status === 'VALIDATED' || hypothesis.status === 'INVALIDATED'
              ? 'Результаты доступны'
              : 'Ожидается завершение эксперимента'
            }
          </div>
        </div>
      </div>

      {/* Заключение (для уровня 2) */}
      {hypothesis.level === 'LEVEL_2' && (hypothesis.conclusion || hypothesis.conclusionDescription) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Заключение</h4>
          {hypothesis.conclusion && (
            <div className="mb-2">
              <span className="font-medium">Результат:</span>
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                hypothesis.conclusion === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                hypothesis.conclusion === 'REFUTED' ? 'bg-red-100 text-red-800' :
                hypothesis.conclusion === 'PARTIALLY_CONFIRMED' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {hypothesis.conclusion === 'CONFIRMED' ? 'Подтверждена' :
                 hypothesis.conclusion === 'REFUTED' ? 'Опровергнута' :
                 hypothesis.conclusion === 'PARTIALLY_CONFIRMED' ? 'Частично подтверждена' :
                 'Неопределенно'}
              </span>
            </div>
          )}
          {hypothesis.conclusionDescription && (
            <div className="text-sm text-gray-700 mb-2">{hypothesis.conclusionDescription}</div>
          )}
          {hypothesis.recommendations && (
            <div className="text-sm">
              <span className="font-medium">Рекомендации:</span>
              <p className="mt-1 text-gray-700">{hypothesis.recommendations}</p>
            </div>
          )}
          {hypothesis.nextSteps && (
            <div className="text-sm mt-2">
              <span className="font-medium">Следующие шаги:</span>
              <p className="mt-1 text-gray-700">{hypothesis.nextSteps}</p>
            </div>
          )}
        </div>
      )}

      {/* Действия */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Создана {new Date(hypothesis.createdAt).toLocaleDateString('ru-RU')}
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/hypotheses/${hypothesis.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Подробнее
          </Link>
          {hypothesis.level === 'LEVEL_1' && hypothesis.status === 'SCORED' && (
            <Link
              href={`/hypotheses/${hypothesis.id}/transition`}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Перейти на уровень 2
            </Link>
          )}
          {hypothesis.level === 'LEVEL_2' && hypothesis.stage === 'DESK_RESEARCH' && (
            <Link
              href={`/hypotheses/${hypothesis.id}/experiment-design`}
              className="text-orange-600 hover:text-orange-800 text-sm font-medium"
            >
              Дизайн эксперимента
            </Link>
          )}
          {hypothesis.level === 'LEVEL_2' && hypothesis.stage === 'EXPERIMENT_DESIGN' && (
            <Link
              href={`/hypotheses/${hypothesis.id}/execute`}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              Провести эксперимент
            </Link>
          )}
          {hypothesis.level === 'LEVEL_2' && hypothesis.stage === 'EXPERIMENT_EXECUTION' && (
            <Link
              href={`/hypotheses/${hypothesis.id}/conclusion`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Сделать заключение
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}