"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DeskResearchProps {
  hypothesisId: string
  initialData: {
    notes?: string
    sources?: string[]
    targetAudience?: string
    businessImpact?: string
    risks?: string[]
    opportunities?: string[]
    researchDate?: Date | null
  }
  onSave: (data: any) => void
  onStatusChange: (status: string) => void
  disabled?: boolean
}

export function DeskResearch({
  hypothesisId,
  initialData,
  onSave,
  onStatusChange,
  disabled = false
}: DeskResearchProps) {
  const [data, setData] = useState({
    notes: initialData.notes || "",
    sources: initialData.sources?.join('\n') || "",
    targetAudience: initialData.targetAudience || "",
    businessImpact: initialData.businessImpact || "",
    risks: initialData.risks?.join('\n') || "",
    opportunities: initialData.opportunities?.join('\n') || ""
  })

  const [isEditing, setIsEditing] = useState(!disabled)

  const handleSave = () => {
    onSave({
      ...data,
      sources: data.sources.split('\n').filter(s => s.trim()),
      risks: data.risks.split('\n').filter(r => r.trim()),
      opportunities: data.opportunities.split('\n').filter(o => o.trim())
    })
    setIsEditing(false)
  }

  const handleCompleteResearch = () => {
    handleSave()
    onStatusChange("READY_FOR_TESTING")
  }

  return (
    <div className="space-y-6">
      {/* Теория Desk Research */}
      <Card className="bg-gradient-to-r from-indigo-50 to-cyan-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-900">🔍 Что такое Desk Research?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-indigo-800 space-y-3">
          <p><strong>Desk Research (кабинетное исследование)</strong> - это сбор и анализ уже существующих данных и информации без проведения новых исследований.</p>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-3 bg-white rounded border">
              <h4 className="font-medium text-indigo-900 mb-2">Что включает:</h4>
              <ul className="text-xs space-y-1">
                <li>• Анализ внутренних данных и метрик</li>
                <li>• Изучение исследований конкурентов</li>
                <li>• Обзор отраслевых отчетов</li>
                <li>• Анализ отзывов пользователей</li>
                <li>• Изучение best practices</li>
              </ul>
            </div>
            <div className="p-3 bg-white rounded border">
              <h4 className="font-medium text-indigo-900 mb-2">Цели этапа:</h4>
              <ul className="text-xs space-y-1">
                <li>• Проверить обоснованность гипотезы</li>
                <li>• Найти подтверждающие данные</li>
                <li>• Выявить риски и ограничения</li>
                <li>• Уточнить критерии успеха</li>
                <li>• Определить методы тестирования</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Форма Desk Research */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Результаты кабинетного исследования</CardTitle>
          <div className="flex gap-2">
            {initialData.researchDate && (
              <Badge variant="outline">
                Проведено: {new Date(initialData.researchDate).toLocaleDateString()}
              </Badge>
            )}
            {!disabled && !isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Редактировать
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ключевые находки и выводы
            </label>
            {isEditing ? (
              <textarea
                value={data.notes}
                onChange={(e) => setData({ ...data, notes: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Опишите ключевые данные, которые вы нашли:

• Статистика и метрики по теме
• Результаты похожих экспериментов
• Отзывы и поведение пользователей
• Анализ конкурентов и рынка
• Технические ограничения и возможности"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded border min-h-[120px]">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {data.notes || "Результаты исследования не заполнены"}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Источники данных и исследований
            </label>
            {isEditing ? (
              <textarea
                value={data.sources}
                onChange={(e) => setData({ ...data, sources: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Укажите источники (по одному на строке):

Google Analytics
Отчет исследования UX
Интервью с клиентами от 15.03.2024
Анализ конкурента X
Отраслевой отчет Y"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded border">
                {data.sources ? (
                  <ul className="space-y-1">
                    {data.sources.split('\n').filter(s => s.trim()).map((source, index) => (
                      <li key={index} className="text-gray-700">• {source}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Источники не указаны</p>
                )}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Выявленные риски
              </label>
              {isEditing ? (
                <textarea
                  value={data.risks}
                  onChange={(e) => setData({ ...data, risks: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Риски и ограничения (по одному на строке):

Технические сложности реализации
Высокая стоимость разработки
Негативная реакция пользователей
Конкурентные решения"
                />
              ) : (
                <div className="p-3 bg-red-50 rounded border min-h-[100px]">
                  {data.risks ? (
                    <ul className="space-y-1">
                      {data.risks.split('\n').filter(r => r.trim()).map((risk, index) => (
                        <li key={index} className="text-red-800">⚠️ {risk}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Риски не выявлены</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Возможности и преимущества
              </label>
              {isEditing ? (
                <textarea
                  value={data.opportunities}
                  onChange={(e) => setData({ ...data, opportunities: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Возможности (по одному на строке):

Большой интерес пользователей
Отсутствие у конкурентов
Простота реализации
Потенциал для роста"
                />
              ) : (
                <div className="p-3 bg-green-50 rounded border min-h-[100px]">
                  {data.opportunities ? (
                    <ul className="space-y-1">
                      {data.opportunities.split('\n').filter(o => o.trim()).map((opp, index) => (
                        <li key={index} className="text-green-800">✅ {opp}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Возможности не определены</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                Сохранить исследование
              </Button>
              <Button
                onClick={handleCompleteResearch}
                className="bg-green-600 hover:bg-green-700"
                disabled={!data.notes.trim()}
              >
                Завершить Desk Research
              </Button>
              {!disabled && (
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Отмена
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Чек-лист для Desk Research */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">📋 Чек-лист для качественного Desk Research</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-amber-800">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Источники данных:</h4>
              <ul className="space-y-1 text-xs">
                <li>☐ Внутренняя аналитика и метрики</li>
                <li>☐ Отзывы и обратная связь пользователей</li>
                <li>☐ Анализ конкурентов</li>
                <li>☐ Отраслевые исследования и отчеты</li>
                <li>☐ Экспертные мнения и интервью</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Результаты анализа:</h4>
              <ul className="space-y-1 text-xs">
                <li>☐ Подтверждение или опровержение гипотезы</li>
                <li>☐ Уточнение целевой аудитории</li>
                <li>☐ Определение методов тестирования</li>
                <li>☐ Выявление рисков и ограничений</li>
                <li>☐ Корректировка критериев успеха</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}