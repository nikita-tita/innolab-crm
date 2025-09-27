"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Plus, User } from "lucide-react"

interface ICEScore {
  id: string
  impact: number
  confidence: number
  ease: number
  comment?: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  createdAt: string
}

interface ICEScoringPanelProps {
  ideaId: string
  userRole: string
  userId: string
}

export default function ICEScoringPanel({ ideaId, userRole, userId }: ICEScoringPanelProps) {
  const [scores, setScores] = useState<ICEScore[]>([])
  const [averages, setAverages] = useState({ impact: 0, confidence: 0, ease: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ impact: 5, confidence: 5, ease: 5, comment: "" })
  const [submitting, setSubmitting] = useState(false)

  const canScore = userRole !== "VIEWER"
  const userScore = scores.find(score => score.user.id === userId)

  useEffect(() => {
    fetchScores()
  }, [ideaId])

  const fetchScores = async () => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/ice-score`)
      if (response.ok) {
        const data = await response.json()
        setScores(data.scores || [])
        setAverages(data.averages || { impact: 0, confidence: 0, ease: 0, total: 0 })
      }
    } catch (error) {
      console.error("Error fetching ICE scores:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/ideas/${ideaId}/ice-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowForm(false)
        setFormData({ impact: 5, confidence: 5, ease: 5, comment: "" })
        await fetchScores()
      } else {
        const error = await response.json()
        alert(`Ошибка: ${error.error}`)
      }
    } catch (error) {
      console.error("Error submitting ICE score:", error)
      alert("Произошла ошибка при отправке оценки")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Загрузка ICE скоринга...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            ICE Скоринг команды
          </CardTitle>
          {canScore && !showForm && (
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              {userScore ? "Изменить оценку" : "Оценить"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Impact (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-center text-sm font-medium">{formData.impact}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confidence (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.confidence}
                  onChange={(e) => setFormData({ ...formData, confidence: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-center text-sm font-medium">{formData.confidence}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ease (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.ease}
                  onChange={(e) => setFormData({ ...formData, ease: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-center text-sm font-medium">{formData.ease}</div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Комментарий (опционально)</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                rows={2}
                placeholder="Ваши комментарии к оценке..."
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Сохранение..." : "Сохранить оценку"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Отмена
              </Button>
            </div>
          </form>
        )}

        {scores.length > 0 && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Средние оценки команды</h4>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-800">{averages.impact}</div>
                  <div className="text-blue-600">Impact</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-800">{averages.confidence}</div>
                  <div className="text-blue-600">Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-800">{averages.ease}</div>
                  <div className="text-blue-600">Ease</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-800">{averages.total}</div>
                  <div className="text-blue-600">ICE Score</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Оценки участников ({scores.length})</h4>
              <div className="space-y-2">
                {scores.map((score) => (
                  <div key={score.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{score.user.name || score.user.email}</span>
                      <Badge variant="outline">{score.user.role}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>I: {score.impact}</span>
                      <span>C: {score.confidence}</span>
                      <span>E: {score.ease}</span>
                      <span className="font-medium">
                        Σ: {((score.impact + score.confidence + score.ease) / 3).toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {scores.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Пока нет оценок от команды</p>
            {canScore && (
              <p className="text-sm">Будьте первым, кто оценит эту идею!</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}