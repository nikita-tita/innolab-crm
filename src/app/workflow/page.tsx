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
    title: "💡 Банк идей",
    description: "Сбор и фиксация идей",
    color: "bg-blue-50",
    items: []
  },
  {
    id: "scored",
    title: "📊 RICE-скоринг",
    description: "Приоритизация идей",
    color: "bg-yellow-50",
    items: []
  },
  {
    id: "selected",
    title: "✅ Отобранные идеи",
    description: "Готовы к превращению в гипотезы",
    color: "bg-green-50",
    items: []
  }
];

const hypothesisStages = [
  {
    id: "draft",
    title: "🔬 Формулирование",
    description: "Превращение идей в гипотезы",
    color: "bg-purple-50",
    items: []
  },
  {
    id: "scored",
    title: "📊 Приоритизация",
    description: "RICE-оценка гипотез",
    color: "bg-yellow-50",
    items: []
  },
  {
    id: "desk_research",
    title: "🔍 Desk Research",
    description: "Кабинетные исследования",
    color: "bg-indigo-50",
    items: []
  },
  {
    id: "experiment_design",
    title: "🎯 Дизайн эксперимента",
    description: "Планирование MVP/теста",
    color: "bg-pink-50",
    items: []
  },
  {
    id: "in_experiment",
    title: "🧪 Эксперимент",
    description: "Тестирование MVP",
    color: "bg-orange-50",
    items: []
  },
  {
    id: "analysis",
    title: "📈 Анализ результатов",
    description: "Выводы и решения",
    color: "bg-emerald-50",
    items: []
  }
];

export default function WorkflowPage() {
  const [activeTab, setActiveTab] = useState<"ideas" | "hypotheses">("ideas");
  const [stages, setStages] = useState(ideaStages);

  // Моковые данные - идеи для новых продуктов
  const mockIdeas: WorkflowItem[] = [
    {
      id: "1",
      title: "Сервис аренды автомобилей по подписке",
      description: "Месячная подписка на доступ к флоту автомобилей без покупки",
      type: "idea",
      priority: "HIGH",
      riceScore: 15.2,
      assignee: "Мария Козлова",
      tags: ["мобильность", "подписка", "каршеринг"],
      createdAt: new Date(),
      status: "new"
    },
    {
      id: "2",
      title: "Платформа для удаленной работы команд",
      description: "Все инструменты для удаленной работы в одном месте",
      type: "idea",
      priority: "MEDIUM",
      riceScore: 11.7,
      assignee: "Алексей Иванов",
      tags: ["удаленка", "SaaS", "productivity"],
      createdAt: new Date(),
      status: "scored"
    },
    {
      id: "3",
      title: "AI-помощник для малого бизнеса",
      description: "Автоматизация рутинных задач ИП через чат-бота",
      type: "idea",
      priority: "HIGH",
      riceScore: 13.4,
      assignee: "Ольга Петрова",
      tags: ["AI", "малый бизнес", "автоматизация"],
      createdAt: new Date(),
      status: "selected"
    }
  ];

  const mockHypotheses: WorkflowItem[] = [
    {
      id: "h1",
      title: "Если запустить MVP каршеринга по подписке, то 500+ пользователей подпишутся в первый месяц",
      description: "Тестирование спроса на каршеринг по подписке в Москве",
      type: "hypothesis",
      priority: "HIGH",
      riceScore: 15.2,
      assignee: "Мария Козлова",
      tags: ["каршеринг", "MVP", "спрос"],
      createdAt: new Date(),
      status: "desk_research"
    },
    {
      id: "h2",
      title: "Если создать чат-бот для ИП, то 30% попробуют его в течение недели",
      description: "Проверка готовности ИП использовать AI-помощника",
      type: "hypothesis",
      priority: "MEDIUM",
      riceScore: 12.8,
      assignee: "Ольга Петрова",
      tags: ["AI", "ИП", "adoption"],
      createdAt: new Date(),
      status: "experiment_design"
    },
    {
      id: "h3",
      title: "Если создать базовую платформу для команд, то 100 команд протестируют за месяц",
      description: "Валидация потребности в новой платформе для удаленной работы",
      type: "hypothesis",
      priority: "HIGH",
      riceScore: 11.5,
      assignee: "Алексей Иванов",
      tags: ["remote work", "MVP", "validation"],
      createdAt: new Date(),
      status: "in_experiment"
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
        <h1 className="text-3xl font-bold">Воронка процесса</h1>
        <p className="text-gray-600 mt-2">
          8-этапная методология для запуска новых продуктов
        </p>
        <p className="text-sm text-gray-500 mt-1">
          От идеи до работающего продукта через быстрые эксперименты
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
              💡 Этапы 1-3: От идей к гипотезам
            </button>
            <button
              className={`px-6 py-4 font-medium ${
                activeTab === "hypotheses"
                  ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("hypotheses")}
            >
              🔬 Этапы 4-8: От гипотез к продукту
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