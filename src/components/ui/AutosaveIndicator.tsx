"use client"

interface AutosaveIndicatorProps {
  isSaving?: boolean
  lastSaved?: Date | null
}

export function AutosaveIndicator({
  isSaving,
  lastSaved
}: AutosaveIndicatorProps) {
  if (isSaving) {
    return (
      <div className="flex items-center text-xs text-gray-500">
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500 mr-1"></div>
        Сохранение...
      </div>
    )
  }

  if (lastSaved) {
    return (
      <div className="text-xs text-green-600">
        ✓ Сохранено {lastSaved.toLocaleTimeString()}
      </div>
    )
  }

  return null
}