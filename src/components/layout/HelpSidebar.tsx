"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HelpSidebarProps {
  isOpen: boolean
  onClose: () => void
  page: 'kanban' | 'ideas' | 'hypotheses' | 'experiments' | 'knowledge' | 'dashboard'
}

const HELP_CONTENT = {
  kanban: {
    title: "Канбан-доска",
    description: "Визуализация полного цикла инновационного процесса",
    sections: [
      {
        title: "Колонки процесса",
        items: [
          "💡 Идеи — Банк всех поступивших идей",
          "🔬 Гипотеза L1 — Базовая формулировка гипотезы",
          "📚 Гипотеза L2 — Детализированная после исследования",
          "⚗️ Эксперимент — Активное тестирование",
          "🚀 InLab — Готовые к запуску решения",
          "🏢 М2 — Продуктовая линейка компании"
        ]
      },
      {
        title: "Управление карточками",
        items: [
          "Перетаскивайте карточки между колонками",
          "Кликните на карточку для детального просмотра",
          "Каждая строка показывает полный жизненный цикл одной идеи"
        ]
      }
    ]
  },
  ideas: {
    title: "Управление идеями",
    description: "Центр сбора и первичной обработки инновационных идей",
    sections: [
      {
        title: "RICE-приоритизация",
        items: [
          "Reach — охват аудитории",
          "Impact — сила воздействия (1-3)",
          "Confidence — уверенность в успехе (%)",
          "Effort — трудозатраты (человеко-месяцы)",
          "Итоговый RICE = (R × I × C) / E"
        ]
      },
      {
        title: "Жизненный цикл",
        items: [
          "NEW → SCORED → SELECTED → IN_HYPOTHESIS → COMPLETED"
        ]
      }
    ]
  },
  hypotheses: {
    title: "Работа с гипотезами",
    description: "Формулирование и проверка предположений",
    sections: [
      {
        title: "Уровни гипотез",
        items: [
          "L1 — Базовая формулировка проблемы и решения",
          "L2 — Детализированная после desk research"
        ]
      },
      {
        title: "Статусы",
        items: [
          "DRAFT — Черновик",
          "RESEARCH — Проводится исследование",
          "READY_FOR_TESTING — Готова к тестированию",
          "VALIDATED — Подтверждена"
        ]
      }
    ]
  },
  experiments: {
    title: "Планирование экспериментов",
    description: "Проведение тестов для валидации гипотез",
    sections: [
      {
        title: "Типы экспериментов",
        items: [
          "A/B тесты — Сравнение вариантов",
          "MVP — Минимальный жизнеспособный продукт",
          "Интервью — Качественные исследования",
          "Прототип — Тестирование концепции"
        ]
      },
      {
        title: "Метрики успеха",
        items: [
          "Определите ключевые показатели до старта",
          "Установите пороговые значения успеха",
          "Фиксируйте результаты в реальном времени"
        ]
      }
    ]
  },
  knowledge: {
    title: "База знаний",
    description: "Накопленная экспертиза и лучшие практики",
    sections: [
      {
        title: "Структура знаний",
        items: [
          "Методологии инновационного процесса",
          "Шаблоны документов",
          "Кейсы успешных проектов",
          "Ошибки и уроки"
        ]
      }
    ]
  },
  dashboard: {
    title: "Аналитика и статистика",
    description: "Мониторинг эффективности инновационного процесса",
    sections: [
      {
        title: "Ключевые метрики",
        items: [
          "Воронка конверсии идей",
          "Скорость прохождения этапов",
          "ROI реализованных инноваций",
          "Активность команды"
        ]
      }
    ]
  }
}

export default function HelpSidebar({ isOpen, onClose, page }: HelpSidebarProps) {
  const content = HELP_CONTENT[page]

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 z-50" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {content.title}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            {content.description}
          </p>

          {/* Sections */}
          <div className="space-y-6">
            {content.sections.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-900 mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-gray-600 leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Нужна дополнительная помощь? Обратитесь к администратору системы.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}