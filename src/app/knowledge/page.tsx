"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KnowledgeBase } from "@/components/ui/knowledge-base";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  TrendingUp,
  Lightbulb,
  BarChart3,
  Users,
  Clock,
  Award,
  Target
} from "lucide-react";

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function KnowledgePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("lessons");

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

  // Статистика пустая пока нет данных
  const stats = {
    totalLessons: 0,
    successRate: 0,
    avgConfidence: 0,
    topCategory: "Нет данных",
    recentLessons: 0,
    popularTags: []
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">InLab CRM</h1>
              <div className="text-sm text-gray-600">
                {session?.user?.name}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link href="/kanban" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2">
              <span>🌊</span>
              <span>Канбан</span>
            </Link>
            <Link href="/ideas" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2">
              <span>💡</span>
              <span>Идеи</span>
            </Link>
            <Link href="/hypotheses" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2">
              <span>🔬</span>
              <span>Гипотезы</span>
            </Link>
            <Link href="/experiments" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2">
              <span>⚗️</span>
              <span>Эксперименты</span>
            </Link>
            <Link href="/knowledge" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600 flex items-center space-x-2">
              <span>📚</span>
              <span>База знаний</span>
            </Link>
            <Link href="/dashboard" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2">
              <span>📊</span>
              <span>Статистика</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-6 space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="h-8 w-8" />
              База знаний
            </h1>
            <p className="text-gray-600 mt-2">
              Накапливайте и систематизируйте уроки из экспериментов и исследований
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-lg px-3 py-1">
              {stats.totalLessons} уроков
            </Badge>
          </div>
        </div>

      {/* Обзорная статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.successRate}%</div>
                <div className="text-sm text-gray-600">Уровень успеха</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.avgConfidence}%</div>
                <div className="text-sm text-gray-600">Средняя уверенность</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.recentLessons}</div>
                <div className="text-sm text-gray-600">За последний месяц</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-lg font-bold text-yellow-600">{stats.topCategory}</div>
                <div className="text-sm text-gray-600">Топ категория</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Основной контент */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lessons">
            <BookOpen className="h-4 w-4 mr-2" />
            Уроки из экспериментов
          </TabsTrigger>
          <TabsTrigger value="methodology">
            <Lightbulb className="h-4 w-4 mr-2" />
            Методология и шаблоны
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons">
          <KnowledgeBase />
        </TabsContent>

        <TabsContent value="methodology" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Методологические руководства */}
            <Card>
              <CardHeader>
                <CardTitle>Руководства по методологии</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">ICE Evaluation</h4>
                      <p className="text-sm text-gray-600">Командная оценка идей по критериям Impact, Confidence, Ease</p>
                    </div>
                    <Button variant="outline" size="sm">Открыть</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Desk Research</h4>
                      <p className="text-sm text-gray-600">Методы кабинетных исследований для проработки гипотез</p>
                    </div>
                    <Button variant="outline" size="sm">Открыть</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Методы валидации</h4>
                      <p className="text-sm text-gray-600">Быстрые и дешевые способы проверки гипотез</p>
                    </div>
                    <Button variant="outline" size="sm">Открыть</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Шаблоны и чек-листы */}
            <Card>
              <CardHeader>
                <CardTitle>Шаблоны и чек-листы</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Чек-лист планирования эксперимента</h4>
                      <p className="text-sm text-gray-600">7 шагов для правильной подготовки</p>
                    </div>
                    <Button variant="outline" size="sm">Скачать</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Шаблон отчета по результатам</h4>
                      <p className="text-sm text-gray-600">Структурированный формат выводов</p>
                    </div>
                    <Button variant="outline" size="sm">Скачать</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Калькулятор размера выборки</h4>
                      <p className="text-sm text-gray-600">Инструмент для расчета статистики</p>
                    </div>
                    <Button variant="outline" size="sm">Открыть</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Инновационная воронка */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Инновационная воронка InLab</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600 mb-1">💡</div>
                    <h4 className="font-medium text-sm mb-1">Идея</h4>
                    <p className="text-xs text-gray-600">Описание + ICE оценка</p>
                  </div>

                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600 mb-1">🔬</div>
                    <h4 className="font-medium text-sm mb-1">Гипотеза L1</h4>
                    <p className="text-xs text-gray-600">Формулировка</p>
                  </div>

                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-xl font-bold text-yellow-600 mb-1">📚</div>
                    <h4 className="font-medium text-sm mb-1">Гипотеза L2</h4>
                    <p className="text-xs text-gray-600">+ Desk research</p>
                  </div>

                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600 mb-1">⚗️</div>
                    <h4 className="font-medium text-sm mb-1">Эксперимент</h4>
                    <p className="text-xs text-gray-600">Валидация</p>
                  </div>

                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-xl font-bold text-emerald-600 mb-1">🚀</div>
                    <h4 className="font-medium text-sm mb-1">InLab</h4>
                    <p className="text-xs text-gray-600">Если подтверждена</p>
                  </div>

                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600 mb-1">🏢</div>
                    <h4 className="font-medium text-sm mb-1">М2</h4>
                    <p className="text-xs text-gray-600">Продуктовая линейка</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}