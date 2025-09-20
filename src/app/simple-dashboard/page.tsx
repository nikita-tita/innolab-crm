"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Lightbulb,
  Target,
  FlaskConical,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react";

interface WorkspaceItem {
  id: string;
  title: string;
  type: "idea" | "hypothesis" | "experiment";
  status: string;
  priority?: "high" | "medium" | "low";
  updatedAt: string;
  assignee?: string;
  riceScore?: number;
}

export default function SimpleDashboard() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [workspaceItems, setWorkspaceItems] = useState<WorkspaceItem[]>([]);
  const [stats, setStats] = useState({
    ideas: 0,
    hypotheses: 0,
    experiments: 0,
    successRate: 0
  });

  // Загрузка данных
  const fetchData = async () => {
    try {
      const [ideasRes, hypothesesRes, experimentsRes] = await Promise.all([
        fetch('/api/ideas'),
        fetch('/api/hypotheses'),
        fetch('/api/experiments')
      ]);

      const ideas = ideasRes.ok ? await ideasRes.json() : [];
      const hypotheses = hypothesesRes.ok ? await hypothesesRes.json() : [];
      const experiments = experimentsRes.ok ? await experimentsRes.json() : [];

      // Формируем items для workspace
      const items: WorkspaceItem[] = [
        ...ideas.map((idea: any) => ({
          id: idea.id,
          title: idea.title,
          type: "idea" as const,
          status: idea.status || "Новая",
          priority: idea.priority?.toLowerCase(),
          updatedAt: "недавно",
          assignee: idea.author || "Неизвестно",
          riceScore: idea.riceScore
        })),
        ...hypotheses.map((hyp: any) => ({
          id: hyp.id,
          title: hyp.hypothesis,
          type: "hypothesis" as const,
          status: hyp.status || "Новая",
          priority: hyp.priority?.toLowerCase(),
          updatedAt: "недавно",
          assignee: hyp.author || "Неизвестно",
          riceScore: hyp.riceScore
        })),
        ...experiments.map((exp: any) => ({
          id: exp.id,
          title: exp.name,
          type: "experiment" as const,
          status: exp.status || "Новый",
          priority: exp.priority?.toLowerCase(),
          updatedAt: "недавно",
          assignee: exp.author || "Неизвестно"
        }))
      ];

      setWorkspaceItems(items);

      // Статистика
      const validatedHypotheses = hypotheses.filter((h: any) => h.status === 'VALIDATED');
      const successRate = hypotheses.length > 0
        ? Math.round((validatedHypotheses.length / hypotheses.length) * 100)
        : 0;

      setStats({
        ideas: ideas.length,
        hypotheses: hypotheses.length,
        experiments: experiments.length,
        successRate
      });

    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      // Fallback к моковым данным
      const mockItems: WorkspaceItem[] = [
        {
          id: "1",
          title: "Сервис аренды автомобилей по подписке",
          type: "idea",
          status: "В работе",
          priority: "high",
          updatedAt: "2 часа назад",
          assignee: "Мария К.",
          riceScore: 15.2
        },
        {
          id: "2",
          title: "Если запустить MVP каршеринга, то 500+ пользователей подпишутся",
          type: "hypothesis",
          status: "Тестирование",
          priority: "high",
          updatedAt: "1 день назад",
          assignee: "Алексей И.",
          riceScore: 12.8
        },
        {
          id: "3",
          title: "AI-помощник для малого бизнеса",
          type: "idea",
          status: "Новая",
          priority: "medium",
          updatedAt: "3 дня назад",
          assignee: "Ольга П.",
          riceScore: 13.4
        },
        {
          id: "4",
          title: "Landing Page - каршеринг по подписке",
          type: "experiment",
          status: "Завершен",
          priority: "high",
          updatedAt: "1 неделя назад",
          assignee: "Мария К."
        }
      ];

      setWorkspaceItems(mockItems);
      setStats({
        ideas: 3,
        hypotheses: 3,
        experiments: 2,
        successRate: 67
      });
    }
  };

  // Загружаем данные при монтировании
  useEffect(() => {
    fetchData();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "idea": return <Lightbulb className="h-4 w-4" />;
      case "hypothesis": return <Target className="h-4 w-4" />;
      case "experiment": return <FlaskConical className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "idea": return "text-blue-600 bg-blue-50";
      case "hypothesis": return "text-purple-600 bg-purple-50";
      case "experiment": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const filteredItems = workspaceItems.filter(item => {
    const matchesFilter = activeFilter === "all" || item.type === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Notion-style header */}
      <div className="border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-bold">IL</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">InnoLab</h1>
                  <p className="text-xs text-gray-500">Workspace</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Новое
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.ideas}</div>
                  <div className="text-sm text-gray-600">Идей</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.hypotheses}</div>
                  <div className="text-sm text-gray-600">Гипотез</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.experiments}</div>
                  <div className="text-sm text-gray-600">Экспериментов</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.successRate}%</div>
                  <div className="text-sm text-gray-600">Успешность</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск идей, гипотез, экспериментов..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("all")}
            >
              Все
            </Button>
            <Button
              variant={activeFilter === "idea" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("idea")}
            >
              Идеи
            </Button>
            <Button
              variant={activeFilter === "hypothesis" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("hypothesis")}
            >
              Гипотезы
            </Button>
            <Button
              variant={activeFilter === "experiment" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("experiment")}
            >
              Эксперименты
            </Button>
          </div>
        </div>

        {/* Items list */}
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      {item.priority && (
                        <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                          {item.priority === "high" && "Высокий"}
                          {item.priority === "medium" && "Средний"}
                          {item.priority === "low" && "Низкий"}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{item.status}</span>
                      <span>•</span>
                      <span>{item.assignee}</span>
                      <span>•</span>
                      <span>{item.updatedAt}</span>
                      {item.riceScore && (
                        <>
                          <span>•</span>
                          <span className="font-medium">RICE: {item.riceScore}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Link href="/ideas/simple">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Lightbulb className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Добавить идею</h3>
                <p className="text-sm text-gray-600">Зафиксируйте новую идею продукта</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/hypotheses/new">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Создать гипотезу</h3>
                <p className="text-sm text-gray-600">Превратите идею в проверяемую гипотезу</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/experiments/planner">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <FlaskConical className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Запустить эксперимент</h3>
                <p className="text-sm text-gray-600">Выберите тип эксперимента и запустите тест</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Additional Tools */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6 text-center">
              <h3 className="font-medium text-gray-900 mb-2">📚 Изучите методологию</h3>
              <p className="text-sm text-gray-600 mb-4">
                Узнайте, как правильно тестировать идеи и принимать решения на основе данных
              </p>
              <Link href="/methodology">
                <Button variant="outline" className="gap-2">
                  <Target className="h-4 w-4" />
                  Открыть методологию
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6 text-center">
              <h3 className="font-medium text-gray-900 mb-2">🎯 Критерии успеха</h3>
              <p className="text-sm text-gray-600 mb-4">
                Определите четкие метрики для оценки успешности ваших экспериментов
              </p>
              <Link href="/success-criteria">
                <Button variant="outline" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Настроить критерии
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}