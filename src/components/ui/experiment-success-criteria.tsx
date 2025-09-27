"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  X,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Save,
  Trash2
} from "lucide-react"

interface ExperimentSuccessCriteria {
  id?: string
  name: string
  planValue: string
  actualValue?: string
  unit?: string
  isAchieved?: boolean
  notes?: string
}

interface ExperimentSuccessCriteriaProps {
  experimentId: string
  initialCriteria?: ExperimentSuccessCriteria[]
  onSave?: (criteria: ExperimentSuccessCriteria[]) => Promise<void>
  disabled?: boolean
  showActualValues?: boolean // Показывать ли фактические значения (во время/после эксперимента)
}

export function ExperimentSuccessCriteriaManager({
  experimentId,
  initialCriteria = [],
  onSave,
  disabled = false,
  showActualValues = false
}: ExperimentSuccessCriteriaProps) {
  const [criteria, setCriteria] = useState<ExperimentSuccessCriteria[]>(initialCriteria)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newCriterion, setNewCriterion] = useState<ExperimentSuccessCriteria>({
    name: "",
    planValue: "",
    unit: ""
  })
  const [isSaving, setIsSaving] = useState(false)

  const addCriterion = () => {
    if (!newCriterion.name.trim() || !newCriterion.planValue.trim()) return

    const criterion = {
      ...newCriterion,
      id: `temp-${Date.now()}`
    }

    setCriteria([...criteria, criterion])
    setNewCriterion({ name: "", planValue: "", unit: "" })
  }

  const updateCriterion = (id: string, updates: Partial<ExperimentSuccessCriteria>) => {
    setCriteria(criteria.map(c =>
      c.id === id ? { ...c, ...updates } : c
    ))
  }

  const deleteCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave?.(criteria)
    } finally {
      setIsSaving(false)
    }
  }

  const getAchievementStatus = (criterion: ExperimentSuccessCriteria) => {
    if (!showActualValues || !criterion.actualValue) return "pending"
    if (criterion.isAchieved === true) return "achieved"
    if (criterion.isAchieved === false) return "failed"
    return "measured"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "achieved": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed": return <XCircle className="h-4 w-4 text-red-600" />
      case "measured": return <Clock className="h-4 w-4 text-blue-600" />
      default: return <Target className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "achieved": return <Badge className="bg-green-100 text-green-800">Достигнут</Badge>
      case "failed": return <Badge className="bg-red-100 text-red-800">Не достигнут</Badge>
      case "measured": return <Badge className="bg-blue-100 text-blue-800">Измерен</Badge>
      default: return <Badge variant="outline">Планируется</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Критерии успеха эксперимента
          </CardTitle>
          <p className="text-sm text-gray-600">
            Определите конкретные показатели для оценки успешности эксперимента
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Список существующих критериев */}
          {criteria.length > 0 && (
            <div className="space-y-3">
              {criteria.map((criterion) => {
                const status = getAchievementStatus(criterion)
                const isEditing = editingId === criterion.id

                return (
                  <div key={criterion.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        {isEditing ? (
                          <div className="space-y-3">
                            <div>
                              <Label>Название критерия</Label>
                              <Input
                                value={criterion.name}
                                onChange={(e) => updateCriterion(criterion.id!, { name: e.target.value })}
                                placeholder="Например: Конверсия в регистрацию"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label>Планируемое значение</Label>
                                <Input
                                  value={criterion.planValue}
                                  onChange={(e) => updateCriterion(criterion.id!, { planValue: e.target.value })}
                                  placeholder="Например: 15% или 50 пользователей"
                                />
                              </div>
                              <div>
                                <Label>Единица измерения (опционально)</Label>
                                <Input
                                  value={criterion.unit || ""}
                                  onChange={(e) => updateCriterion(criterion.id!, { unit: e.target.value })}
                                  placeholder="%, шт, руб"
                                />
                              </div>
                            </div>
                            {showActualValues && (
                              <div className="space-y-3 p-3 bg-blue-50 rounded">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <Label>Фактическое значение</Label>
                                    <Input
                                      value={criterion.actualValue || ""}
                                      onChange={(e) => updateCriterion(criterion.id!, { actualValue: e.target.value })}
                                      placeholder="Измеренный результат"
                                    />
                                  </div>
                                  <div>
                                    <Label>Статус достижения</Label>
                                    <select
                                      value={criterion.isAchieved === null ? "" : criterion.isAchieved?.toString()}
                                      onChange={(e) => {
                                        const value = e.target.value === "" ? null : e.target.value === "true"
                                        updateCriterion(criterion.id!, { isAchieved: value })
                                      }}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                      <option value="">Не определено</option>
                                      <option value="true">Достигнут</option>
                                      <option value="false">Не достигнут</option>
                                    </select>
                                  </div>
                                </div>
                                <div>
                                  <Label>Заметки</Label>
                                  <Textarea
                                    value={criterion.notes || ""}
                                    onChange={(e) => updateCriterion(criterion.id!, { notes: e.target.value })}
                                    placeholder="Дополнительные комментарии к результату"
                                    rows={2}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(status)}
                              <h4 className="font-medium">{criterion.name}</h4>
                              {getStatusBadge(status)}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>
                                <span className="font-medium">План:</span> {criterion.planValue}
                                {criterion.unit && ` ${criterion.unit}`}
                              </div>
                              {showActualValues && criterion.actualValue && (
                                <div>
                                  <span className="font-medium">Факт:</span> {criterion.actualValue}
                                  {criterion.unit && ` ${criterion.unit}`}
                                </div>
                              )}
                              {criterion.notes && (
                                <div>
                                  <span className="font-medium">Заметки:</span> {criterion.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {isEditing ? (
                          <Button
                            size="sm"
                            onClick={() => setEditingId(null)}
                            className="flex items-center gap-1"
                          >
                            <Save className="h-3 w-3" />
                            Готово
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingId(criterion.id!)}
                              disabled={disabled}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteCriterion(criterion.id!)}
                              disabled={disabled}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Добавление нового критерия */}
          {!disabled && (
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <h4 className="font-medium mb-3">Добавить критерий успеха</h4>
              <div className="space-y-3">
                <div>
                  <Label>Название критерия</Label>
                  <Input
                    value={newCriterion.name}
                    onChange={(e) => setNewCriterion({ ...newCriterion, name: e.target.value })}
                    placeholder="Например: Конверсия в покупку"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Планируемое значение</Label>
                    <Input
                      value={newCriterion.planValue}
                      onChange={(e) => setNewCriterion({ ...newCriterion, planValue: e.target.value })}
                      placeholder="Например: 5% или 100 заказов"
                    />
                  </div>
                  <div>
                    <Label>Единица измерения (опционально)</Label>
                    <Input
                      value={newCriterion.unit || ""}
                      onChange={(e) => setNewCriterion({ ...newCriterion, unit: e.target.value })}
                      placeholder="%, шт, руб"
                    />
                  </div>
                </div>
                <Button
                  onClick={addCriterion}
                  disabled={!newCriterion.name.trim() || !newCriterion.planValue.trim()}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Добавить критерий
                </Button>
              </div>
            </div>
          )}

          {/* Кнопка сохранения */}
          {!disabled && criteria.length > 0 && (
            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Сохранение..." : "Сохранить критерии"}
              </Button>
            </div>
          )}

          {/* Пустое состояние */}
          {criteria.length === 0 && disabled && (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Критерии успеха пока не определены</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}