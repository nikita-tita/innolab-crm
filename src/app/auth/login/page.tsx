"use client"

import { useState, useEffect, Suspense } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogIn, Eye, UserPlus, Users } from "lucide-react"
import { TEAM_MEMBERS, OBSERVERS, getRoleDisplayName } from "@/lib/team-config"

function LoginPageContent() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [mode, setMode] = useState<"team" | "manual">("team")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get("message")

  useEffect(() => {
    // Проверяем, авторизован ли пользователь уже
    const checkAuth = async () => {
      const session = await getSession()
      if (session) {
        router.push("/dashboard")
      }
    }
    checkAuth()
  }, [router])

  const handleTeamLogin = async (userEmail: string, userPassword: string) => {
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: userEmail,
        password: userPassword,
        redirect: false,
      })

      if (result?.error) {
        setError("Ошибка авторизации")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError("Произошла ошибка")
    } finally {
      setLoading(false)
    }
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleTeamLogin(formData.email, formData.password)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            InnoLab CRM
          </Link>
          <p className="mt-2 text-gray-600">Выберите свой профиль для входа в систему</p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-700 text-sm">
            {message}
          </div>
        )}

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setMode("team")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === "team"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Команда лаборатории
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === "manual"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <LogIn className="h-4 w-4 inline mr-2" />
            Ручной ввод
          </button>
        </div>

        {mode === "team" ? (
          /* Team Selection Mode */
          <div className="space-y-6">
            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Команда лаборатории
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {TEAM_MEMBERS.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => handleTeamLogin(member.email, member.password)}
                      disabled={loading}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left disabled:opacity-50"
                    >
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium mr-4">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{getRoleDisplayName(member.role)}</div>
                      </div>
                      <div className="text-xs text-gray-400">{member.email}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Observers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Наблюдатели
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {OBSERVERS.map((observer) => (
                    <button
                      key={observer.id}
                      onClick={() => handleTeamLogin(observer.email, observer.password)}
                      disabled={loading}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left disabled:opacity-50"
                    >
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-medium mr-4">
                        {observer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{observer.name}</div>
                        <div className="text-sm text-gray-500">{getRoleDisplayName(observer.role)}</div>
                      </div>
                      <div className="text-xs text-gray-400">{observer.email}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Manual Input Mode */
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LogIn className="h-5 w-5 mr-2" />
                Ручной ввод данных
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
                    {error}
                  </div>
                )}

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
                    placeholder="Введите ваш email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Пароль
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Введите ваш пароль"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Вход..." : "Войти"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm text-gray-600">Авторизация...</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {/* Demo Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Демо-режим:</strong> Выберите любого участника команды для входа в систему.
            Пароли предустановлены для демонстрации функциональности.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}