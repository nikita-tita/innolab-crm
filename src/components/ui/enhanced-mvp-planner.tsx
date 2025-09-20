"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock, Target, Users, Zap, ArrowRight, ChevronDown, ChevronRight } from "lucide-react";

interface ExperimentType {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  timeline: string;
  cost: string;
  icon: string;
  complexity: "low" | "medium" | "high";
  category: "validation" | "market" | "product";
  theory: {
    concept: string;
    howItWorks: string;
    whenToUse: string;
    example: string;
  };
  steps: string[];
  metrics: string[];
}

export default function EnhancedMVPPlanner() {
  const [selectedExperiment, setSelectedExperiment] = useState<string>("landing");
  const [expandedTheory, setExpandedTheory] = useState<string | null>(null);

  const experimentTypes: ExperimentType[] = [
    {
      id: "landing",
      name: "Landing Page",
      shortDescription: "Проверьте спрос до создания продукта",
      fullDescription: "Создание простой посадочной страницы для измерения интереса к продукту",
      timeline: "1-3 дня",
      cost: "Почти бесплатно",
      icon: "🌐",
      complexity: "low",
      category: "validation",
      theory: {
        concept: "Fake Door (Фальшивая дверь)",
        howItWorks: "Вы создаете лендинг, который выглядит как настоящий продукт, но на самом деле просто собирает email'ы заинтересованных. Когда пользователь нажимает 'Купить' или 'Зарегистрироваться', он видит 'Скоро запустимся!'",
        whenToUse: "Когда нужно быстро проверить, есть ли спрос на продукт. Подходит для B2C и B2B продуктов.",
        example: "Дропбокс создал простое видео, показывающее как работает продукт, и измерил количество регистраций на бета-тест."
      },
      steps: [
        "Создайте простой лендинг с описанием продукта",
        "Добавьте призыв к действию (кнопка 'Купить' или 'Попробовать')",
        "Настройте аналитику для отслеживания конверсий",
        "Запустите трафик (соцсети, контекстная реклама)",
        "Измерьте конверсию в клики/регистрации"
      ],
      metrics: ["Конверсия в клики", "Конверсия в email-подписки", "Время на сайте", "Показатель отказов"]
    },
    {
      id: "surveys-jtbd",
      name: "Опросы по Jobs-to-be-Done",
      shortDescription: "Поймите, какую 'работу' пользователи нанимают ваш продукт выполнять",
      fullDescription: "Структурированные интервью для понимания мотивации и контекста покупки",
      timeline: "1-2 недели",
      cost: "Время команды",
      icon: "📋",
      complexity: "medium",
      category: "market",
      theory: {
        concept: "Jobs-to-be-Done Framework",
        howItWorks: "Люди 'нанимают' продукты для выполнения определенной 'работы' в их жизни. Вместо изучения демографии, мы изучаем ситуации, в которых люди покупают продукт.",
        whenToUse: "Когда нужно понять мотивацию покупки и улучшить продукт под реальные потребности пользователей.",
        example: "Макдоналдс выяснил, что молочные коктейли покупают утром не как десерт, а как завтрак в дороге - удобный, сытный и долгий."
      },
      steps: [
        "Найдите людей, которые недавно купили похожий продукт",
        "Проведите интервью: Когда вы впервые подумали о покупке?",
        "Узнайте: Что происходило в вашей жизни в тот момент?",
        "Выясните: Что вы пробовали раньше? Почему не подошло?",
        "Поймите: Что значит для вас прогресс в этой ситуации?"
      ],
      metrics: ["Ключевые 'работы'", "Триггеры покупки", "Барьеры для покупки", "Критерии успеха"]
    },
    {
      id: "fake-door-sales",
      name: "Прямые продажи",
      shortDescription: "Продавайте продукт до его создания",
      fullDescription: "Попробуйте продать концепцию продукта напрямую потенциальным клиентам",
      timeline: "2-4 недели",
      cost: "Время на продажи",
      icon: "💰",
      complexity: "high",
      category: "validation",
      theory: {
        concept: "Pre-selling (Предварительная продажа)",
        howItWorks: "Вы буквально пытаетесь продать продукт, которого еще нет. Объясняете концепцию, показываете макеты, и просите деньги или предзаказ. Если люди готовы платить за идею - спрос есть.",
        whenToUse: "Для дорогих B2B продуктов или когда нужна максимальная уверенность в спросе перед большими инвестициями.",
        example: "Основатели Groupon продавали купоны вручную через PDF-файлы, чтобы проверить модель до создания платформы."
      },
      steps: [
        "Подготовьте презентацию концепции продукта",
        "Создайте простые макеты или прототип",
        "Составьте список потенциальных клиентов",
        "Проведите встречи и попытайтесь продать",
        "Зафиксируйте предзаказы или намерения купить"
      ],
      metrics: ["Конверсия встреч в продажи", "Размер предоплаты", "Возражения клиентов", "Готовность ждать запуска"]
    },
    {
      id: "wizard-of-oz",
      name: "Wizard of Oz",
      shortDescription: "Имитируйте автоматизацию вручную",
      fullDescription: "Создайте видимость автоматизированного продукта, выполняя функции вручную",
      timeline: "1 неделя",
      cost: "Время команды",
      icon: "🎭",
      complexity: "medium",
      category: "product",
      theory: {
        concept: "Concierge MVP (Консьерж-MVP)",
        howItWorks: "Пользователи видят полноценный продукт, но за кулисами все процессы выполняются людьми. Это позволяет протестировать ценность без создания технологии.",
        whenToUse: "Когда продукт предполагает сложную автоматизацию, но нужно быстро проверить ценность сервиса.",
        example: "Zappos начинал с того, что основатель покупал обувь в магазинах и отправлял клиентам, имитируя интернет-магазин."
      },
      steps: [
        "Определите, какие процессы можно имитировать вручную",
        "Создайте простой интерфейс для пользователей",
        "Организуйте команду для ручного выполнения задач",
        "Запустите тест с ограниченным числом пользователей",
        "Измерьте удовлетворенность результатом"
      ],
      metrics: ["Удовлетворенность сервисом", "Время выполнения задач", "Готовность платить", "Частота использования"]
    },
    {
      id: "prototype",
      name: "Интерактивный прототип",
      shortDescription: "Кликабельный макет для тестирования UX",
      fullDescription: "Создание интерактивного прототипа для тестирования пользовательского опыта",
      timeline: "3-7 дней",
      cost: "Низкая",
      icon: "🎨",
      complexity: "medium",
      category: "product",
      theory: {
        concept: "Paper Prototyping/Digital Mockup",
        howItWorks: "Создается интерактивная модель продукта без реального функционала. Пользователи могут 'использовать' продукт и давать обратную связь по UX.",
        whenToUse: "Когда нужно протестировать удобство использования и понятность интерфейса перед разработкой.",
        example: "Instagram начинался как прототип Burbn - приложения для чекинов, но тесты показали, что людей интересуют только фото."
      },
      steps: [
        "Создайте схему пользовательских сценариев",
        "Сделайте интерактивный прототип в Figma/Framer",
        "Найдите 5-10 представителей целевой аудитории",
        "Проведите тестирование юзабилити",
        "Соберите обратную связь и доработайте"
      ],
      metrics: ["Время выполнения задач", "Количество ошибок", "Удовлетворенность интерфейсом", "Понятность функций"]
    },
    {
      id: "mvp",
      name: "Минимальный MVP",
      shortDescription: "Простейшая рабочая версия продукта",
      fullDescription: "Базовый рабочий продукт с минимальным набором функций",
      timeline: "2-8 недель",
      cost: "Средняя-высокая",
      icon: "🚀",
      complexity: "high",
      category: "product",
      theory: {
        concept: "Minimum Viable Product",
        howItWorks: "Создается простейшая версия продукта, которая решает основную проблему пользователей. Цель - максимально быстро получить обратную связь от реальных пользователей.",
        whenToUse: "Когда другие методы уже подтвердили спрос, и нужно протестировать продуктовое решение.",
        example: "Первая версия Airbnb была простым сайтом с фотографиями надувных матрасов в квартире основателей."
      },
      steps: [
        "Определите минимальный набор функций",
        "Создайте техническое задание",
        "Разработайте и протестируйте MVP",
        "Запустите для ограниченной аудитории",
        "Соберите метрики и обратную связь"
      ],
      metrics: ["Активные пользователи", "Retention rate", "Конверсия в платежи", "Отзывы пользователей"]
    }
  ];

  const selectedExperimentData = experimentTypes.find(exp => exp.id === selectedExperiment);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low": return "text-green-600 bg-green-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "high": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "validation": return "text-blue-600 bg-blue-50";
      case "market": return "text-purple-600 bg-purple-50";
      case "product": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Выберите тип эксперимента</h1>
        <p className="text-gray-600">Каждый эксперимент проверяет разные аспекты вашей идеи</p>
      </div>

      {/* Эксперименты */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {experimentTypes.map((experiment) => (
          <Card
            key={experiment.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedExperiment === experiment.id ? "ring-2 ring-blue-500 shadow-lg" : ""
            }`}
            onClick={() => setSelectedExperiment(experiment.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-3xl">{experiment.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{experiment.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{experiment.shortDescription}</p>

                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`text-xs ${getComplexityColor(experiment.complexity)}`}>
                      {experiment.complexity === "low" && "Простой"}
                      {experiment.complexity === "medium" && "Средний"}
                      {experiment.complexity === "high" && "Сложный"}
                    </Badge>
                    <Badge className={`text-xs ${getCategoryColor(experiment.category)}`}>
                      {experiment.category === "validation" && "Валидация"}
                      {experiment.category === "market" && "Рынок"}
                      {experiment.category === "product" && "Продукт"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {experiment.timeline}
                    </span>
                    <span>{experiment.cost}</span>
                  </div>
                </div>
              </div>

              {/* Теория (сворачиваемая) */}
              <div className="border-t pt-4">
                <button
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedTheory(expandedTheory === experiment.id ? null : experiment.id);
                  }}
                >
                  {expandedTheory === experiment.id ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  Как это работает
                </button>

                {expandedTheory === experiment.id && (
                  <div className="mt-3 space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Концепция:</span>
                      <p className="text-gray-600 mt-1">{experiment.theory.concept}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Как работает:</span>
                      <p className="text-gray-600 mt-1">{experiment.theory.howItWorks}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Когда использовать:</span>
                      <p className="text-gray-600 mt-1">{experiment.theory.whenToUse}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Пример:</span>
                      <p className="text-gray-600 mt-1">{experiment.theory.example}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Детали выбранного эксперимента */}
      {selectedExperimentData && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="text-2xl">{selectedExperimentData.icon}</span>
              План эксперимента: {selectedExperimentData.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600">{selectedExperimentData.fullDescription}</p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Шаги */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Шаги выполнения</h3>
                <div className="space-y-2">
                  {selectedExperimentData.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-600">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Метрики */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Ключевые метрики</h3>
                <div className="space-y-2">
                  {selectedExperimentData.metrics.map((metric, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button className="flex-1">
                Запустить этот эксперимент
              </Button>
              <Button variant="outline">
                Сохранить план
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}