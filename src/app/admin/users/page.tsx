"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, Settings, Eye, Shield } from "lucide-react"
import Link from "next/link"
import { getRoleDisplayName, getRoleDescription } from "@/lib/permissions"

interface User {
  id: string
  name: string | null
  email: string
  role: string
  status: string
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
}

export default function AdminUsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddViewer, setShowAddViewer] = useState(false)
  const [newViewer, setNewViewer] = useState({
    name: "",
    email: "",
    role: "VIEWER"
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddViewer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newViewer)
      })

      if (response.ok) {
        fetchUsers()
        setShowAddViewer(false)
        setNewViewer({ name: "", email: "", role: "VIEWER" })
      }
    } catch (error) {
      console.error("Error adding viewer:", error)
    }
  }

  const handleStatusChange = async (userId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error("Error updating user status:", error)
    }
  }

  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Доступ запрещен</h2>
            <p className="text-gray-600">У вас нет прав для доступа к админ-панели</p>
            <Link href="/dashboard" className="inline-block mt-4">
              <Button>Вернуться на главную</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-gray-900 mr-8">
                InLab CRM
              </Link>
              <h1 className="text-xl font-semibold text-gray-700">Управление пользователями</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="default">
                <Shield className="h-3 w-3 mr-1" />
                Администратор
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Всего пользователей</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <UserPlus className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Команда</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => !["VIEWER", "STAKEHOLDER"].includes(u.role)).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Eye className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Наблюдатели</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => ["VIEWER", "STAKEHOLDER"].includes(u.role)).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Settings className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Активные</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.status === "ACTIVE" && u.isActive).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Добавить наблюдателя */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Добавить наблюдателя</span>
                <Button
                  onClick={() => setShowAddViewer(!showAddViewer)}
                  variant="outline"
                  size="sm"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Добавить
                </Button>
              </CardTitle>
            </CardHeader>
            {showAddViewer && (
              <CardContent>
                <form onSubmit={handleAddViewer} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Имя и фамилия"
                      value={newViewer.name}
                      onChange={(e) => setNewViewer({...newViewer, name: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newViewer.email}
                      onChange={(e) => setNewViewer({...newViewer, email: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                    <select
                      value={newViewer.role}
                      onChange={(e) => setNewViewer({...newViewer, role: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="VIEWER">Наблюдатель</option>
                      <option value="STAKEHOLDER">Заинтересованная сторона</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">Добавить пользователя</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowAddViewer(false)}>
                      Отмена
                    </Button>
                  </div>
                </form>
              </CardContent>
            )}
          </Card>

          {/* Список пользователей */}
          <Card>
            <CardHeader>
              <CardTitle>Все пользователи</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Загрузка...</div>
              ) : (
                <div className="space-y-4">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="font-medium text-gray-900">{user.name || "Без имени"}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <Badge variant="outline">
                            {getRoleDisplayName(user.role as any)}
                          </Badge>
                          <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"}>
                            {user.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {getRoleDescription(user.role as any)}
                        </p>
                        {user.lastLoginAt && (
                          <p className="text-xs text-gray-400">
                            Последний вход: {new Date(user.lastLoginAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {user.status === "ACTIVE" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(user.id, "INACTIVE")}
                          >
                            Деактивировать
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(user.id, "ACTIVE")}
                          >
                            Активировать
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}