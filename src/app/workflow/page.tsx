"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Lightbulb,
  Calculator,
  Target,
  FileSearch,
  TestTube,
  PlayCircle,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Users
} from "lucide-react"

interface StageData {
  ideas: number
  hypotheses: number
  experiments: number
}

export default function WorkflowPage() {
  const [stageData, setStageData] = useState<StageData>({
    ideas: 0,
    hypotheses: 0,
    experiments: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ideasRes, hypothesesRes, experimentsRes] = await Promise.all([
          fetch('/api/ideas'),
          fetch('/api/hypotheses'),
          fetch('/api/experiments')
        ])

        const [ideas, hypotheses, experiments] = await Promise.all([
          ideasRes.json(),
          hypothesesRes.json(),
          experimentsRes.json()
        ])

        setStageData({
          ideas: ideas.length || 0,
          hypotheses: hypotheses.length || 0,
          experiments: experiments.length || 0
        })
      } catch (error) {
        console.error('Error fetching workflow data:', error)
      }
    }

    fetchData()
  }, [])

  const stages = [
    {
      id: 1,
      title: "Сбор идей",
      description: "Накопление и первичная фиксация идей от всех участников команды",
      icon: Lightbulb,
      color: "bg-blue-500",
      count: stageData.ideas,
      actions: ["Создать идею", "Просмотр банка идей"],
      links: ["/ideas/new", "/ideas"],
      status: "NEW"
    },
    {
      id: 2,
      title: "RICE-приоритизация",
      description: "Оценка идей по методологии RICE для определения приоритетов",
      icon: Calculator,
      color: "bg-purple-500",
      count: stageData.ideas,
      actions: ["Оценить идеи", "Просмотр рейтинга"],
      links: ["/ideas", "/ideas"],
      status: "SCORED"
    },
    {
      id: 3,
      title: "Отбор для проработки",
      description: "Выбор высокоприоритетных идей для создания гипотез",
      icon: Target,
      color: "bg-green-500",
      count: Math.floor(stageData.ideas * 0.3),
      actions: ["Отобрать идеи", "Создать гипотезу"],
      links: ["/ideas", "/hypotheses/new"],
      status: "SELECTED"
    },
    {
      id: 4,
      title: "Формулирование гипотез",
      description: "Создание проверяемых гипотез в формате 'Если X, то Y, потому что Z'",
      icon: FileSearch,
      color: "bg-yellow-500",
      count: stageData.hypotheses,
      actions: ["Создать гипотезу", "Использовать шаблон"],
      links: ["/hypotheses/new", "/hypotheses/new"],
      status: "DRAFT"
    },
    {
      id: 5,
      title: "RICE-оценка гипотез",
      description: "Приоритизация гипотез для определения очередности тестирования",
      icon: Calculator,
      color: "bg-purple-500",
      count: stageData.hypotheses,
      actions: ["Оценить гипотезы", "Просмотр рейтинга"],
      links: ["/hypotheses", "/hypotheses"],
      status: "SCORED"
    },
    {
      id: 6,
      title: "Desk Research",
      description: "Кабинетное исследование существующих данных и источников",
      icon: FileSearch,
      color: "bg-indigo-500",
      count: Math.floor(stageData.hypotheses * 0.8),
      actions: ["Провести исследование", "Просмотр гипотез"],
      links: ["/hypotheses", "/hypotheses"],
      status: "DESK_RESEARCH"
    },
    {
      id: 7,
      title: "Планирование эксперимента",
      description: "Детальное планирование методов тестирования гипотезы",
      icon: TestTube,
      color: "bg-orange-500",
      count: Math.floor(stageData.hypotheses * 0.6),
      actions: ["Планировать эксперимент", "Использовать планировщик"],
      links: ["/experiments/new", "/experiments/planner"],
      status: "READY_FOR_TESTING"
    },
    {
      id: 8,
      title: "Проведение эксперимента",
      description: "Выполнение запланированного эксперимента и сбор данных",
      icon: PlayCircle,
      color: "bg-red-500",
      count: stageData.experiments,
      actions: ["Запустить эксперимент", "Отслеживать прогресс"],
      links: ["/experiments", "/experiments"],
      status: "IN_EXPERIMENT"
    },
    {
      id: 9,
      title: "Анализ результатов",
      description: "Обработка данных и принятие решения о подтверждении гипотезы",
      icon: BarChart3,
      color: "bg-emerald-500",
      count: Math.floor(stageData.experiments * 0.7),
      actions: ["Анализировать результаты", "Сделать выводы"],
      links: ["/experiments", "/knowledge"],
      status: "VALIDATED"
    }
  ]

  const getConversionRate = (current: number, next: number) => {
    if (current === 0) return 0
    return Math.round((next / current) * 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
                InnoLab CRM
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/methodology"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Методология
              </Link>
              <Link
                href="/simple-dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Дашборд
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Воронка инновационного процесса</h1>
          <p className="mt-2 text-lg text-gray-600">
            8-этапный процесс превращения идей в проверенные решения
          </p>
        </div>

        {/* Process Overview */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Обзор процесса</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stageData.ideas}</div>
              <div className="text-sm text-gray-600">Всего идей</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stageData.hypotheses}</div>
              <div className="text-sm text-gray-600">Гипотез создано</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stageData.experiments}</div>
              <div className="text-sm text-gray-600">Экспериментов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stageData.ideas > 0 ? Math.round((stageData.experiments / stageData.ideas) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Конверсия идея→эксперимент</div>
            </div>
          </div>
        </div>

        {/* Workflow Stages */}
        <div className="space-y-6">
          {stages.map((stage, index) => {
            const Icon = stage.icon
            const nextStage = stages[index + 1]
            const conversionRate = nextStage ? getConversionRate(stage.count, nextStage.count) : null

            return (
              <div key={stage.id}>
                <Card className="relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${stage.color}`} />
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${stage.color} text-white`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{stage.id}. {stage.title}</CardTitle>
                          <p className="text-gray-600 mt-1">{stage.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{stage.count}</div>
                        <div className="text-sm text-gray-500">элементов</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {stage.actions.map((action, actionIndex) => (
                          <Link key={actionIndex} href={stage.links[actionIndex]}>
                            <Button variant="outline" size="sm">
                              {action}
                            </Button>
                          </Link>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{stage.status}</Badge>
                        {stage.id <= 3 && (
                          <Badge variant="outline">
                            <Users className="h-3 w-3 mr-1" />
                            Команда
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Conversion Arrow */}
                {conversionRate !== null && (
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">
                        Конверсия: {conversionRate}%
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Success Metrics */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            <CheckCircle2 className="h-6 w-6 inline mr-2 text-green-600" />
            Ключевые метрики процесса
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-medium text-gray-900">Качество идей</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {stageData.hypotheses > 0 ? Math.round((stageData.hypotheses / Math.max(stageData.ideas, 1)) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-600">идей превращаются в гипотезы</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-medium text-gray-900">Эффективность тестирования</h3>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {stageData.experiments > 0 ? Math.round((stageData.experiments / Math.max(stageData.hypotheses, 1)) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-600">гипотез тестируются</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-medium text-gray-900">Общая эффективность</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {Math.round(((stageData.experiments * 0.7) / Math.max(stageData.ideas, 1)) * 100)}%
              </p>
              <p className="text-sm text-gray-600">идей приводят к результату</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Быстрые действия</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/ideas/new">
              <Button className="w-full" variant="outline">
                <Lightbulb className="h-4 w-4 mr-2" />
                Добавить идею
              </Button>
            </Link>
            <Link href="/hypotheses/new">
              <Button className="w-full" variant="outline">
                <FileSearch className="h-4 w-4 mr-2" />
                Создать гипотезу
              </Button>
            </Link>
            <Link href="/experiments/new">
              <Button className="w-full" variant="outline">
                <TestTube className="h-4 w-4 mr-2" />
                Запланировать эксперимент
              </Button>
            </Link>
            <Link href="/knowledge">
              <Button className="w-full" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                База знаний
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}