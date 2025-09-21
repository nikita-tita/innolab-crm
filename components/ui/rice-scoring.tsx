"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RiceScoringProps {
  reach: number
  impact: number
  confidence: number
  effort: number
  onScoreChange: (score: number, values: { reach: number, impact: number, confidence: number, effort: number }) => void
}

export function RiceScoring({ reach, impact, confidence, effort, onScoreChange }: RiceScoringProps) {
  const [values, setValues] = useState({
    reach: reach || 0,
    impact: impact || 1,
    confidence: confidence || 50,
    effort: effort || 1
  })

  const calculateScore = () => {
    if (values.reach > 0 && values.impact > 0 && values.confidence > 0 && values.effort > 0) {
      return Math.round((values.reach * values.impact * values.confidence) / values.effort)
    }
    return 0
  }

  useEffect(() => {
    const score = calculateScore()
    onScoreChange(score, values)
  }, [values, onScoreChange])

  const handleChange = (field: keyof typeof values, value: number) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getScoreColor = (score: number) => {
    if (score >= 100) return "text-green-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 100) return "🟢 Высокий приоритет"
    if (score >= 50) return "🟡 Средний приоритет"
    return "🔴 Низкий приоритет"
  }

  const score = calculateScore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>RICE Scoring для гипотезы</CardTitle>
        <p className="text-sm text-gray-600">
          Оцените гипотезу по методологии RICE для определения приоритета тестирования
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Reach */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Охват (Reach)
            </label>
            <input
              type="number"
              min="0"
              value={values.reach}
              onChange={(e) => handleChange('reach', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="1000"
            />
            <p className="mt-1 text-xs text-gray-500">
              Количество пользователей, затронутых экспериментом в месяц
            </p>
          </div>

          {/* Impact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Влияние (Impact)
            </label>
            <select
              value={values.impact}
              onChange={(e) => handleChange('impact', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={1}>1 - Минимальное</option>
              <option value={2}>2 - Низкое</option>
              <option value={3}>3 - Среднее</option>
              <option value={4}>4 - Высокое</option>
              <option value={5}>5 - Максимальное</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Сила воздействия на пользователя при подтверждении гипотезы
            </p>
          </div>

          {/* Confidence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Уверенность (Confidence)
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="10"
                max="100"
                step="10"
                value={values.confidence}
                onChange={(e) => handleChange('confidence', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center">
                <span className="text-sm font-medium text-gray-700">{values.confidence}%</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Уверенность в том, что гипотеза подтвердится
            </p>
          </div>

          {/* Effort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Затраты (Effort)
            </label>
            <input
              type="number"
              min="1"
              value={values.effort}
              onChange={(e) => handleChange('effort', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="5"
            />
            <p className="mt-1 text-xs text-gray-500">
              Человеко-дни для проведения эксперимента
            </p>
          </div>
        </div>

        {/* RICE Score Display */}
        <div className="border-t pt-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">RICE Score</h3>
                <p className="text-sm text-gray-600 mt-1">
                  ({values.reach} × {values.impact} × {values.confidence}%) ÷ {values.effort}
                </p>
                {score > 0 && (
                  <p className="text-sm mt-2 font-medium">
                    {getScoreLabel(score)}
                  </p>
                )}
              </div>
              <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                {score}
              </div>
            </div>
          </div>
        </div>

        {/* RICE Theory */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-md p-4 mb-4">
          <h4 className="text-sm font-medium text-purple-900 mb-3">📊 Методология RICE Scoring</h4>
          <div className="grid md:grid-cols-2 gap-4 text-xs text-purple-800">
            <div>
              <h5 className="font-medium mb-2">Как работает RICE:</h5>
              <ul className="space-y-1">
                <li>• <strong>Reach</strong> - количество людей, затронутых изменением</li>
                <li>• <strong>Impact</strong> - сила воздействия на каждого пользователя</li>
                <li>• <strong>Confidence</strong> - уверенность в оценках</li>
                <li>• <strong>Effort</strong> - ресурсы для реализации</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">Формула расчета:</h5>
              <p className="bg-white p-2 rounded border font-mono text-center">
                Score = (Reach × Impact × Confidence) ÷ Effort
              </p>
              <p className="mt-2 text-xs">Чем выше score, тем выше приоритет</p>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Интерпретация RICE Score:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>100+</strong> - Высокий приоритет для тестирования</li>
            <li>• <strong>50-99</strong> - Средний приоритет, рассмотреть после высокоприоритетных</li>
            <li>• <strong>&lt;50</strong> - Низкий приоритет, отложить или пересмотреть</li>
            <li>• Сравнивайте scores разных гипотез для приоритизации</li>
          </ul>
        </div>

        {/* Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-yellow-900 mb-2">⚡ Советы по оценке:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>Reach:</strong> Используйте реальные данные аналитики</li>
            <li>• <strong>Impact:</strong> Оценивайте потенциальное улучшение метрик</li>
            <li>• <strong>Confidence:</strong> Основывайтесь на исследованиях и данных</li>
            <li>• <strong>Effort:</strong> Учитывайте все этапы: подготовка, запуск, анализ</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}