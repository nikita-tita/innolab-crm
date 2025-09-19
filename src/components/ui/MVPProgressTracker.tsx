"use client"

import { useState, useEffect } from "react"

interface MVPProgressTrackerProps {
  mvpId: string
  currentStatus: string
  type: string
}

interface Milestone {
  id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed"
  dueDate?: string
  completedAt?: string
}

const STATUS_MILESTONES = {
  PLANNING: [
    { title: "Определить требования", description: "Собрать и проанализировать требования к MVP" },
    { title: "Создать техническое задание", description: "Подготовить детальное техническое задание" },
    { title: "Планирование архитектуры", description: "Спроектировать архитектуру и выбрать технологии" },
    { title: "Оценка ресурсов", description: "Определить необходимые ресурсы и временные рамки" }
  ],
  DEVELOPMENT: [
    { title: "Настройка окружения", description: "Подготовить среду разработки и инструменты" },
    { title: "Базовая функциональность", description: "Реализовать ключевые функции MVP" },
    { title: "Интеграция компонентов", description: "Связать все части системы воедино" },
    { title: "Первичное тестирование", description: "Провести базовые тесты функциональности" }
  ],
  TESTING: [
    { title: "Функциональное тестирование", description: "Протестировать все функции MVP" },
    { title: "Пользовательское тестирование", description: "Провести тесты с реальными пользователями" },
    { title: "Исправление багов", description: "Устранить найденные проблемы" },
    { title: "Подготовка к развертыванию", description: "Финальная подготовка к запуску" }
  ],
  DEPLOYED: [
    { title: "Развертывание", description: "Запуск MVP в продакшен среде" },
    { title: "Мониторинг", description: "Отслеживание работы и метрик" },
    { title: "Сбор обратной связи", description: "Получение отзывов от пользователей" },
    { title: "Анализ результатов", description: "Анализ данных и подготовка выводов" }
  ]
}

export default function MVPProgressTracker({ mvpId, currentStatus, type }: MVPProgressTrackerProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateMilestones()
  }, [currentStatus, type])

  const generateMilestones = () => {
    const statusMilestones = STATUS_MILESTONES[currentStatus as keyof typeof STATUS_MILESTONES] || []

    const generatedMilestones: Milestone[] = statusMilestones.map((milestone, index) => ({
      id: `milestone-${currentStatus}-${index}`,
      title: milestone.title,
      description: milestone.description,
      status: index === 0 ? "in_progress" : "pending"
    }))

    setMilestones(generatedMilestones)
    setLoading(false)
  }

  const toggleMilestoneStatus = (milestoneId: string) => {
    setMilestones(prev => prev.map(milestone => {
      if (milestone.id === milestoneId) {
        const newStatus = milestone.status === "completed" ? "pending" : "completed"
        return {
          ...milestone,
          status: newStatus,
          completedAt: newStatus === "completed" ? new Date().toISOString() : undefined
        }
      }
      return milestone
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return "✅"
      case "in_progress": return "🔄"
      case "pending": return "⏳"
      default: return "⏳"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-50 border-green-200"
      case "in_progress": return "bg-blue-50 border-blue-200"
      case "pending": return "bg-gray-50 border-gray-200"
      default: return "bg-gray-50 border-gray-200"
    }
  }

  const completedCount = milestones.filter(m => m.status === "completed").length
  const totalCount = milestones.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="text-center py-4">Загрузка прогресса...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="text-2xl mr-2">📋</span>
          Прогресс разработки
        </h3>
        <div className="text-right">
          <div className="text-sm text-gray-600">Завершено</div>
          <div className="text-lg font-semibold text-blue-600">
            {completedCount} из {totalCount}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Общий прогресс</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Stage Info */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center">
          <span className="mr-2">🎯</span>
          Текущий этап: {getStageTitle(currentStatus)}
        </h4>
        <p className="text-sm text-blue-700">
          {getStageDescription(currentStatus)}
        </p>
      </div>

      {/* Milestones */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 mb-3">Основные вехи этапа:</h4>
        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className={`border-2 rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-sm ${getStatusColor(milestone.status)}`}
            onClick={() => toggleMilestoneStatus(milestone.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <span className="text-xl flex-shrink-0 mt-0.5">
                  {getStatusIcon(milestone.status)}
                </span>
                <div className="flex-1">
                  <h5 className={`font-medium ${milestone.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {milestone.title}
                  </h5>
                  <p className="text-sm text-gray-600 mt-1">
                    {milestone.description}
                  </p>
                  {milestone.completedAt && (
                    <p className="text-xs text-green-600 mt-2">
                      ✓ Завершено: {new Date(milestone.completedAt).toLocaleString('ru-RU')}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500 ml-4">
                {index + 1}/{totalCount}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-6 bg-purple-50 rounded-lg p-4">
        <h4 className="font-medium text-purple-900 mb-2 flex items-center">
          <span className="mr-2">💡</span>
          Советы для текущего этапа:
        </h4>
        <ul className="text-sm text-purple-700 space-y-1">
          {getStageTips(currentStatus).map((tip, index) => (
            <li key={index}>• {tip}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function getStageTitle(status: string): string {
  switch (status) {
    case "PLANNING": return "Планирование"
    case "DEVELOPMENT": return "Разработка"
    case "TESTING": return "Тестирование"
    case "DEPLOYED": return "Развертывание"
    case "ARCHIVED": return "Архивирован"
    default: return status
  }
}

function getStageDescription(status: string): string {
  switch (status) {
    case "PLANNING": return "Этап детального планирования и проектирования MVP"
    case "DEVELOPMENT": return "Активная разработка функциональности MVP"
    case "TESTING": return "Тестирование и отладка MVP перед запуском"
    case "DEPLOYED": return "MVP запущен и собираются данные о его работе"
    case "ARCHIVED": return "MVP завершен и архивирован"
    default: return "Этап работы над MVP"
  }
}

function getStageTips(status: string): string[] {
  switch (status) {
    case "PLANNING":
      return [
        "Определите минимальный набор функций для проверки гипотезы",
        "Проведите интервью с потенциальными пользователями",
        "Выберите простые и быстрые технологии для реализации"
      ]
    case "DEVELOPMENT":
      return [
        "Фокусируйтесь только на ключевой функциональности",
        "Делайте частые коммиты и бэкапы кода",
        "Регулярно тестируйте в процессе разработки"
      ]
    case "TESTING":
      return [
        "Привлеките реальных пользователей для тестирования",
        "Фиксируйте все найденные баги и проблемы UX",
        "Подготовьте план развертывания и отката"
      ]
    case "DEPLOYED":
      return [
        "Настройте мониторинг ключевых метрик",
        "Собирайте обратную связь от пользователей",
        "Готовьтесь к быстрым итерациям на основе данных"
      ]
    default:
      return ["Следуйте плану и не забывайте про цели MVP"]
  }
}