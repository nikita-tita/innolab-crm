"use client"

import { signIn, getProviders } from "next-auth/react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null)
  const [email, setEmail] = useState("")

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    signIn("email", { email, callbackUrl: "/simple-dashboard" })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-900 rounded mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-lg font-bold">IL</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Войти в InnoLab
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Система тестирования продуктовых идей
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent className="py-8 px-6">
            <div className="space-y-6">
              {/* Email Sign In */}
              <form onSubmit={handleEmailSignIn}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email адрес
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    type="submit"
                    className="w-full"
                  >
                    Войти через Email
                  </Button>
                </div>
              </form>

              {/* Google Sign In */}
              {providers?.google && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Или</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => signIn("google", { callbackUrl: "/simple-dashboard" })}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Войти через Google
                  </Button>
                </>
              )}

              {/* Email Provider */}
              {providers?.email && !providers?.google && (
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Или</span>
                  </div>
                </div>
              )}

              {/* Demo Access */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  🚀 Быстрый доступ
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  Попробуйте систему без регистрации
                </p>
                <Link href="/simple-dashboard">
                  <Button variant="outline" size="sm" className="w-full">
                    Демо-режим
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-gray-600">
          Продолжая, вы соглашаетесь с{" "}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            условиями использования
          </a>
        </p>
      </div>
    </div>
  )
}