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

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState("lessons");

  // Статистика для демонстрации
  const stats = {
    totalLessons: 47,
    successRate: 68,
    avgConfidence: 82,
    topCategory: "Удержание пользователей",
    recentLessons: 12,
    popularTags: ["персонализация", "A/B тесты", "push-уведомления", "конверсия", "UX"]
  };

  return (
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
                      <h4 className="font-medium">RICE Prioritization</h4>
                      <p className="text-sm text-gray-600">Как правильно оценивать идеи и гипотезы</p>
                    </div>
                    <Button variant="outline" size="sm">Открыть</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Desk Research</h4>
                      <p className="text-sm text-gray-600">Методы кабинетных исследований</p>
                    </div>
                    <Button variant="outline" size="sm">Открыть</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">A/B Testing Best Practices</h4>
                      <p className="text-sm text-gray-600">Лучшие практики проведения экспериментов</p>
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

            {/* Процесс HADI */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Процесс HADI + RICE</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">H</div>
                    <h4 className="font-medium mb-1">Hypothesis</h4>
                    <p className="text-xs text-gray-600">Формулирование проверяемых гипотез с RICE-оценкой</p>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">A</div>
                    <h4 className="font-medium mb-1">Action</h4>
                    <p className="text-xs text-gray-600">Планирование и проведение экспериментов</p>
                  </div>

                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 mb-2">D</div>
                    <h4 className="font-medium mb-1">Data</h4>
                    <p className="text-xs text-gray-600">Сбор и анализ результатов тестирования</p>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-2">I</div>
                    <h4 className="font-medium mb-1">Insights</h4>
                    <p className="text-xs text-gray-600">Извлечение уроков и планирование следующих шагов</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}