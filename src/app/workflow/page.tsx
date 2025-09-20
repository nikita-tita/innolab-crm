"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/ui/kanban-board";
import { Plus, Filter, Settings } from "lucide-react";

// Типы данных для воронки
interface WorkflowItem {
  id: string;
  title: string;
  description?: string;
  type: "idea" | "hypothesis";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  riceScore?: number;
  assignee?: string;
  tags?: string[];
  createdAt: Date;
  status: string;
}

const ideaStages = [
  {
    id: "new",
    title: "🔍 Банк идей",
    description: "Новые идеи",
    color: "bg-blue-50",
    items: []
  },
  {
    id: "scored",
    title: "📊 RICE-скоринг",
    description: "Оценка идей",
    color: "bg-yellow-50",
    items: []
  },
  {
    id: "selected",
    title: "✅ Отобранные",
    description: "Готовы к проработке",
    color: "bg-green-50",
    items: []
  },
  {
    id: "in_hypothesis",
    title: "🔬 В разработке",
    description: "Формулируются гипотезы",
    color: "bg-purple-50",
    items: []
  }
];

const hypothesisStages = [
  {
    id: "draft",
    title: "📝 Черновики",
    description: "Новые гипотезы",
    color: "bg-gray-50",
    items: []
  },
  {
    id: "scored",
    title: "📊 RICE-оценка",
    description: "Приоритизация",
    color: "bg-yellow-50",
    items: []
  },
  {
    id: "desk_research",
    title: "🔍 Desk Research",
    description: "Кабинетные исследования",
    color: "bg-blue-50",
    items: []
  },
  {
    id: "ready_for_testing",
    title: "🧪 Готовы к тесту",
    description: "Ждут эксперимента",
    color: "bg-green-50",
    items: []
  },
  {
    id: "in_experiment",
    title: "⚗️ В эксперименте",
    description: "Тестируются",
    color: "bg-orange-50",
    items: []
  },
  {
    id: "completed",
    title: "✅ Завершены",
    description: "Результаты получены",
    color: "bg-emerald-50",
    items: []
  }
];

export default function WorkflowPage() {
  const [activeTab, setActiveTab] = useState<"ideas" | "hypotheses">("ideas");
  const [stages, setStages] = useState(ideaStages);

  // Моковые данные
  const mockIdeas: WorkflowItem[] = [
    {
      id: "1",
      title: "Автоматический дозвон клиентам",
      description: "Система автодозвона для повышения конверсии",
      type: "idea",
      priority: "HIGH",
      riceScore: 12.5,
      assignee: "Иван Петров",
      tags: ["маркетинг", "автоматизация"],
      createdAt: new Date(),
      status: "new"
    },
    {
      id: "2",
      title: "Персонализация рекомендаций",
      description: "ML-алгоритм для персональных предложений",
      type: "idea",
      priority: "MEDIUM",
      riceScore: 8.3,
      assignee: "Анна Сидорова",
      tags: ["ML", "персонализация"],
      createdAt: new Date(),
      status: "scored"
    }
  ];

  const mockHypotheses: WorkflowItem[] = [
    {
      id: "h1",
      title: "Если добавить автодозвон, то конверсия вырастет на 15%",
      description: "Проверка эффективности автоматического дозвона",
      type: "hypothesis",
      priority: "HIGH",
      riceScore: 15.2,
      assignee: "Мария Козлова",
      tags: ["конверсия", "продажи"],
      createdAt: new Date(),
      status: "desk_research"
    },
    {
      id: "h2",
      title: "Если упростить форму регистрации, то больше пользователей зарегистрируется",
      description: "Тестирование упрощенной формы регистрации",
      type: "hypothesis",
      priority: "MEDIUM",
      riceScore: 9.1,
      assignee: "Петр Иванов",
      tags: ["UX", "регистрация"],
      createdAt: new Date(),
      status: "ready_for_testing"
    }
  ];

  useEffect(() => {
    // Распределяем элементы по этапам
    const items = activeTab === "ideas" ? mockIdeas : mockHypotheses;
    const currentStages = activeTab === "ideas" ? ideaStages : hypothesisStages;

    const updatedStages = currentStages.map(stage => ({
      ...stage,
      items: items.filter(item => item.status === stage.id)
    }));

    setStages(updatedStages);
  }, [activeTab]);

  const handleItemMove = (itemId: string, fromColumn: string, toColumn: string) => {
    console.log(`Moving ${itemId} from ${fromColumn} to ${toColumn}`);
    // Здесь будет API вызов для обновления статуса
  };

  const handleItemClick = (item: WorkflowItem) => {
    // Переход к детальной странице элемента
    if (item.type === "hypothesis") {
      window.location.href = `/hypotheses/${item.id}`;
    } else if (item.type === "idea") {
      window.location.href = `/ideas/${item.id}`;
    }
  };

  const handleAddItem = (columnId: string) => {
    console.log("Add item to column:", columnId);
    // Открытие модала создания нового элемента
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Заголовок и навигация */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Воронка процесса</h1>
          <p className="text-gray-600 mt-2">
            Управление жизненным циклом идей и гипотез
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Фильтры
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Настройки
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Добавить
          </Button>
        </div>
      </div>

      {/* Переключатель вкладок */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b">
            <button
              className={`px-6 py-4 font-medium ${
                activeTab === "ideas"
                  ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("ideas")}
            >
              💡 Воронка идей
            </button>
            <button
              className={`px-6 py-4 font-medium ${
                activeTab === "hypotheses"
                  ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("hypotheses")}
            >
              🔬 Воронка гипотез
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Описание текущего этапа */}
      <Card>
        <CardContent className="p-4">
          {activeTab === "ideas" ? (
            <div>
              <h3 className="font-semibold text-lg mb-2">Этапы работы с идеями</h3>
              <ol className="text-sm text-gray-600 space-y-1">
                <li><strong>1. Банк идей:</strong> Сбор и фиксация всех идей команды</li>
                <li><strong>2. RICE-скоринг:</strong> Приоритизация по формуле (Reach × Impact × Confidence) ÷ Effort</li>
                <li><strong>3. Отобранные:</strong> Идеи с высоким приоритетом, готовые к проработке</li>
                <li><strong>4. В разработке:</strong> Формулирование проверяемых гипотез на основе идей</li>
              </ol>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-lg mb-2">Этапы работы с гипотезами</h3>
              <ol className="text-sm text-gray-600 space-y-1">
                <li><strong>1. Черновики:</strong> Формулировка в формате "Если X, то Y, потому что Z"</li>
                <li><strong>2. RICE-оценка:</strong> Приоритизация экспериментов</li>
                <li><strong>3. Desk Research:</strong> Кабинетные исследования и анализ данных</li>
                <li><strong>4. Готовы к тесту:</strong> Планирование экспериментов</li>
                <li><strong>5. В эксперименте:</strong> Проведение и мониторинг тестов</li>
                <li><strong>6. Завершены:</strong> Анализ результатов и принятие решений</li>
              </ol>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Канбан-доска */}
      <KanbanBoard
        columns={stages}
        onItemMove={handleItemMove}
        onItemClick={handleItemClick}
        onAddItem={handleAddItem}
        showRiceScore={true}
      />

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {stages.reduce((sum, stage) => sum + stage.items.length, 0)}
            </div>
            <div className="text-sm text-gray-600">
              Всего {activeTab === "ideas" ? "идей" : "гипотез"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {stages.find(s => s.id === "completed" || s.id === "in_hypothesis")?.items.length || 0}
            </div>
            <div className="text-sm text-gray-600">
              {activeTab === "ideas" ? "Завершенных" : "В работе"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {stages.find(s => s.id === "in_experiment" || s.id === "scored")?.items.length || 0}
            </div>
            <div className="text-sm text-gray-600">
              {activeTab === "ideas" ? "На оценке" : "В эксперименте"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {((stages.find(s => s.id === "completed")?.items.length || 0) /
                Math.max(1, stages.reduce((sum, stage) => sum + stage.items.length, 0)) * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600">
              Коэффициент завершения
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}