"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

interface Insight {
  type: string
  title: string
  description: string
  icon: string
}

interface Recommendation {
  priority: string
  action: string
  description: string
  timeframe: string
}

interface AnalysisData {
  experiment: {
    id: string
    title: string
    status: string
    type: string
  }
  hypothesis: {
    id: string
    title: string
    statement: string
    currentStatus: string
    recommendedStatus: string
    statusReason: string
  }
  metrics: {
    totalResults: number
    totalCriteria: number
    achievedCriteria: number
    successRate: number
    statisticalSignificance: string
  }
  criteriaAnalysis: Array<{
    id: string
    name: string
    targetValue: number
    actualValue: number | null
    achieved: boolean
    achievement: number
    unit: string
  }>
  insights: Insight[]
  recommendations: Recommendation[]
  nextSteps: string[]
  generatedAt: string
}

interface ExperimentAnalysisProps {
  experimentId: string
  onStatusUpdate?: (newStatus: string) => void
}

export default function ExperimentAnalysis({ experimentId, onStatusUpdate }: ExperimentAnalysisProps) {
  const { data: session } = useSession()
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchAnalysis()
  }, [experimentId])

  const fetchAnalysis = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/experiments/${experimentId}/analysis`)

      if (!response.ok) {
        throw new Error('Failed to fetch analysis')
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      setError('Ошибка при загрузке анализа')
      console.error('Error fetching analysis:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!analysis || !session) return

    setUpdatingStatus(true)
    try {
      const response = await fetch(`/api/hypotheses/${analysis.hypothesis.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setAnalysis(prev => prev ? {
          ...prev,
          hypothesis: { ...prev.hypothesis, currentStatus: newStatus }
        } : null)
        onStatusUpdate?.(newStatus)
      } else {
        alert('Ошибка при обновлении статуса')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Ошибка при обновлении статуса')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800'
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'mixed': return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'info': return 'bg-gray-50 border-gray-200 text-gray-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatisticalSignificanceText = (significance: string) => {
    switch (significance) {
      case 'significant': return { text: 'Статистически значимо', color: 'text-green-600' }
      case 'moderate': return { text: 'Умеренная значимость', color: 'text-yellow-600' }
      case 'insufficient_data': return { text: 'Недостаточно данных', color: 'text-gray-600' }
      default: return { text: 'Не определено', color: 'text-gray-600' }
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Генерируем анализ...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="text-center py-8">
          <span className="text-red-600">⚠️ {error}</span>
          <button
            onClick={fetchAnalysis}
            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  if (!analysis) return null

  const { metrics, insights, recommendations, nextSteps, criteriaAnalysis } = analysis
  const significance = getStatisticalSignificanceText(metrics.statisticalSignificance)

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <span className="text-2xl mr-2">🔍</span>
            Автоматический анализ эксперимента
          </h3>
          <div className="text-xs text-gray-500">
            Сгенерировано: {new Date(analysis.generatedAt).toLocaleString('ru-RU')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{metrics.successRate}%</div>
            <div className="text-sm text-blue-800">Общий успех</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{metrics.achievedCriteria}</div>
            <div className="text-sm text-green-800">Достигнуто целей</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{metrics.totalResults}</div>
            <div className="text-sm text-purple-800">Метрик собрано</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className={`text-sm font-medium ${significance.color}`}>{significance.text}</div>
            <div className="text-xs text-gray-600">Статистика</div>
          </div>
        </div>

        {/* Status Recommendation */}
        {analysis.hypothesis.recommendedStatus !== analysis.hypothesis.currentStatus && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-amber-800 mb-1">
                  💡 Рекомендация по статусу гипотезы
                </h4>
                <p className="text-sm text-amber-700 mb-2">
                  {analysis.hypothesis.statusReason}
                </p>
                <p className="text-xs text-amber-600">
                  Текущий статус: <span className="font-medium">{analysis.hypothesis.currentStatus}</span> →
                  Рекомендуемый: <span className="font-medium">{analysis.hypothesis.recommendedStatus}</span>
                </p>
              </div>
              {session && (
                <button
                  onClick={() => handleStatusUpdate(analysis.hypothesis.recommendedStatus)}
                  disabled={updatingStatus}
                  className="bg-amber-600 text-white px-3 py-1 rounded text-sm hover:bg-amber-700 disabled:opacity-50"
                >
                  {updatingStatus ? 'Обновляем...' : 'Применить'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Criteria Analysis */}
      {criteriaAnalysis.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-xl mr-2">📊</span>
            Анализ критериев успеха
          </h4>
          <div className="space-y-3">
            {criteriaAnalysis.map((criteria) => (
              <div key={criteria.id} className={`border-2 rounded-lg p-4 ${
                criteria.achieved ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium text-gray-900">{criteria.name}</h5>
                    <div className="text-sm text-gray-600 mt-1">
                      Цель: {criteria.targetValue} {criteria.unit}
                      {criteria.actualValue !== null && (
                        <> • Результат: {criteria.actualValue} {criteria.unit}</>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      criteria.achieved ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {criteria.achieved ? '✅' : '❌'}
                    </div>
                    {criteria.actualValue !== null && (
                      <div className="text-sm text-gray-600">
                        {criteria.achievement.toFixed(0)}% от цели
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-xl mr-2">💡</span>
            Ключевые инсайты
          </h4>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className={`border rounded-lg p-4 ${getInsightTypeColor(insight.type)}`}>
                <div className="flex items-start">
                  <span className="text-xl mr-3 flex-shrink-0">{insight.icon}</span>
                  <div>
                    <h5 className="font-medium mb-1">{insight.title}</h5>
                    <p className="text-sm">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-xl mr-2">🎯</span>
            Рекомендации
          </h4>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-900">{rec.action}</h5>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                <div className="text-xs text-gray-500">
                  ⏱️ Временные рамки: {rec.timeframe}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {nextSteps.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-xl mr-2">📋</span>
            Следующие шаги
          </h4>
          <div className="space-y-2">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center mr-3 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}