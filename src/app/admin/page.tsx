"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Settings, Database, BarChart3 } from "lucide-react"

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    } else if (session?.user?.role !== "ADMIN" && session?.user?.role !== "LAB_DIRECTOR") {
      router.push("/dashboard")
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    )
  }

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "LAB_DIRECTOR")) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
                InnoLab CRM - Админка
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {session.user?.name || session.user?.email}
              </div>
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← К основной системе
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Панель администратора</h1>
            <p className="mt-2 text-gray-600">
              Управление пользователями, настройками и конфигурацией системы
            </p>
          </div>

          {/* Admin Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Users Management */}
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href="/admin/users">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Пользователи
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Управление</div>
                  <p className="text-xs text-muted-foreground">
                    Создание, редактирование и управление пользователями
                  </p>
                </CardContent>
              </Link>
            </Card>

            {/* Form Fields Configuration */}
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href="/admin/fields">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Поля форм
                  </CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Настройка</div>
                  <p className="text-xs text-muted-foreground">
                    Конфигурация полей в зависимости от этапов
                  </p>
                </CardContent>
              </Link>
            </Card>

            {/* Database Management */}
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href="/admin/database">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    База данных
                  </CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Управление</div>
                  <p className="text-xs text-muted-foreground">
                    Очистка, миграции и резервные копии
                  </p>
                </CardContent>
              </Link>
            </Card>

            {/* Analytics */}
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href="/admin/analytics">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Аналитика
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Отчеты</div>
                  <p className="text-xs text-muted-foreground">
                    Статистика использования системы
                  </p>
                </CardContent>
              </Link>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Button asChild className="h-auto p-4 justify-start">
                    <Link href="/admin/users/new">
                      <div>
                        <div className="font-medium">Создать пользователя</div>
                        <div className="text-sm text-muted-foreground">
                          Добавить нового участника команды
                        </div>
                      </div>
                    </Link>
                  </Button>

                  <Button variant="outline" asChild className="h-auto p-4 justify-start">
                    <Link href="/admin/database/cleanup">
                      <div>
                        <div className="font-medium">Очистить данные</div>
                        <div className="text-sm text-muted-foreground">
                          Удалить тестовые и моковые данные
                        </div>
                      </div>
                    </Link>
                  </Button>

                  <Button variant="outline" asChild className="h-auto p-4 justify-start">
                    <Link href="/admin/fields/reset">
                      <div>
                        <div className="font-medium">Сбросить настройки</div>
                        <div className="text-sm text-muted-foreground">
                          Восстановить конфигурацию по умолчанию
                        </div>
                      </div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Статус системы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">База данных</span>
                    <span className="text-sm text-green-600 font-medium">Подключена</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Аутентификация</span>
                    <span className="text-sm text-green-600 font-medium">Активна</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Версия</span>
                    <span className="text-sm text-gray-900 font-medium">v1.0.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}