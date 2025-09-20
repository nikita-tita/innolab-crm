"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Copy,
  Lightbulb,
  TrendingUp,
  Users,
  Rocket,
  Target,
  DollarSign,
  Clock
} from "lucide-react";

interface NewProductTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  template: string;
  variables: string[];
  example: string;
  tags: string[];
  usageCount: number;
  icon: string;
}

interface NewProductTemplatesProps {
  onSelectTemplate?: (template: NewProductTemplate) => void;
  onCreateFromTemplate?: (template: NewProductTemplate, variables: Record<string, string>) => void;
}

const templates: NewProductTemplate[] = [
  {
    id: "product-market-fit",
    name: "Product-Market Fit",
    category: "Валидация спроса",
    description: "Проверка потребности рынка в новом продукте",
    template: "Если мы запустим {product} для {audience}, то {percentage}% из них будут {action} в течение {timeframe}, потому что {problem}",
    variables: ["product", "audience", "percentage", "action", "timeframe", "problem"],
    example: "Если мы запустим MVP каршеринга для жителей спальных районов, то 25% из них воспользуются услугой в течение первого месяца, потому что у них есть проблемы с транспортом",
    tags: ["спрос", "MVP", "валидация"],
    usageCount: 45,
    icon: "🎯"
  },
  {
    id: "pricing-validation",
    name: "Валидация цены",
    category: "Монетизация",
    description: "Проверка готовности платить за новый продукт",
    template: "Если мы установим цену {price} за {product}, то {percentage}% целевой аудитории будут готовы заплатить, потому что {value}",
    variables: ["price", "product", "percentage", "value"],
    example: "Если мы установим цену 2000 руб/месяц за AI-помощника для ИП, то 30% целевой аудитории будут готовы заплатить, потому что это экономит им 10+ часов в неделю",
    tags: ["цена", "монетизация", "готовность платить"],
    usageCount: 32,
    icon: "💰"
  },
  {
    id: "channel-validation",
    name: "Валидация канала",
    category: "Привлечение",
    description: "Проверка эффективности каналов привлечения пользователей",
    template: "Если мы будем привлекать {audience} через {channel}, то получим {metric} с показателем {value}, потому что {reason}",
    variables: ["audience", "channel", "metric", "value", "reason"],
    example: "Если мы будем привлекать малых предпринимателей через Telegram-каналы про бизнес, то получим конверсию в регистрацию 5%, потому что там собрана наша целевая аудитория",
    tags: ["привлечение", "каналы", "маркетинг"],
    usageCount: 28,
    icon: "📢"
  },
  {
    id: "feature-priority",
    name: "Приоритет функций",
    category: "Развитие продукта",
    description: "Определение самых важных функций для MVP",
    template: "Если мы добавим функцию {feature} в наш {product}, то {percentage}% пользователей будут {action}, потому что {need}",
    variables: ["feature", "product", "percentage", "action", "need"],
    example: "Если мы добавим функцию автоматического составления отчетов в наш AI-помощник, то 70% пользователей будут пользоваться ей ежедневно, потому что это их главная боль",
    tags: ["функции", "MVP", "приоритизация"],
    usageCount: 41,
    icon: "⚡"
  },
  {
    id: "adoption-speed",
    name: "Скорость внедрения",
    category: "Пользовательское поведение",
    description: "Проверка как быстро пользователи начнут использовать продукт",
    template: "Если мы предоставим {audience} доступ к {product}, то {percentage}% начнут активно пользоваться в течение {timeframe}, потому что {motivation}",
    variables: ["audience", "product", "percentage", "timeframe", "motivation"],
    example: "Если мы предоставим удаленным командам доступ к нашей платформе, то 60% начнут активно пользоваться в течение первой недели, потому что им срочно нужны инструменты для координации",
    tags: ["внедрение", "скорость", "поведение"],
    usageCount: 23,
    icon: "🚀"
  },
  {
    id: "retention-early",
    name: "Раннее удержание",
    category: "Удержание",
    description: "Проверка удержания пользователей в первые дни/недели",
    template: "Если мы обеспечим {experience} в первые {timeframe} использования {product}, то {percentage}% пользователей вернутся на следующей неделе, потому что {value}",
    variables: ["experience", "timeframe", "product", "percentage", "value"],
    example: "Если мы обеспечим быстрое подключение и настройку в первые 5 минут использования платформы, то 80% пользователей вернутся на следующей неделе, потому что получат быстрый результат",
    tags: ["удержание", "onboarding", "первый опыт"],
    usageCount: 19,
    icon: "🔄"
  }
];

export default function NewProductTemplates({ onSelectTemplate, onCreateFromTemplate }: NewProductTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<NewProductTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [generatedHypothesis, setGeneratedHypothesis] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const generateHypothesis = (template: NewProductTemplate, vars: Record<string, string>) => {
    let generated = template.template;
    template.variables.forEach(variable => {
      const value = vars[variable] || `{${variable}}`;
      generated = generated.replace(new RegExp(`{${variable}}`, 'g'), value);
    });
    return generated;
  };

  const handleVariableChange = (variable: string, value: string) => {
    const newVariables = { ...variables, [variable]: value };
    setVariables(newVariables);

    if (selectedTemplate) {
      setGeneratedHypothesis(generateHypothesis(selectedTemplate, newVariables));
    }
  };

  const handleTemplateSelect = (template: NewProductTemplate) => {
    setSelectedTemplate(template);
    setVariables({});
    setGeneratedHypothesis(template.template);
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  const handleCreateHypothesis = () => {
    if (selectedTemplate && onCreateFromTemplate) {
      onCreateFromTemplate(selectedTemplate, variables);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Шаблоны гипотез для новых продуктов
        </h2>
        <p className="text-gray-600 mt-1">Готовые шаблоны для быстрого создания гипотез</p>
      </div>

      {/* Поиск и фильтры */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Поиск шаблонов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 border border-gray-300 rounded-md"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">Все категории</option>
          {categories.slice(1).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Список шаблонов */}
        <Card>
          <CardHeader>
            <CardTitle>Доступные шаблоны</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{template.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">
                          Использован {template.usageCount} раз
                        </span>
                        <div className="flex gap-1">
                          {template.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Редактор гипотезы */}
        {selectedTemplate && (
          <Card>
            <CardHeader>
              <CardTitle>Создание гипотезы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Шаблон:</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                  {selectedTemplate.template}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Пример:</Label>
                <div className="mt-1 p-3 bg-blue-50 rounded-md text-sm">
                  {selectedTemplate.example}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Заполните переменные:</Label>
                {selectedTemplate.variables.map((variable) => (
                  <div key={variable}>
                    <Label htmlFor={variable} className="text-sm capitalize">
                      {variable}
                    </Label>
                    <Input
                      id={variable}
                      placeholder={`Введите ${variable}...`}
                      value={variables[variable] || ""}
                      onChange={(e) => handleVariableChange(variable, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div>
                <Label className="text-sm font-medium">Результат:</Label>
                <div className="mt-1">
                  <Textarea
                    value={generatedHypothesis}
                    onChange={(e) => setGeneratedHypothesis(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => copyToClipboard(generatedHypothesis)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Копировать
                </Button>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateHypothesis} className="flex-1">
                  Создать гипотезу
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}