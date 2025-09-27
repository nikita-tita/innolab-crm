"use client"

import { useEffect, useRef, useCallback } from "react"

interface AutosaveOptions {
  key: string
  data: any
  delay?: number
  onSave?: (data: any) => void
  enabled?: boolean
}

export function useAutosave({
  key,
  data,
  delay = 2000,
  onSave,
  enabled = true
}: AutosaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedDataRef = useRef<string>("")

  const saveToLocalStorage = useCallback((dataToSave: any) => {
    try {
      const serializedData = JSON.stringify(dataToSave)
      localStorage.setItem(`autosave_${key}`, serializedData)
      localStorage.setItem(`autosave_${key}_timestamp`, Date.now().toString())
      lastSavedDataRef.current = serializedData
      onSave?.(dataToSave)
    } catch (error) {
      console.error("Failed to autosave:", error)
    }
  }, [key, onSave])

  const loadFromLocalStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(`autosave_${key}`)
      const timestamp = localStorage.getItem(`autosave_${key}_timestamp`)

      if (saved && timestamp) {
        const age = Date.now() - parseInt(timestamp)
        // Only return data if it's less than 24 hours old
        if (age < 24 * 60 * 60 * 1000) {
          return JSON.parse(saved)
        }
      }
    } catch (error) {
      console.error("Failed to load autosave:", error)
    }
    return null
  }, [key])

  const clearAutosave = useCallback(() => {
    localStorage.removeItem(`autosave_${key}`)
    localStorage.removeItem(`autosave_${key}_timestamp`)
    lastSavedDataRef.current = ""
  }, [key])

  // Auto-save effect
  useEffect(() => {
    if (!enabled) return

    const currentDataString = JSON.stringify(data)

    // Skip if data hasn't changed
    if (currentDataString === lastSavedDataRef.current) return

    // Skip if data is empty/default
    if (isEmptyData(data)) return

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      saveToLocalStorage(data)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, delay, enabled, saveToLocalStorage])

  return {
    loadSaved: loadFromLocalStorage,
    clearSaved: clearAutosave,
    hasSaved: () => !!localStorage.getItem(`autosave_${key}`)
  }
}

function isEmptyData(data: any): boolean {
  if (!data || typeof data !== 'object') return true

  // Check if all string fields are empty
  const stringFields = Object.values(data).filter(val => typeof val === 'string')
  return stringFields.every(val => !val.trim())
}

// Component to show autosave status
export function AutosaveIndicator({
  isSaving,
  lastSaved
}: {
  isSaving?: boolean
  lastSaved?: Date | null
}) {
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