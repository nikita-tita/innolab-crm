"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Lightbulb,
  BarChart3,
  Target
} from "lucide-react";

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"

export default function KnowledgePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("methodology");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }


  return (
    <AppLayout>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              📚 Обучение и методология
            </h1>
            <p className="text-gray-600 mt-2">
              Руководства по методологии инновационной воронки и инструменты для команды
            </p>
          </div>
          <div className="space-y-6">

      {/* Основной контент */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="methodology">
            <Lightbulb className="h-4 w-4 mr-2" />
            Руководства по методологии
          </TabsTrigger>
          <TabsTrigger value="templates">
            <BookOpen className="h-4 w-4 mr-2" />
            Шаблоны и чек-листы
          </TabsTrigger>
        </TabsList>

        <TabsContent value="methodology" className="space-y-6">
          <div className="space-y-6">
            {/* ICE Scoring */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  ICE Scoring - Командная оценка идей
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  ICE (Impact, Confidence, Ease) — метод быстрой оценки идей командой для приоритизации.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">📈 Impact (Влияние)</h4>
                    <p className="text-sm text-gray-700">Насколько сильно идея повлияет на ключевые метрики бизнеса</p>
                    <div className="mt-2 text-xs text-gray-600">
                      <strong>1-3:</strong> Минимальное влияние<br/>
                      <strong>4-7:</strong> Среднее влияние<br/>
                      <strong>8-10:</strong> Высокое влияние
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">🎯 Confidence (Уверенность)</h4>
                    <p className="text-sm text-gray-700">Насколько команда уверена в успехе этой идеи</p>
                    <div className="mt-2 text-xs text-gray-600">
                      <strong>1-3:</strong> Низкая уверенность<br/>
                      <strong>4-7:</strong> Средняя уверенность<br/>
                      <strong>8-10:</strong> Высокая уверенность
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">⚡ Ease (Простота)</h4>
                    <p className="text-sm text-gray-700">Насколько легко реализовать эту идею</p>
                    <div className="mt-2 text-xs text-gray-600">
                      <strong>1-3:</strong> Сложная реализация<br/>
                      <strong>4-7:</strong> Средняя сложность<br/>
                      <strong>8-10:</strong> Простая реализация
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold mb-2">💡 Как использовать ICE:</h4>
                  <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    <li>Каждый участник команды оценивает идею по трем критериям от 1 до 10</li>
                    <li>Вычисляется средний балл по каждому критерию</li>
                    <li>ICE Score = (Impact + Confidence + Ease) / 3</li>
                    <li>Идеи ранжируются по итоговому баллу</li>
                  </ol>
                </div>

                <Button className="w-full">
                  ➕ Добавить материал по ICE
                </Button>
              </CardContent>
            </Card>

            {/* RICE Scoring */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  RICE Scoring - Приоритизация гипотез
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  RICE (Reach × Impact × Confidence ÷ Effort) — метод количественной оценки гипотез для определения приоритетов в разработке.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">👥 Reach (Охват)</h4>
                    <p className="text-sm text-gray-700">Сколько пользователей затронет изменение за период</p>
                    <div className="mt-2 text-xs text-gray-600">
                      Число пользователей в месяц/квартал
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">📈 Impact (Влияние)</h4>
                    <p className="text-sm text-gray-700">Насколько сильно изменение повлияет на каждого пользователя</p>
                    <div className="mt-2 text-xs text-gray-600">
                      <strong>1:</strong> Минимальное<br/>
                      <strong>2:</strong> Низкое<br/>
                      <strong>3:</strong> Среднее<br/>
                      <strong>4:</strong> Высокое<br/>
                      <strong>5:</strong> Огромное
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">🎯 Confidence (Уверенность)</h4>
                    <p className="text-sm text-gray-700">Насколько мы уверены в оценках</p>
                    <div className="mt-2 text-xs text-gray-600">
                      Процент уверенности (0-100%)
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">⏱️ Effort (Усилия)</h4>
                    <p className="text-sm text-gray-700">Сколько времени команды потребуется</p>
                    <div className="mt-2 text-xs text-gray-600">
                      Человеко-дни или недели
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">🧮 Формула RICE:</h4>
                  <div className="text-center p-4 bg-white rounded border-2 border-dashed border-green-300">
                    <div className="text-lg font-mono">
                      RICE Score = (Reach × Impact × Confidence) ÷ Effort
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Чем выше балл, тем выше приоритет гипотезы
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">📋 Пример расчета:</h4>
                  <div className="text-sm text-gray-700">
                    <strong>Гипотеза:</strong> Упрощение формы регистрации<br/>
                    <strong>Reach:</strong> 1000 пользователей/месяц<br/>
                    <strong>Impact:</strong> 3 (среднее влияние)<br/>
                    <strong>Confidence:</strong> 80%<br/>
                    <strong>Effort:</strong> 5 человеко-дней<br/>
                    <strong>RICE:</strong> (1000 × 3 × 0.8) ÷ 5 = 480
                  </div>
                </div>

                <Button className="w-full">
                  ➕ Добавить материал по RICE
                </Button>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="space-y-6">
            {/* Пустое состояние для шаблонов */}
            <Card>
              <CardHeader>
                <CardTitle>Шаблоны и чек-листы</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Пока нет шаблонов</h3>
                  <p className="text-gray-600 mb-4">
                    Здесь будут размещаться чек-листы, шаблоны отчетов и другие материалы для работы
                  </p>
                  <Button>
                    ➕ Добавить шаблон
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

      </Tabs>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}