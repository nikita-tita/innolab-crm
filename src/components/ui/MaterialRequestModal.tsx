"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { X, Send } from "lucide-react"

interface MaterialRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { title: string; description: string; category: string }) => void
  isLoading?: boolean
}

export default function MaterialRequestModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}: MaterialRequestModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("METHODOLOGY")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category
    })

    // Reset form
    setTitle("")
    setDescription("")
    setCategory("METHODOLOGY")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Запрос на добавление материала</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название материала *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Например: Руководство по UX-исследованиям"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Категория
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="METHODOLOGY">Методология</option>
                <option value="TEMPLATE">Шаблоны</option>
                <option value="CHECKLIST">Чек-листы</option>
                <option value="GUIDE">Руководства</option>
                <option value="OTHER">Другое</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание запроса *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Опишите, какой материал вы хотели бы видеть в базе знаний. Укажите детали, которые помогут понять вашу потребность."
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={!title.trim() || !description.trim() || isLoading}
              >
                {isLoading ? (
                  "Отправка..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Отправить запрос
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}