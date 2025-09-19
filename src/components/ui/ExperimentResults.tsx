"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

interface ExperimentResult {
  id: string
  metricName: string
  value: number
  unit: string
  notes?: string
  createdAt: string
}

interface SuccessCriteria {
  id: string
  name: string
  description?: string
  targetValue: number
  actualValue?: number
  unit: string
  achieved: boolean
}

interface ExperimentResultsProps {
  experimentId: string
  experimentTitle: string
  successCriteria?: SuccessCriteria[]
  onResultsChange?: () => void
}

export default function ExperimentResults({
  experimentId,
  experimentTitle,
  successCriteria = [],
  onResultsChange
}: ExperimentResultsProps) {
  const { data: session } = useSession()
  const [results, setResults] = useState<ExperimentResult[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    metricName: "",
    value: "",
    unit: "",
    notes: ""
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchResults()
  }, [experimentId])

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/experiments/${experimentId}/results`)
      if (response.ok) {
        const data = await response.json()
        setResults(data)
      }
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.metricName || !formData.value || !formData.unit) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/experiments/${experimentId}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metricName: formData.metricName,
          value: parseFloat(formData.value),
          unit: formData.unit,
          notes: formData.notes || null
        })
      })

      if (response.ok) {
        const newResult = await response.json()
        setResults(prev => [newResult, ...prev])
        setFormData({ metricName: "", value: "", unit: "", notes: "" })
        setShowAddForm(false)
        onResultsChange?.()
      } else {
        alert('Ошибка при добавлении результата')
      }
    } catch (error) {
      console.error('Error adding result:', error)
      alert('Ошибка при добавлении результата')
    } finally {
      setSubmitting(false)
    }
  }

  const deleteResult = async (resultId: string) => {
    if (!confirm('Удалить этот результат?')) return

    try {
      const response = await fetch(`/api/experiments/${experimentId}/results?resultId=${resultId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setResults(prev => prev.filter(r => r.id !== resultId))
        onResultsChange?.()
      } else {
        alert('Ошибка при удалении результата')
      }
    } catch (error) {
      console.error('Error deleting result:', error)
      alert('Ошибка при удалении результата')
    }
  }

  const getResultIcon = (metricName: string) => {
    const name = metricName.toLowerCase()
    if (name.includes('конверсия') || name.includes('conversion')) return '📈'
    if (name.includes('время') || name.includes('time')) return '⏱️'
    if (name.includes('клик') || name.includes('click')) return '👆'
    if (name.includes('пользователь') || name.includes('user')) return '👥'
    if (name.includes('доход') || name.includes('revenue')) return '💰'
    if (name.includes('nps') || name.includes('удовлетворенность')) return '😊'
    return '📊'
  }

  const findMatchingCriteria = (result: ExperimentResult) => {
    return successCriteria.find(criteria =>
      criteria.name.toLowerCase().includes(result.metricName.toLowerCase()) ||
      result.metricName.toLowerCase().includes(criteria.name.toLowerCase())
    )
  }

  const getResultStatus = (result: ExperimentResult) => {
    const criteria = findMatchingCriteria(result)
    if (!criteria) return 'neutral'

    return result.value >= criteria.targetValue ? 'success' : 'failure'
  }

  const getResultStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200'
      case 'failure': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const getResultStatusText = (status: string) => {
    switch (status) {
      case 'success': return '✅ Цель достигнута'
      case 'failure': return '❌ Цель не достигнута'
      default: return '📊 Данные собраны'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="text-center py-4">Загрузка результатов...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="text-2xl mr-2">📊</span>
          Результаты эксперимента
        </h3>
        {session && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <span className="mr-2">➕</span>
            Добавить результат
          </button>
        )}
      </div>

      {/* Add Result Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-4">Новый результат</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название метрики
                </label>
                <input
                  type="text"
                  value={formData.metricName}
                  onChange={(e) => setFormData(prev => ({ ...prev, metricName: e.target.value }))}
                  placeholder="Конверсия, Время на сайте, NPS..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Значение
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="25.3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Единица измерения
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="%, сек, баллы, количество..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Комментарии (опционально)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Дополнительные наблюдения или контекст..."
                rows={2}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
              >
                {submitting ? 'Добавление...' : 'Добавить'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success Criteria Reference */}
      {successCriteria.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 mb-3 flex items-center">
            <span className="mr-2">🎯</span>
            Критерии успеха
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {successCriteria.map((criteria) => (
              <div key={criteria.id} className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{criteria.name}</span>
                  <span className="text-blue-600 font-semibold">
                    ≥ {criteria.targetValue} {criteria.unit}
                  </span>
                </div>
                {criteria.description && (
                  <p className="text-sm text-gray-600 mt-1">{criteria.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results List */}
      <div className="space-y-4">
        {results.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl mb-3 block">📊</span>
            <h4 className="font-medium text-gray-900 mb-2">Результаты еще не добавлены</h4>
            <p className="text-gray-500 mb-4">
              Добавьте первый результат для анализа эффективности эксперимента
            </p>
          </div>
        ) : (
          results.map((result) => {
            const status = getResultStatus(result)
            const criteria = findMatchingCriteria(result)

            return (
              <div key={result.id} className={`border-2 rounded-lg p-4 transition-all duration-200 ${getResultStatusColor(status)}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{getResultIcon(result.metricName)}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{result.metricName}</h4>
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-bold text-gray-900">
                            {result.value} {result.unit}
                          </span>
                          {criteria && (
                            <span className="text-sm text-gray-600">
                              Цель: {criteria.targetValue} {criteria.unit}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {criteria && (
                      <div className="mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getResultStatusColor(status)}`}>
                          {getResultStatusText(status)}
                        </span>
                        {status !== 'neutral' && (
                          <span className="ml-2 text-sm text-gray-600">
                            {status === 'success'
                              ? `+${((result.value - criteria.targetValue) / criteria.targetValue * 100).toFixed(1)}% от цели`
                              : `${((result.value - criteria.targetValue) / criteria.targetValue * 100).toFixed(1)}% от цели`
                            }
                          </span>
                        )}
                      </div>
                    )}

                    {result.notes && (
                      <p className="text-sm text-gray-700 bg-white bg-opacity-50 rounded px-3 py-2 mt-2">
                        💬 {result.notes}
                      </p>
                    )}

                    <div className="text-xs text-gray-500 mt-2">
                      Добавлено: {new Date(result.createdAt).toLocaleString('ru-RU')}
                    </div>
                  </div>

                  {session && (
                    <button
                      onClick={() => deleteResult(result.id)}
                      className="text-red-600 hover:text-red-800 ml-4 p-1 transition-colors duration-200"
                      title="Удалить результат"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Summary */}
      {results.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Сводка результатов</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Всего метрик:</span>
              <span className="ml-2 font-semibold">{results.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Достигнуто целей:</span>
              <span className="ml-2 font-semibold text-green-600">
                {results.filter(r => getResultStatus(r) === 'success').length}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Не достигнуто:</span>
              <span className="ml-2 font-semibold text-red-600">
                {results.filter(r => getResultStatus(r) === 'failure').length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}