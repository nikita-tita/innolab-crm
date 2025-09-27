"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  BarChart3,
  Beaker,
  Target
} from "lucide-react"

interface HypothesisStatusManagerProps {
  id: string
  currentStatus: string
  currentLevel: string
  hasDescription: boolean
  hasDeskResearch: boolean
  hasRiceScoring: boolean
  hasSuccessCriteria: boolean
  onStatusChange: (status: string, level?: string) => Promise<void>
}

const statusConfig = {
  DRAFT: {
    label: "Черновик",
    description: "Первоначальная формулировка гипотезы",
    color: "bg-gray-100 text-gray-800",
    icon: FileText,
    level: "LEVEL_1",
    requiredFields: ["description"],
    nextStatuses: ["RESEARCH"]
  },
  RESEARCH: {
    label: "Desk Research",
    description: "Проведение кабинетного исследования",
    color: "bg-blue-100 text-blue-800",
    icon: BarChart3,
    level: "LEVEL_1",
    requiredFields: ["description", "deskResearch"],
    nextStatuses: ["SCORED"]
  },
  SCORED: {
    label: "RICE оценка",
    description: "Проставлена RICE оценка для приоритизации",
    color: "bg-purple-100 text-purple-800",
    icon: Target,
    level: "LEVEL_2", // Автоматически L2 когда есть desk research + RICE
    requiredFields: ["description", "deskResearch", "riceScoring"],
    nextStatuses: ["READY_FOR_TESTING"]
  },
  READY_FOR_TESTING: {
    label: "Готова к тестированию",
    description: "Все подготовительные работы завершены",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    level: "LEVEL_2",
    requiredFields: ["description", "deskResearch", "riceScoring", "successCriteria"],
    nextStatuses: ["IN_EXPERIMENT"]
  },
  IN_EXPERIMENT: {
    label: "В эксперименте",
    description: "Проводится активное тестирование гипотезы",
    color: "bg-yellow-100 text-yellow-800",
    icon: Beaker,
    level: "LEVEL_2",
    requiredFields: ["description", "deskResearch", "riceScoring", "successCriteria"],
    nextStatuses: ["VALIDATED", "INVALIDATED", "ITERATION"]
  },
  VALIDATED: {
    label: "Подтверждена",
    description: "Гипотеза подтверждена экспериментом",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    level: "LEVEL_2",
    requiredFields: [],
    nextStatuses: []
  },
  INVALIDATED: {
    label: "Опровергнута",
    description: "Гипотеза опровергнута экспериментом",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    level: "LEVEL_2",
    requiredFields: [],
    nextStatuses: ["ITERATION"]
  },
  ITERATION: {
    label: "Итерация",
    description: "Требуется доработка и новый цикл тестирования",
    color: "bg-orange-100 text-orange-800",
    icon: Clock,
    level: "LEVEL_2",
    requiredFields: [],
    nextStatuses: ["RESEARCH", "SCORED"]
  }
}

export function HypothesisStatusManager({
  id,
  currentStatus,
  currentLevel,
  hasDescription,
  hasDeskResearch,
  hasRiceScoring,
  hasSuccessCriteria,
  onStatusChange
}: HypothesisStatusManagerProps) {
  const [isChanging, setIsChanging] = useState(false)

  const currentConfig = statusConfig[currentStatus as keyof typeof statusConfig]
  const CurrentIcon = currentConfig?.icon || FileText

  // Проверка готовности полей
  const fieldChecks = {
    description: hasDescription,
    deskResearch: hasDeskResearch,
    riceScoring: hasRiceScoring,
    successCriteria: hasSuccessCriteria
  }

  // Функция проверки готовности к переходу в статус
  const canTransitionTo = (targetStatus: string) => {
    const targetConfig = statusConfig[targetStatus as keyof typeof statusConfig]
    if (!targetConfig) return false

    return targetConfig.requiredFields.every(field =>
      fieldChecks[field as keyof typeof fieldChecks]
    )
  }

  // Функция для получения следующих доступных статусов
  const getAvailableTransitions = () => {
    if (!currentConfig) return []

    return currentConfig.nextStatuses.map(status => ({
      status,
      config: statusConfig[status as keyof typeof statusConfig],
      canTransition: canTransitionTo(status),
      missingFields: statusConfig[status as keyof typeof statusConfig].requiredFields.filter(
        field => !fieldChecks[field as keyof typeof fieldChecks]
      )
    }))
  }

  const handleStatusChange = async (newStatus: string) => {
    setIsChanging(true)
    try {
      const newLevel = statusConfig[newStatus as keyof typeof statusConfig]?.level
      await onStatusChange(newStatus, newLevel)
    } finally {
      setIsChanging(false)
    }
  }

  const availableTransitions = getAvailableTransitions()

  return (
    <div className="space-y-4">
      {/* Текущий статус */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <CurrentIcon className="h-5 w-5" />
          <Badge className={currentConfig?.color}>
            {currentConfig?.label || currentStatus}
          </Badge>
          <Badge variant="outline">
            {currentLevel === "LEVEL_1" ? "L1" : "L2"}
          </Badge>
        </div>
        <span className="text-sm text-gray-600">
          {currentConfig?.description}
        </span>
      </div>

      {/* Индикаторы готовности */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          {hasDescription ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-gray-400" />
          )}
          <span className="text-sm">Описание</span>
        </div>
        <div className="flex items-center gap-2">
          {hasDeskResearch ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-gray-400" />
          )}
          <span className="text-sm">Desk Research</span>
        </div>
        <div className="flex items-center gap-2">
          {hasRiceScoring ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-gray-400" />
          )}
          <span className="text-sm">RICE оценка</span>
        </div>
        <div className="flex items-center gap-2">
          {hasSuccessCriteria ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-gray-400" />
          )}
          <span className="text-sm">Критерии успеха</span>
        </div>
      </div>

      {/* Доступные переходы */}
      {availableTransitions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Доступные переходы:</h4>
          <div className="flex flex-wrap gap-2">
            {availableTransitions.map(({ status, config, canTransition, missingFields }) => {
              const StatusIcon = config?.icon || FileText
              return (
                <div key={status} className="flex items-center gap-2">
                  <Button
                    variant={canTransition ? "default" : "outline"}
                    size="sm"
                    disabled={!canTransition || isChanging}
                    onClick={() => handleStatusChange(status)}
                    className="flex items-center gap-2"
                  >
                    <StatusIcon className="h-3 w-3" />
                    {config?.label}
                    {!canTransition && <AlertTriangle className="h-3 w-3 text-orange-500" />}
                  </Button>
                  {!canTransition && missingFields.length > 0 && (
                    <span className="text-xs text-gray-500">
                      Нужно: {missingFields.join(", ")}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Автоматический переход в L2 */}
      {currentLevel === "LEVEL_1" && hasDeskResearch && hasRiceScoring && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Готово к переходу в L2!
            </span>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            У гипотезы есть Desk Research и RICE оценка. Можно переходить к следующему этапу.
          </p>
        </div>
      )}
    </div>
  )
}