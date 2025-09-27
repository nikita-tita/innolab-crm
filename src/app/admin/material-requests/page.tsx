"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  Calendar,
  User,
  MessageSquare
} from "lucide-react"

interface MaterialRequest {
  id: string
  title: string
  description: string
  category: string
  status: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  adminNotes?: string
}

const statusLabels = {
  PENDING: "Ожидает рассмотрения",
  APPROVED: "Одобрен",
  REJECTED: "Отклонен",
  IN_PROGRESS: "В работе",
  COMPLETED: "Выполнен"
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-gray-100 text-gray-800"
}

const categoryLabels = {
  METHODOLOGY: "Методология",
  TEMPLATE: "Шаблоны",
  CHECKLIST: "Чек-листы",
  GUIDE: "Руководства",
  OTHER: "Другое"
}

export default function MaterialRequestsAdmin() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [requests, setRequests] = useState<MaterialRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    } else if (session?.user?.role !== "ADMIN" && session?.user?.role !== "LAB_DIRECTOR") {
      router.push("/dashboard")
    }
  }, [status, session, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchRequests()
    }
  }, [session])

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/material-requests')
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error('Error fetching material requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (id: string, status: string, adminNotes?: string) => {
    try {
      const response = await fetch(`/api/material-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, adminNotes }),
      })

      if (response.ok) {
        await fetchRequests() // Refresh the list
      } else {
        alert('Ошибка при обновлении статуса запроса')
      }
    } catch (error) {
      console.error('Error updating request:', error)
      alert('Произошла ошибка при обновлении запроса')
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    )
  }

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "LAB_DIRECTOR")) {
    return null
  }

  const filteredRequests = requests.filter(request => {
    if (filter === "all") return true
    return request.status === filter
  })

  const pendingCount = requests.filter(r => r.status === "PENDING").length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-blue-600 hover:text-blue-800">
                ← Админка
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Запросы материалов
              </h1>
              {pendingCount > 0 && (
                <Badge className="bg-red-100 text-red-800">
                  {pendingCount} новых
                </Badge>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {session.user?.name || session.user?.email}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">

          {/* Filter buttons */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                Все ({requests.length})
              </Button>
              <Button
                variant={filter === "PENDING" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("PENDING")}
              >
                <Clock className="h-4 w-4 mr-1" />
                Ожидают ({requests.filter(r => r.status === "PENDING").length})
              </Button>
              <Button
                variant={filter === "IN_PROGRESS" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("IN_PROGRESS")}
              >
                <Settings className="h-4 w-4 mr-1" />
                В работе ({requests.filter(r => r.status === "IN_PROGRESS").length})
              </Button>
              <Button
                variant={filter === "APPROVED" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("APPROVED")}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Одобрены ({requests.filter(r => r.status === "APPROVED").length})
              </Button>
            </div>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {filter === "all" ? "Нет запросов" : `Нет запросов со статусом "${statusLabels[filter as keyof typeof statusLabels]}"`}
                  </h3>
                  <p className="text-gray-600">
                    Запросы на добавление материалов появятся здесь после отправки пользователями
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{request.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {request.user.name || request.user.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                          </div>
                          <Badge variant="outline">
                            {categoryLabels[request.category as keyof typeof categoryLabels]}
                          </Badge>
                        </div>
                      </div>
                      <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                        {statusLabels[request.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Описание запроса:</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
                      </div>

                      {request.adminNotes && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Заметки администратора:
                          </h4>
                          <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                            {request.adminNotes}
                          </p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-4 border-t">
                        {request.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateRequestStatus(request.id, "APPROVED")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Одобрить
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateRequestStatus(request.id, "IN_PROGRESS")}
                            >
                              <Settings className="h-4 w-4 mr-1" />
                              В работу
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                const notes = prompt("Причина отклонения (необязательно):")
                                updateRequestStatus(request.id, "REJECTED", notes || undefined)
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Отклонить
                            </Button>
                          </>
                        )}

                        {request.status === "IN_PROGRESS" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateRequestStatus(request.id, "COMPLETED")}
                              className="bg-gray-600 hover:bg-gray-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Завершить
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const notes = prompt("Добавить заметку к запросу:", request.adminNotes || "")
                                if (notes !== null) {
                                  updateRequestStatus(request.id, "IN_PROGRESS", notes)
                                }
                              }}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Добавить заметку
                            </Button>
                          </>
                        )}

                        {(request.status === "APPROVED" || request.status === "REJECTED" || request.status === "COMPLETED") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const notes = prompt("Изменить заметку к запросу:", request.adminNotes || "")
                              if (notes !== null) {
                                updateRequestStatus(request.id, request.status, notes)
                              }
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {request.adminNotes ? "Изменить заметку" : "Добавить заметку"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}