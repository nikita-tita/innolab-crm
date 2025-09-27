"use client"

import { Badge } from "@/components/ui/badge"

interface ExperimentStatusBadgeProps {
  status: string
  type?: string
}

const statusTranslations = {
  PLANNING: "Планирование",
  IN_PROGRESS: "Выполняется",
  PAUSED: "Приостановлен",
  COMPLETED: "Завершен",
  CANCELLED: "Отменен"
}

const typeTranslations = {
  QUANTITATIVE: "Количественное исследование",
  QUALITATIVE: "Качественное исследование",
  PROTOTYPE: "Прототипирование",
  AB_TEST: "A/B тестирование",
  SURVEY: "Опросы",
  LANDING_PAGE: "Тест лендинга",
  DATA_ANALYSIS: "Анализ данных",
  OTHER: "Другое"
}

const statusColors = {
  PLANNING: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  PAUSED: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800"
}

export function ExperimentStatusBadge({ status, type }: ExperimentStatusBadgeProps) {
  const statusText = statusTranslations[status as keyof typeof statusTranslations] || status
  const typeText = type ? typeTranslations[type as keyof typeof typeTranslations] || type : null
  const colorClass = statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"

  return (
    <div className="flex items-center gap-2">
      <Badge className={colorClass}>
        {statusText}
      </Badge>
      {typeText && (
        <Badge variant="outline">
          {typeText}
        </Badge>
      )}
    </div>
  )
}