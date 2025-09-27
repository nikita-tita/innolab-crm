"use client"

import { useState } from "react"
import { MoreVertical, Plus, BarChart3, Edit, Eye } from "lucide-react"
import Link from "next/link"
import { canCreate } from "@/lib/permissions"

interface QuickActionsProps {
  ideaId: string
  userRole?: string
  onICEScore?: () => void
  onCreateHypothesis?: () => void
}

export default function QuickActions({
  ideaId,
  userRole,
  onICEScore,
  onCreateHypothesis
}: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const canCreateContent = canCreate(userRole as any)

  const actions = [
    {
      label: "Посмотреть детали",
      icon: <Eye className="h-4 w-4" />,
      href: `/ideas/${ideaId}`,
      color: "text-blue-600 hover:bg-blue-50"
    },
    ...(canCreateContent ? [
      {
        label: "ICE Скоринг",
        icon: <BarChart3 className="h-4 w-4" />,
        onClick: onICEScore,
        color: "text-green-600 hover:bg-green-50"
      },
      {
        label: "Создать гипотезу",
        icon: <Plus className="h-4 w-4" />,
        href: `/hypotheses/new?ideaId=${ideaId}`,
        color: "text-purple-600 hover:bg-purple-50"
      }
    ] : []),
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        type="button"
        aria-label="Быстрые действия"
      >
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[180px]">
            {actions.map((action, index) => (
              <div key={index}>
                {action.href ? (
                  <Link
                    href={action.href}
                    className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${action.color}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {action.icon}
                    {action.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      action.onClick?.()
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${action.color}`}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Quick ICE scoring modal component
export function QuickICEModal({
  ideaId,
  isOpen,
  onClose,
  onSubmit
}: {
  ideaId: string
  isOpen: boolean
  onClose: () => void
  onSubmit: (scores: { impact: number; confidence: number; ease: number }) => void
}) {
  const [scores, setScores] = useState({ impact: 5, confidence: 5, ease: 5 })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(scores)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Быстрая ICE оценка</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Impact (1-10)</label>
            <input
              type="range"
              min="1"
              max="10"
              value={scores.impact}
              onChange={(e) => setScores({ ...scores, impact: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-center text-sm font-medium">{scores.impact}</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confidence (1-10)</label>
            <input
              type="range"
              min="1"
              max="10"
              value={scores.confidence}
              onChange={(e) => setScores({ ...scores, confidence: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-center text-sm font-medium">{scores.confidence}</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ease (1-10)</label>
            <input
              type="range"
              min="1"
              max="10"
              value={scores.ease}
              onChange={(e) => setScores({ ...scores, ease: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-center text-sm font-medium">{scores.ease}</div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-800">
              ICE Score: {((scores.impact + scores.confidence + scores.ease) / 3).toFixed(1)}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}