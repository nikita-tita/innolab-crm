"use client"

import { useState } from "react"

interface ExportButtonProps {
  type: "ideas" | "hypotheses" | "experiments" | "all"
  className?: string
}

export default function ExportButton({ type, className = "" }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: "json" | "csv") => {
    setIsExporting(true)
    try {
      const response = await fetch(`/api/export?type=${type}&format=${format}`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url

        // Get filename from Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition')
        const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
        const filename = filenameMatch ? filenameMatch[1] : `export-${type}-${new Date().toISOString().split('T')[0]}.${format}`

        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error('Export failed')
        alert('Ошибка при экспорте данных')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Ошибка при экспорте данных')
    } finally {
      setIsExporting(false)
    }
  }

  const getTypeLabel = () => {
    switch (type) {
      case "ideas": return "идей"
      case "hypotheses": return "гипотез"
      case "experiments": return "экспериментов"
      case "all": return "всех данных"
      default: return "данных"
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="group">
        <button
          disabled={isExporting}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <span className="mr-2">📥</span>
          {isExporting ? "Экспорт..." : "Экспорт"}
          <span className="ml-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
          <div className="py-1">
            <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
              Экспорт {getTypeLabel()}
            </div>
            <button
              onClick={() => handleExport("json")}
              disabled={isExporting}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span className="mr-3">📄</span>
              <div className="text-left">
                <div className="font-medium">JSON формат</div>
                <div className="text-xs text-gray-500">Структурированные данные</div>
              </div>
            </button>
            <button
              onClick={() => handleExport("csv")}
              disabled={isExporting}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span className="mr-3">📊</span>
              <div className="text-left">
                <div className="font-medium">CSV формат</div>
                <div className="text-xs text-gray-500">Для Excel и Google Sheets</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}