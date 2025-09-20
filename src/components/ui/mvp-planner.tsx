"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock, Target, Users, Zap } from "lucide-react";

interface MVPFeature {
  id: string;
  name: string;
  description: string;
  priority: "must-have" | "nice-to-have" | "future";
  effort: number; // в днях
  completed: boolean;
}

interface ExperimentType {
  id: string;
  name: string;
  description: string;
  timeline: string;
  icon: string;
  complexity: "low" | "medium" | "high";
}

export default function MVPPlanner() {
  const [selectedExperiment, setSelectedExperiment] = useState<string>("landing");

  const experimentTypes: ExperimentType[] = [
    {
      id: "landing",
      name: "Landing Page",
      description: "Создать посадочную страницу для проверки спроса",
      timeline: "2-3 дня",
      icon: "🌐",
      complexity: "low"
    },
    {
      id: "wizard-of-oz",
      name: "Wizard of Oz",
      description: "Имитировать автоматизацию вручную",
      timeline: "1 неделя",
      icon: "🎭",
      complexity: "medium"
    },
    {
      id: "prototype",
      name: "Интерактивный прототип",
      description: "Кликабельный прототип в Figma/Framer",
      timeline: "3-5 дней",
      icon: "🎨",
      complexity: "medium"
    },
    {
      id: "mvp",
      name: "Минимальный MVP",
      description: "Базовый рабочий продукт с ключевыми функциями",
      timeline: "2-4 недели",
      icon: "🚀",
      complexity: "high"
    },
    {
      id: "survey",
      name: "Опрос и интервью",
      description: "Глубинные интервью с целевой аудиторией",
      timeline: "1 неделя",
      icon: "📋",
      complexity: "low"
    }
  ];

  const mvpFeatures: MVPFeature[] = [
    {
      id: "1",
      name: "Регистрация пользователей",
      description: "Простая форма регистрации по email",
      priority: "must-have",
      effort: 2,
      completed: false
    },
    {
      id: "2",
      name: "Базовый функционал",
      description: "Минимальный набор функций для тестирования ценности",
      priority: "must-have",
      effort: 7,
      completed: false
    },
    {
      id: "3",
      name: "Система оплаты",
      description: "Интеграция с платежной системой",
      priority: "nice-to-have",
      effort: 5,
      completed: false
    },
    {
      id: "4",
      name: "Админ панель",
      description: "Базовая панель для управления",
      priority: "nice-to-have",
      effort: 4,
      completed: false
    },
    {
      id: "5",
      name: "Мобильная версия",
      description: "Адаптивная версия для мобильных",
      priority: "future",
      effort: 6,
      completed: false
    }
  ];

  const toggleFeature = (id: string) => {
    // В реальном приложении здесь будет API вызов
    console.log(`Toggle feature ${id}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "must-have": return "bg-red-100 text-red-800";
      case "nice-to-have": return "bg-yellow-100 text-yellow-800";
      case "future": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "high": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getTotalEffort = () => {
    return mvpFeatures
      .filter(f => f.priority === "must-have")
      .reduce((sum, f) => sum + f.effort, 0);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Target className="h-5 w-5" />
          Планирование эксперимента
        </h2>
        <p className="text-gray-600 mt-1">Выберите тип эксперимента и спланируйте MVP</p>
      </div>

      {/* Типы экспериментов */}
      <Card>
        <CardHeader>
          <CardTitle>Типы экспериментов для новых продуктов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {experimentTypes.map((type) => (
              <div
                key={type.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedExperiment === type.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedExperiment(type.id)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-medium">{type.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {type.timeline}
                      </Badge>
                      <span className={`text-xs font-medium ${getComplexityColor(type.complexity)}`}>
                        {type.complexity === "low" && "Простой"}
                        {type.complexity === "medium" && "Средний"}
                        {type.complexity === "high" && "Сложный"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* MVP функции (показываем только для MVP) */}
      {selectedExperiment === "mvp" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              MVP функции
            </CardTitle>
            <div className="text-sm text-gray-600">
              Общая оценка времени (must-have): <strong>{getTotalEffort()} дней</strong>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mvpFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <button
                    onClick={() => toggleFeature(feature.id)}
                    className="flex-shrink-0"
                  >
                    {feature.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{feature.name}</h4>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getPriorityColor(feature.priority)}`}
                      >
                        {feature.priority === "must-have" && "Обязательно"}
                        {feature.priority === "nice-to-have" && "Желательно"}
                        {feature.priority === "future" && "Будущее"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>

                  <div className="text-sm text-gray-500">
                    {feature.effort} {feature.effort === 1 ? "день" : "дней"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Следующие шаги */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Следующие шаги
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Circle className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Определить целевую аудиторию для тестирования</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Circle className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Настроить метрики и способы измерения успеха</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Circle className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Подготовить инструменты для сбора обратной связи</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Circle className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Запланировать временные рамки эксперимента</span>
            </div>
          </div>

          <div className="mt-6">
            <Button className="w-full">
              Запустить эксперимент
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}