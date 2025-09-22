"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Eye } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "TEAM_MEMBER"
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ошибка регистрации")
      }

      router.push("/auth/login?message=Регистрация успешна! Войдите в систему.")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const teamRoles = [
    { value: "TEAM_MEMBER", label: "Участник команды", description: "Общая роль для команды" },
    { value: "PRODUCT_MANAGER", label: "Product Manager", description: "Управление продуктом" },
    { value: "DESIGNER", label: "Дизайнер", description: "UX/UI дизайн" },
    { value: "MARKETER", label: "Маркетолог", description: "Маркетинг и продвижение" },
    { value: "ANALYST", label: "Аналитик", description: "Анализ данных" },
    { value: "MIDDLE_OFFICE", label: "Middle Office", description: "Поддержка процессов" },
    { value: "EXECUTIVE", label: "Руководитель", description: "Управление командой" }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            InnoLab CRM
          </Link>
          <p className="mt-2 text-gray-600">Регистрация в системе</p>
        </div>

        {/* Registration Types */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-blue-900">
                <UserPlus className="h-5 w-5 mr-2" />
                Регистрация для команды
                <Badge variant="default" className="ml-2">Активна</Badge>
              </CardTitle>
              <p className="text-sm text-blue-700">
                Для участников команды разработки продукта
              </p>
            </CardHeader>
          </Card>

          <Card className="border-gray-300 bg-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-gray-500">
                <Eye className="h-5 w-5 mr-2" />
                Доступ для наблюдателей
                <Badge variant="outline" className="ml-2">Через админку</Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Наблюдатели добавляются администратором вручную
              </p>
            </CardHeader>
          </Card>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Регистрация участника команды</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя и фамилия
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Введите имя и фамилию"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Введите email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Пароль
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Минимум 6 символов"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Роль в команде
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {teamRoles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label} - {role.description}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Уже есть аккаунт?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Войти в систему
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}