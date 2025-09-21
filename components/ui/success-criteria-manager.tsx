"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Check, X, Target, TrendingUp } from "lucide-react"

interface SuccessCriteria {
  id: string
  name: string
  description: string
  targetValue: number
  unit: string
  actualValue?: number
  status: "not_set" | "in_progress" | "achieved" | "failed"
  priority: "high" | "medium" | "low"
}

interface SuccessCriteriaManagerProps {
  hypothesisId: string
  initialCriteria: SuccessCriteria[]
  onSave: (criteria: SuccessCriteria[]) => void
  disabled?: boolean
  showProgress?: boolean
}

export function SuccessCriteriaManager({
  hypothesisId,
  initialCriteria,
  onSave,
  disabled = false,
  showProgress = false
}: SuccessCriteriaManagerProps) {
  const [criteria, setCriteria] = useState<SuccessCriteria[]>(initialCriteria)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newCriteria, setNewCriteria] = useState<Partial<SuccessCriteria>>({
    name: "",
    description: "",
    targetValue: 0,
    unit: "%",
    priority: "medium",
    status: "not_set"
  })

  const handleAddCriteria = () => {
    if (!newCriteria.name || !newCriteria.description) return

    const criteria_item: SuccessCriteria = {
      id: Date.now().toString(),
      name: newCriteria.name,
      description: newCriteria.description,
      targetValue: newCriteria.targetValue || 0,
      unit: newCriteria.unit || "%",
      priority: newCriteria.priority as "high" | "medium" | "low",
      status: "not_set"
    }

    setCriteria([...criteria, criteria_item])
    setNewCriteria({
      name: "",
      description: "",
      targetValue: 0,
      unit: "%",
      priority: "medium",
      status: "not_set"
    })
    setIsAdding(false)
    onSave([...criteria, criteria_item])
  }

  const handleUpdateCriteria = (id: string, updates: Partial<SuccessCriteria>) => {
    const updated = criteria.map(c => c.id === id ? { ...c, ...updates } : c)
    setCriteria(updated)
    onSave(updated)
    setIsEditing(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "achieved": return "bg-green-100 text-green-800"
      case "failed": return "bg-red-100 text-red-800"
      case "in_progress": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "achieved": return "Достигнут"
      case "failed": return "Не достигнут"
      case "in_progress": return "В процессе"
      default: return "Не установлен"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const achievedCount = criteria.filter(c => c.status === "achieved").length
  const totalCount = criteria.length
  const successRate = totalCount > 0 ? Math.round((achievedCount / totalCount) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Теория критериев успеха */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">🎯 Что такое критерии успеха?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-green-800 space-y-3">
          <p><strong>Критерии успеха</strong> - это конкретные, измеримые показатели, которые определяют, подтвердилась ли ваша гипотеза.</p>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="p-3 bg-white rounded border">
              <h4 className="font-medium text-green-900 mb-2">Принципы SMART:</h4>
              <ul className="text-xs space-y-1">
                <li>• <strong>S</strong>pecific - Конкретные</li>
                <li>• <strong>M</strong>easurable - Измеримые</li>
                <li>• <strong>A</strong>chievable - Достижимые</li>
                <li>• <strong>R</strong>elevant - Релевантные</li>
                <li>• <strong>T</strong>ime-bound - Ограниченные во времени</li>
              </ul>
            </div>
            <div className="p-3 bg-white rounded border">
              <h4 className="font-medium text-green-900 mb-2">Типы метрик:</h4>
              <ul className="text-xs space-y-1">
                <li>• Количественные (число, %)</li>
                <li>• Качественные (NPS, отзывы)</li>
                <li>• Поведенческие (клики, время)</li>
                <li>• Бизнес-метрики (выручка, LTV)</li>
                <li>• Технические (скорость, ошибки)</li>
              </ul>
            </div>
            <div className="p-3 bg-white rounded border">
              <h4 className="font-medium text-green-900 mb-2">Примеры:</h4>
              <ul className="text-xs space-y-1">
                <li>• Конверсия увеличится на 15%</li>
                <li>• NPS вырастет с 6 до 8</li>
                <li>• Время загрузки < 2 сек</li>
                <li>• 80% пользователей используют функцию</li>
                <li>• Выручка вырастет на $10K</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Прогресс по критериям */}
      {showProgress && totalCount > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Прогресс по критериям успеха
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-blue-800">
                Достигнуто {achievedCount} из {totalCount} критериев
              </span>
              <Badge variant={successRate >= 80 ? "default" : successRate >= 50 ? "secondary" : "destructive"}>
                {successRate}% успеха
              </Badge>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  successRate >= 80 ? "bg-green-500" : successRate >= 50 ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${successRate}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Список критериев */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Критерии успеха гипотезы</CardTitle>
          {!disabled && (
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить критерий
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {criteria.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Критерии успеха не определены</p>
              <p className="text-sm mt-2">Добавьте первый критерий для измерения результатов</p>
            </div>
          ) : (
            criteria.map((criterion) => (
              <div key={criterion.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{criterion.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{criterion.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge className={getPriorityColor(criterion.priority)}>
                      {criterion.priority === "high" ? "Высокий" : criterion.priority === "medium" ? "Средний" : "Низкий"}
                    </Badge>
                    <Badge className={getStatusColor(criterion.status)}>
                      {getStatusText(criterion.status)}
                    </Badge>
                    {!disabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(criterion.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Цель:</span>
                    <p className="text-gray-900">{criterion.targetValue}{criterion.unit}</p>
                  </div>
                  {criterion.actualValue !== undefined && (
                    <div>
                      <span className="font-medium text-gray-700">Факт:</span>
                      <p className={`font-medium ${
                        criterion.actualValue >= criterion.targetValue ? "text-green-600" : "text-red-600"
                      }`}>
                        {criterion.actualValue}{criterion.unit}
                      </p>
                    </div>
                  )}
                  {criterion.actualValue !== undefined && (
                    <div>
                      <span className="font-medium text-gray-700">Отклонение:</span>
                      <p className={`font-medium ${
                        criterion.actualValue >= criterion.targetValue ? "text-green-600" : "text-red-600"
                      }`}>
                        {criterion.actualValue >= criterion.targetValue ? "+" : ""}
                        {((criterion.actualValue - criterion.targetValue) / criterion.targetValue * 100).toFixed(1)}%
                      </p>
                    </div>
                  )}
                </div>

                {isEditing === criterion.id && (
                  <div className="border-t pt-3 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Фактическое значение
                        </label>
                        <input
                          type="number"
                          defaultValue={criterion.actualValue || ""}
                          onChange={(e) => {
                            const actualValue = parseFloat(e.target.value)
                            const newStatus = actualValue >= criterion.targetValue ? "achieved" : "failed"
                            handleUpdateCriteria(criterion.id, {
                              actualValue: isNaN(actualValue) ? undefined : actualValue,
                              status: isNaN(actualValue) ? "in_progress" : newStatus
                            })
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Введите значение"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Статус
                        </label>
                        <select
                          defaultValue={criterion.status}
                          onChange={(e) => handleUpdateCriteria(criterion.id, { status: e.target.value as any })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="not_set">Не установлен</option>
                          <option value="in_progress">В процессе</option>
                          <option value="achieved">Достигнут</option>
                          <option value="failed">Не достигнут</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setIsEditing(null)}>
                        <Check className="h-4 w-4 mr-1" />
                        Готово
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Форма добавления нового критерия */}
          {isAdding && (
            <div className="border-2 border-dashed border-green-300 rounded-lg p-4 space-y-4">
              <h4 className="font-medium text-green-900">Новый критерий успеха</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название критерия
                  </label>
                  <input
                    type="text"
                    value={newCriteria.name || ""}
                    onChange={(e) => setNewCriteria({ ...newCriteria, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Например: Увеличение конверсии"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Приоритет
                  </label>
                  <select
                    value={newCriteria.priority || "medium"}
                    onChange={(e) => setNewCriteria({ ...newCriteria, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="high">Высокий</option>
                    <option value="medium">Средний</option>
                    <option value="low">Низкий</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  value={newCriteria.description || ""}
                  onChange={(e) => setNewCriteria({ ...newCriteria, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Подробное описание того, что измеряется"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Целевое значение
                  </label>
                  <input
                    type="number"
                    value={newCriteria.targetValue || ""}
                    onChange={(e) => setNewCriteria({ ...newCriteria, targetValue: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Единица измерения
                  </label>
                  <select
                    value={newCriteria.unit || "%"}
                    onChange={(e) => setNewCriteria({ ...newCriteria, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="%">%</option>
                    <option value="шт">шт</option>
                    <option value="руб">руб</option>
                    <option value="сек">сек</option>
                    <option value="баллы">баллы</option>
                    <option value="пользователи">пользователи</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleAddCriteria} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Добавить критерий
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  <X className="h-4 w-4 mr-1" />
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Советы по критериям успеха */}
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900">💡 Советы по созданию критериев успеха</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-purple-800">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Хорошие критерии:</h4>
              <ul className="space-y-1 text-xs">
                <li>✅ Конкретные числовые значения</li>
                <li>✅ Связаны с бизнес-целями</li>
                <li>✅ Можно измерить объективно</li>
                <li>✅ Имеют временные рамки</li>
                <li>✅ Реалистичны и достижимы</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Избегайте:</h4>
              <ul className="space-y-1 text-xs">
                <li>❌ Размытых формулировок</li>
                <li>❌ Слишком амбициозных целей</li>
                <li>❌ Метрик, которые сложно измерить</li>
                <li>❌ Критериев без временных рамок</li>
                <li>❌ Слишком большого количества метрик</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}