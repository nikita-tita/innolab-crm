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
      {/* Заголовок */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">Процесс работы</h1>
        <p className="text-gray-600 mt-2">
          Простое управление идеями и гипотезами
        </p>
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


      {/* Канбан-доска */}
      <KanbanBoard
        columns={stages}
        onItemMove={handleItemMove}
        onItemClick={handleItemClick}
        onAddItem={handleAddItem}
        showRiceScore={true}
      />

    </div>
  );
}