"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Plus, Edit, Trash2, Shield, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

interface FormFieldConfig {
  id: string
  fieldName: string
  label: string
  fieldType: string
  isRequired: boolean
  isVisible: boolean
  stage: string
  hypothesisLevel: string
  position: number
  validationRules?: any
  defaultValue?: string
  options?: string[]
  createdAt: string
}

export default function AdminFieldsPage() {
  const { data: session } = useSession()
  const [fields, setFields] = useState<FormFieldConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [currentStage, setCurrentStage] = useState("FORMULATION")
  const [currentLevel, setCurrentLevel] = useState("LEVEL_1")

  const stages = [
    { value: "FORMULATION", label: "Формулирование" },
    { value: "DESK_RESEARCH", label: "Desk Research" },
    { value: "EXPERIMENT_DESIGN", label: "Дизайн эксперимента" },
    { value: "EXPERIMENT_EXECUTION", label: "Проведение эксперимента" },
    { value: "CONCLUSION", label: "Заключение" }
  ]

  const levels = [
    { value: "LEVEL_1", label: "Уровень 1" },
    { value: "LEVEL_2", label: "Уровень 2" }
  ]

  useEffect(() => {
    fetchFields()
  }, [currentStage, currentLevel])

  const fetchFields = async () => {
    try {
      const response = await fetch(`/api/admin/fields?stage=${currentStage}&level=${currentLevel}`)
      if (response.ok) {
        const data = await response.json()
        setFields(data)
      }
    } catch (error) {
      console.error("Error fetching fields:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFieldVisibility = async (fieldId: string, isVisible: boolean) => {
    try {
      const response = await fetch(`/api/admin/fields/${fieldId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !isVisible })
      })

      if (response.ok) {
        fetchFields()
      }
    } catch (error) {
      console.error("Error updating field:", error)
    }
  }

  const toggleFieldRequired = async (fieldId: string, isRequired: boolean) => {
    try {
      const response = await fetch(`/api/admin/fields/${fieldId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRequired: !isRequired })
      })

      if (response.ok) {
        fetchFields()
      }
    } catch (error) {
      console.error("Error updating field:", error)
    }
  }

  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "LAB_DIRECTOR") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Доступ запрещен</h2>
            <p className="text-gray-600">У вас нет прав для доступа к настройкам полей</p>
            <Link href="/dashboard" className="inline-block mt-4">
              <Button>Вернуться на главную</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/admin" className="text-2xl font-bold text-gray-900 mr-8">
                InLab CRM
              </Link>
              <h1 className="text-xl font-semibold text-gray-700">Управление полями форм</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="default">
                <Shield className="h-3 w-3 mr-1" />
                Администратор
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Фильтры */}
          <Card>
            <CardHeader>
              <CardTitle>Фильтры</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Этап
                  </label>
                  <select
                    value={currentStage}
                    onChange={(e) => setCurrentStage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {stages.map((stage) => (
                      <option key={stage.value} value={stage.value}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Уровень гипотезы
                  </label>
                  <select
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {levels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Действия */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Конфигурация полей</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить поле
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Сбросить к умолчанию
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                Настройте поля для этапа "{stages.find(s => s.value === currentStage)?.label}"
                и уровня "{levels.find(l => l.value === currentLevel)?.label}"
              </div>

              {loading ? (
                <div className="text-center py-8">Загрузка...</div>
              ) : fields.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Поля для данного этапа и уровня не настроены
                  <br />
                  <Button className="mt-4" size="sm">
                    Создать базовую конфигурацию
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="font-medium text-gray-900">{field.label}</h3>
                            <p className="text-sm text-gray-500">{field.fieldName}</p>
                          </div>
                          <Badge variant="outline">{field.fieldType}</Badge>
                          {field.isRequired && (
                            <Badge variant="default">Обязательное</Badge>
                          )}
                          {!field.isVisible && (
                            <Badge variant="secondary">Скрыто</Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Позиция: {field.position}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleFieldVisibility(field.id, field.isVisible)}
                        >
                          {field.isVisible ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant={field.isRequired ? "default" : "outline"}
                          onClick={() => toggleFieldRequired(field.id, field.isRequired)}
                        >
                          Обяз.
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Информация */}
          <Card>
            <CardHeader>
              <CardTitle>Описание этапов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Уровень 1</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Формулирование - базовые поля гипотезы</li>
                    <li>• ICE оценка от экспертов</li>
                    <li>• Решение о переходе на уровень 2</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Уровень 2</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Desk Research - исследование</li>
                    <li>• Дизайн эксперимента</li>
                    <li>• Проведение эксперимента</li>
                    <li>• Заключение и выводы</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}