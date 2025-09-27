"use client"

import { useState } from "react"
import { HelpCircle } from "lucide-react"

interface TooltipProps {
  content: React.ReactNode
  title?: string
  icon?: React.ReactNode
  className?: string
  position?: "top" | "bottom" | "left" | "right"
}

export default function Tooltip({
  content,
  title = "Справка",
  icon,
  className = "",
  position = "top"
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2"
  }

  const arrowClasses = {
    top: "top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-0 border-t-gray-800",
    bottom: "bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-0 border-b-gray-800",
    left: "left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-0 border-l-gray-800",
    right: "right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-0 border-r-gray-800"
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        type="button"
        aria-label={title}
      >
        {icon || <HelpCircle className="h-4 w-4" />}
      </button>

      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} w-80 max-w-sm`}
          role="tooltip"
        >
          <div className="bg-gray-800 text-white text-sm rounded-lg p-3 shadow-lg">
            {content}
          </div>
          <div
            className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
          />
        </div>
      )}
    </div>
  )
}

// Specialized tooltips for formulas
export function ICETooltip() {
  return (
    <Tooltip
      title="ICE Скоринг"
      content={
        <div className="space-y-2">
          <div className="font-semibold">ICE = (Impact × Confidence × Ease) ÷ 3</div>
          <div className="text-xs space-y-1">
            <div><strong>Impact (1-10):</strong> Влияние на метрики</div>
            <div><strong>Confidence (1-10):</strong> Уверенность в результате</div>
            <div><strong>Ease (1-10):</strong> Простота реализации</div>
          </div>
          <div className="border-t border-gray-600 pt-2 text-xs">
            <div className="font-medium">Пример:</div>
            <div>Impact: 8, Confidence: 7, Ease: 5</div>
            <div>ICE = (8 + 7 + 5) ÷ 3 = 6.7</div>
          </div>
        </div>
      }
    />
  )
}

export function RICETooltip() {
  return (
    <Tooltip
      title="RICE Скоринг"
      content={
        <div className="space-y-2">
          <div className="font-semibold">RICE = (Reach × Impact × Confidence) ÷ (Effort × 100)</div>
          <div className="text-xs space-y-1">
            <div><strong>Reach:</strong> Количество пользователей</div>
            <div><strong>Impact (1-5):</strong> Сила влияния</div>
            <div><strong>Confidence (1-100%):</strong> Уверенность</div>
            <div><strong>Effort:</strong> Затраты (человеко-дни)</div>
          </div>
          <div className="border-t border-gray-600 pt-2 text-xs">
            <div className="font-medium">Пример:</div>
            <div>Reach: 1000, Impact: 3, Confidence: 80%, Effort: 5</div>
            <div>RICE = (1000 × 3 × 80) ÷ (5 × 100) = 480</div>
          </div>
        </div>
      }
    />
  )
}