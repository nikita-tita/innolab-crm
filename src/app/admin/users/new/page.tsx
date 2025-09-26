"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, UserPlus } from "lucide-react"
import Link from "next/link"

const ROLES = [
  { value: "LAB_DIRECTOR", label: "Директор лаборатории" },
  { value: "PRODUCT_MANAGER", label: "Продакт-менеджер" },
  { value: "UX_RESEARCHER", label: "UX-исследователь" },
  { value: "MARKETER", label: "Маркетолог" },
  { value: "SALES_EXPERT", label: "Эксперт по продажам" },
  { value: "OPERATIONS_EXPERT", label: "Эксперт по операциям" },
  { value: "HYPOTHESIS_OWNER", label: "Владелец гипотезы" },
  { value: "VIEWER", label: "Наблюдатель" },
  { value: "STAKEHOLDER", label: "Стейкхолдер" },
  { value: "ADMIN", label: "Администратор" }
]

export default function NewUserPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "VIEWER",
    password: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const user = await response.json()
        setSuccess(`Пользователь ${user.name || user.email} успешно создан!`)
        setFormData({
          name: "",
          email: "",
          role: "VIEWER",
          password: ""
        })
        setTimeout(() => {
          router.push("/admin/users")
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Ошибка при создании пользователя")
      }
    } catch (error) {
      setError("Произошла ошибка при создании пользователя")
      console.error("Error creating user:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Проверка доступа
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "LAB_DIRECTOR")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600">У вас нет доступа к этой странице</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard">
                  Вернуться к панели управления
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/admin/users">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Создание пользователя</h1>
                <p className="text-sm text-gray-600">Добавить нового участника команды</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {session.user?.name || session.user?.email}
              </div>
              <Link
                href="/admin"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← К админке
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5" />
                <span>Новый пользователь</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя пользователя</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Введите имя"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Роль</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleInputChange("role", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите роль" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Временный пароль</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Минимум 6 символов"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Информация</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Пользователь получит временный пароль для первого входа</li>
                    <li>• После входа рекомендуется сменить пароль</li>
                    <li>• Роль можно изменить позже в настройках пользователя</li>
                    <li>• Пользователь будет активен сразу после создания</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/admin/users">
                      Отмена
                    </Link>
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Создание...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Создать пользователя
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}