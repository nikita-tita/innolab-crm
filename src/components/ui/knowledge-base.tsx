"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  Tag,
  Users,
  BarChart3
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  type: "SUCCESS" | "FAILURE" | "INSIGHT" | "METHODOLOGY";
  content: string;
  tags: string[];
  source: {
    type: "experiment" | "hypothesis" | "manual";
    id?: string;
    name?: string;
  };
  impact: "low" | "medium" | "high";
  confidence: number;
  applicability: string[];
  createdAt: Date;
  updatedAt: Date;
  author: string;
  views: number;
  rating: number;
  relatedLessons?: string[];
}

interface KnowledgeBaseProps {
  lessons?: Lesson[];
  onCreateLesson?: (lesson: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'rating'>) => void;
  onUpdateLesson?: (id: string, lesson: Partial<Lesson>) => void;
}

const mockLessons: Lesson[] = [
  {
    id: "1",
    title: "Мобильные push-уведомления увеличивают удержание на 35%",
    description: "Эксперимент показал значительное влияние персонализированных push-уведомлений на удержание пользователей",
    category: "Удержание пользователей",
    type: "SUCCESS",
    content: `## Контекст
Мы тестировали гипотезу о том, что мобильное приложение с push-уведомлениями увеличит удержание пользователей.

## Ключевые находки
- Персонализированные уведомления показали результат на 25% лучше общих
- Оптимальное время отправки: 19:00-21:00 в будние дни
- Частота: не более 2-3 уведомлений в неделю

## Применимость
Подходит для B2C продуктов с высокой частотой использования.`,
    tags: ["push-уведомления", "мобильное приложение", "удержание", "персонализация"],
    source: {
      type: "experiment",
      id: "exp-001",
      name: "A/B тест мобильного приложения"
    },
    impact: "high",
    confidence: 85,
    applicability: ["B2C", "мобильные приложения", "контент-продукты"],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    author: "demo@innolab.com",
    views: 124,
    rating: 4.8,
    relatedLessons: ["2", "3"]
  },
  {
    id: "2",
    title: "Слишком частые уведомления снижают конверсию на 40%",
    description: "Избыточные push-уведомления приводят к отключению уведомлений и снижению активности",
    category: "Удержание пользователей",
    type: "FAILURE",
    content: `## Что пошло не так
Отправка ежедневных уведомлений привела к массовому отключению push-уведомлений.

## Урок
- Более 3 уведомлений в неделю критически снижают engagement
- 68% пользователей отключили уведомления при ежедневной отправке
- Восстановление доверия заняло 2 месяца

## Рекомендации
Всегда тестируйте частоту уведомлений с небольшой группой пользователей.`,
    tags: ["push-уведомления", "частота", "отказы", "негативный опыт"],
    source: {
      type: "experiment",
      id: "exp-002",
      name: "Тест частоты уведомлений"
    },
    impact: "high",
    confidence: 92,
    applicability: ["B2C", "мобильные приложения"],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    author: "product@example.com",
    views: 89,
    rating: 4.5,
    relatedLessons: ["1"]
  },
  {
    id: "3",
    title: "RICE-scoring помогает приоритизировать гипотезы эффективнее ICE",
    description: "Сравнение методов приоритизации показало преимущества RICE перед ICE",
    category: "Методология",
    type: "INSIGHT",
    content: `## Сравнение методов
За 6 месяцев сравнили результаты приоритизации по RICE и ICE методам.

## Результаты
- RICE точнее предсказал успешность гипотез в 73% случаев против 58% у ICE
- Учет усилий (Effort) критически важен для ресурсного планирования
- Команды лучше понимают обоснование приоритетов с RICE

## Внедрение
Переход на RICE занял 2 недели обучения команды.`,
    tags: ["RICE", "приоритизация", "методология", "планирование"],
    source: {
      type: "manual"
    },
    impact: "medium",
    confidence: 78,
    applicability: ["все типы продуктов", "продуктовые команды"],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    author: "analyst@example.com",
    views: 156,
    rating: 4.2
  }
];

export function KnowledgeBase({ lessons = mockLessons, onCreateLesson, onUpdateLesson }: KnowledgeBaseProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const categories = Array.from(new Set(lessons.map(l => l.category)));
  const types = ["SUCCESS", "FAILURE", "INSIGHT", "METHODOLOGY"];

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || lesson.category === selectedCategory;
    const matchesType = selectedType === "all" || lesson.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SUCCESS": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "FAILURE": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "INSIGHT": return <Lightbulb className="h-4 w-4 text-yellow-600" />;
      case "METHODOLOGY": return <BookOpen className="h-4 w-4 text-blue-600" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "SUCCESS": return "bg-green-100 text-green-800";
      case "FAILURE": return "bg-red-100 text-red-800";
      case "INSIGHT": return "bg-yellow-100 text-yellow-800";
      case "METHODOLOGY": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "SUCCESS": return "Успех";
      case "FAILURE": return "Неудача";
      case "INSIGHT": return "Инсайт";
      case "METHODOLOGY": return "Методология";
      default: return type;
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case "high": return "Высокое";
      case "medium": return "Среднее";
      case "low": return "Низкое";
      default: return impact;
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{lessons.length}</div>
                <div className="text-sm text-gray-600">Всего уроков</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {lessons.filter(l => l.type === "SUCCESS").length}
                </div>
                <div className="text-sm text-gray-600">Успешных</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {lessons.filter(l => l.type === "FAILURE").length}
                </div>
                <div className="text-sm text-gray-600">Неудач</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {lessons.filter(l => l.type === "INSIGHT").length}
                </div>
                <div className="text-sm text-gray-600">Инсайтов</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Поиск и фильтры */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск по названию, описанию или тегам..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">Все категории</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="md:w-40">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">Все типы</option>
                {types.map(type => (
                  <option key={type} value={type}>{getTypeLabel(type)}</option>
                ))}
              </select>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить урок
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Список уроков */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Уроки ({filteredLessons.length})</h3>

          {filteredLessons.map((lesson) => (
            <Card
              key={lesson.id}
              className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedLesson?.id === lesson.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedLesson(lesson)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(lesson.type)}
                    <Badge className={getTypeColor(lesson.type)}>
                      {getTypeLabel(lesson.type)}
                    </Badge>
                    <Badge className={getImpactColor(lesson.impact)}>
                      {getImpactLabel(lesson.impact)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Users className="h-3 w-3" />
                    {lesson.views}
                    <BarChart3 className="h-3 w-3" />
                    {lesson.rating.toFixed(1)}
                  </div>
                </div>

                <h4 className="font-medium mb-2">{lesson.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>

                <div className="flex flex-wrap gap-1 mb-2">
                  {lesson.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {lesson.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{lesson.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{lesson.category}</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {lesson.createdAt.toLocaleDateString()}
                  </div>
                </div>

                {lesson.source.type !== "manual" && (
                  <div className="mt-2 text-xs text-blue-600">
                    Источник: {lesson.source.name}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {filteredLessons.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Уроки не найдены</p>
                <p className="text-sm text-gray-400 mt-1">Попробуйте изменить критерии поиска</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Детальный просмотр урока */}
        <div className="space-y-4">
          {selectedLesson ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getTypeIcon(selectedLesson.type)}
                  Урок: {selectedLesson.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getTypeColor(selectedLesson.type)}>
                    {getTypeLabel(selectedLesson.type)}
                  </Badge>
                  <Badge className={getImpactColor(selectedLesson.impact)}>
                    Влияние: {getImpactLabel(selectedLesson.impact)}
                  </Badge>
                  <Badge variant="outline">
                    Уверенность: {selectedLesson.confidence}%
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Описание</h4>
                  <p className="text-sm text-gray-600">{selectedLesson.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Содержание</h4>
                  <div className="text-sm prose max-w-none">
                    {selectedLesson.content.split('\n').map((line, index) => (
                      <p key={index} className="mb-2">{line}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Применимость</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedLesson.applicability.map((item) => (
                      <Badge key={item} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Теги</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedLesson.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Автор:</span>
                      <div className="text-gray-600">{selectedLesson.author}</div>
                    </div>
                    <div>
                      <span className="font-medium">Категория:</span>
                      <div className="text-gray-600">{selectedLesson.category}</div>
                    </div>
                    <div>
                      <span className="font-medium">Просмотры:</span>
                      <div className="text-gray-600">{selectedLesson.views}</div>
                    </div>
                    <div>
                      <span className="font-medium">Рейтинг:</span>
                      <div className="text-gray-600">{selectedLesson.rating.toFixed(1)}/5</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Выберите урок</h3>
                <p className="text-gray-500">
                  Выберите урок слева для просмотра подробной информации
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default KnowledgeBase;