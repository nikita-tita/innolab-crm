"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, Trash2, Shield, AlertTriangle, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function AdminDatabasePage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showConfirm, setShowConfirm] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleCleanup = async () => {
    if (!confirmPassword) {
      alert("Введите пароль подтверждения")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/admin/cleanup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmPassword })
      })

      const data = await response.json()

      if (response.ok) {
        setResult("Данные успешно очищены!")
        setConfirmPassword("")
        setShowConfirm(false)
      } else {
        setResult(`Ошибка: ${data.error}`)
      }
    } catch (error) {
      setResult("Ошибка при выполнении запроса")
    } finally {
      setLoading(false)
    }
  }

  const initializeFields = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/fields/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: true })
      })

      const data = await response.json()

      if (response.ok) {
        setResult(`Поля инициализированы: ${data.totalCreated} полей создано`)
      } else {
        setResult(`Ошибка: ${data.error}`)
      }
    } catch (error) {
      setResult("Ошибка при инициализации полей")
    } finally {
      setLoading(false)
    }
  }

  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Доступ запрещен</h2>
            <p className="text-gray-600">У вас нет прав для управления базой данных</p>
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
              <Link href="/admin" className="text-2xl font-bold text-gray-900 mr-8">
                InnoLab CRM
              </Link>
              <h1 className="text-xl font-semibold text-gray-700">Управление базой данных</h1>
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
          {/* Предупреждение */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-orange-500 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium text-orange-900 mb-2">Внимание!</h3>
                  <p className="text-sm text-orange-800">
                    Операции на этой странице могут необратимо изменить или удалить данные.
                    Выполняйте их только если точно понимаете последствия.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Результат */}
          {result && (
            <Card className={result.includes("Ошибка") ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
              <CardContent className="p-4">
                <p className={result.includes("Ошибка") ? "text-red-800" : "text-green-800"}>
                  {result}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Инициализация полей */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-2" />
                Инициализация полей
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Создает базовую конфигурацию полей для всех этапов и уровней гипотез.
                  Полезно для первоначальной настройки системы.
                </p>
                <Button
                  onClick={initializeFields}
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? "Инициализация..." : "Инициализировать поля"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Очистка данных */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700">
                <Trash2 className="h-5 w-5 mr-2" />
                Полная очистка данных
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">Эта операция удалит:</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• Все гипотезы и идеи</li>
                    <li>• Все эксперименты и результаты</li>
                    <li>• Все ICE оценки и артефакты</li>
                    <li>• Всех пользователей кроме администраторов</li>
                    <li>• Конфигурацию полей</li>
                  </ul>
                  <p className="text-red-900 font-medium mt-3">
                    После очистки команда будет заново инициализирована.
                  </p>
                </div>

                {!showConfirm ? (
                  <Button
                    onClick={() => setShowConfirm(true)}
                    variant="destructive"
                    disabled={loading}
                  >
                    Показать форму очистки
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Пароль подтверждения:
                      </label>
                      <input
                        type="password"
                        placeholder="delete-all-data-2024"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCleanup}
                        variant="destructive"
                        disabled={loading}
                      >
                        {loading ? "Очистка..." : "Очистить все данные"}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowConfirm(false)
                          setConfirmPassword("")
                        }}
                        variant="outline"
                        disabled={loading}
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Информация о системе */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Информация о системе
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">База данных</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• PostgreSQL через Prisma ORM</li>
                    <li>• Автоматические миграции</li>
                    <li>• Транзакции для целостности данных</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Бэкапы</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Регулярные бэкапы через провайдера</li>
                    <li>• Возможность восстановления</li>
                    <li>• Мониторинг состояния БД</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}