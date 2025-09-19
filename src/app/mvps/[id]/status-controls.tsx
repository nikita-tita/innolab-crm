"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface StatusControlsProps {
  id: string
  current: string
}

const STATUS_OPTIONS = [
  { value: "PLANNING", label: "Планирование", color: "gray" },
  { value: "DEVELOPMENT", label: "Разработка", color: "blue" },
  { value: "TESTING", label: "Тестирование", color: "yellow" },
  { value: "DEPLOYED", label: "Развернут", color: "green" },
  { value: "ARCHIVED", label: "Архивирован", color: "red" }
]

export default function StatusControls({ id, current }: StatusControlsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === current || loading) return

    setLoading(true)
    try {
      const response = await fetch(`/api/mvps/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Ошибка при обновлении статуса")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Ошибка при обновлении статуса")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const option = STATUS_OPTIONS.find(opt => opt.value === status)
    switch (option?.color) {
      case "gray": return "bg-gray-100 text-gray-800 border-gray-300"
      case "blue": return "bg-blue-100 text-blue-800 border-blue-300"
      case "yellow": return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "green": return "bg-green-100 text-green-800 border-green-300"
      case "red": return "bg-red-100 text-red-800 border-red-300"
      default: return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getNextStatuses = (currentStatus: string) => {
    const currentIndex = STATUS_OPTIONS.findIndex(opt => opt.value === currentStatus)
    if (currentIndex === -1) return STATUS_OPTIONS

    // Allow moving to next status or archiving
    const nextOptions = []

    // Can always archive
    if (currentStatus !== "ARCHIVED") {
      nextOptions.push(STATUS_OPTIONS.find(opt => opt.value === "ARCHIVED")!)
    }

    // Can move to next stage
    if (currentIndex < STATUS_OPTIONS.length - 2) { // -2 because ARCHIVED is last
      nextOptions.unshift(STATUS_OPTIONS[currentIndex + 1])
    }

    // Can move to previous stage (except from ARCHIVED)
    if (currentIndex > 0 && currentStatus !== "ARCHIVED") {
      nextOptions.unshift(STATUS_OPTIONS[currentIndex - 1])
    }

    return nextOptions.filter(opt => opt.value !== currentStatus)
  }

  const nextStatuses = getNextStatuses(current)

  return (
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-sm text-gray-600">Изменить статус:</span>
      {nextStatuses.map((status) => (
        <button
          key={status.value}
          onClick={() => handleStatusChange(status.value)}
          disabled={loading}
          className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors duration-200 hover:opacity-80 disabled:opacity-50 ${getStatusColor(status.value)}`}
          title={`Изменить статус на "${status.label}"`}
        >
          {loading ? "..." : status.label}
        </button>
      ))}
    </div>
  )
}