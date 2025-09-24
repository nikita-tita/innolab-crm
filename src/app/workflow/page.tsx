"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function WorkflowPage() {
  const router = useRouter()

  useEffect(() => {
    // Перенаправляем на единый канбан
    router.replace("/kanban")
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-lg">Перенаправление на канбан...</div>
    </div>
  )
}