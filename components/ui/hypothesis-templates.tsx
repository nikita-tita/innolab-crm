"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HypothesisTemplate {
  id: string
  name: string
  category: string
  template: string
  description: string
  variables: string[]
}

const templates: HypothesisTemplate[] = [
  {
    id: "conversion-optimization",
    name: "Оптимизация конверсии",
    category: "Продукт",
    template: "Если мы изменим {element} на {new_design}, то конверсия {target_metric} увеличится на {expected_improvement}%, потому что {reasoning}",
    description: "Для тестирования изменений в UX/UI элементах с целью улучшения конверсии",
    variables: ["element", "new_design", "target_metric", "expected_improvement", "reasoning"]
  },
  {
    id: "user-engagement",
    name: "Вовлеченность пользователей",
    category: "Продукт",
    template: "Если мы добавим функцию {feature}, то {user_segment} будет проводить на {time_increase}% больше времени в продукте, потому что {value_proposition}",
    description: "Для тестирования новых функций, направленных на увеличение вовлеченности",
    variables: ["feature", "user_segment", "time_increase", "value_proposition"]
  },
  {
    id: "pricing-strategy",
    name: "Ценовая стратегия",
    category: "Монетизация",
    template: "Если мы изменим цену {product} с {current_price} на {new_price}, то выручка увеличится на {revenue_increase}%, потому что {market_reasoning}",
    description: "Для тестирования изменений в ценовой политике",
    variables: ["product", "current_price", "new_price", "revenue_increase", "market_reasoning"]
  },
  {
    id: "onboarding-flow",
    name: "Процесс онбординга",
    category: "Продукт",
    template: "Если мы упростим онбординг, убрав {removed_steps} и добавив {added_elements}, то завершение онбординга увеличится на {completion_rate}%, потому что {user_friction_reason}",
    description: "Для оптимизации процесса знакомства новых пользователей с продуктом",
    variables: ["removed_steps", "added_elements", "completion_rate", "user_friction_reason"]
  },
  {
    id: "marketing-channel",
    name: "Маркетинговый канал",
    category: "Маркетинг",
    template: "Если мы запустим рекламу в {channel} с бюджетом {budget} и креативом {creative_type}, то привлечем {new_users} новых пользователей с CAC {target_cac}, потому что {channel_hypothesis}",
    description: "Для тестирования эффективности новых каналов привлечения",
    variables: ["channel", "budget", "creative_type", "new_users", "target_cac", "channel_hypothesis"]
  },
  {
    id: "retention-improvement",
    name: "Улучшение удержания",
    category: "Продукт",
    template: "Если мы внедрим {retention_mechanic} для пользователей {user_cohort}, то {retention_metric} на {timeframe} увеличится на {improvement}%, потому что {retention_reasoning}",
    description: "Для тестирования механик удержания пользователей",
    variables: ["retention_mechanic", "user_cohort", "retention_metric", "timeframe", "improvement", "retention_reasoning"]
  },
  {
    id: "process-optimization",
    name: "Оптимизация процесса",
    category: "Операции",
    template: "Если мы автоматизируем процесс {process_name} через {automation_method}, то время выполнения сократится на {time_savings}%, потому что {efficiency_reason}",
    description: "Для тестирования улучшений внутренних процессов",
    variables: ["process_name", "automation_method", "time_savings", "efficiency_reason"]
  }
]

interface HypothesisTemplatesProps {
  onCreateFromTemplate: (template: HypothesisTemplate, variables: Record<string, string>) => void
}

export function HypothesisTemplates({ onCreateFromTemplate }: HypothesisTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<HypothesisTemplate | null>(null)
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const categories = Array.from(new Set(templates.map(t => t.category)))
  const filteredTemplates = filterCategory === "all" ? templates : templates.filter(t => t.category === filterCategory)

  const handleTemplateSelect = (template: HypothesisTemplate) => {
    setSelectedTemplate(template)
    setVariables({})
  }

  const handleVariableChange = (variable: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [variable]: value
    }))
  }

  const handleCreateHypothesis = () => {
    if (selectedTemplate) {
      onCreateFromTemplate(selectedTemplate, variables)
    }
  }

  const isFormValid = selectedTemplate && selectedTemplate.variables.every(v => variables[v]?.trim())

  return (
    <div className="space-y-6">
      {!selectedTemplate ? (
        <>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory("all")}
            >
              Все категории
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={filterCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map(template => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleTemplateSelect(template)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <strong>Шаблон:</strong>
                    <p className="mt-1 italic">{template.template}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        /* Template Configuration */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedTemplate.name}</CardTitle>
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Назад к шаблонам
              </Button>
            </div>
            <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-blue-900 mb-2">Шаблон гипотезы:</h4>
              <p className="text-sm text-blue-800 italic">{selectedTemplate.template}</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Заполните переменные:</h4>
              {selectedTemplate.variables.map(variable => (
                <div key={variable}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} *
                  </label>
                  <input
                    type="text"
                    value={variables[variable] || ''}
                    onChange={(e) => handleVariableChange(variable, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Введите значение для ${variable}`}
                  />
                </div>
              ))}
            </div>

            {/* Preview */}
            {Object.keys(variables).length > 0 && (
              <div className="bg-green-50 p-4 rounded-md">
                <h4 className="font-medium text-green-900 mb-2">Предварительный просмотр:</h4>
                <p className="text-sm text-green-800">
                  {selectedTemplate.variables.reduce((template, variable) => {
                    return template.replace(new RegExp(`{${variable}}`, 'g'), variables[variable] || `{${variable}}`)
                  }, selectedTemplate.template)}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleCreateHypothesis}
                disabled={!isFormValid}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Создать гипотезу из шаблона
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}