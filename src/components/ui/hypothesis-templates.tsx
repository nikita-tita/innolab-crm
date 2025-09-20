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
  ShoppingCart,
  Smartphone,
  Zap,
  Target,
  Search,
  Filter
} from "lucide-react";

interface HypothesisTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  template: string;
  variables: string[];
  example: string;
  tags: string[];
  usageCount: number;
  successRate?: number;
}

interface HypothesisTemplatesProps {
  onSelectTemplate?: (template: HypothesisTemplate) => void;
  onCreateFromTemplate?: (template: HypothesisTemplate, variables: Record<string, string>) => void;
}

const templates: HypothesisTemplate[] = [
  {
    id: "conversion-improvement",
    name: "Улучшение конверсии",
    category: "Конверсия",
    description: "Шаблон для гипотез, направленных на повышение конверсии в целевое действие",
    template: "Если мы {action}, то {metric} увеличится на {percentage}%, потому что {reason}",
    variables: ["action", "metric", "percentage", "reason"],
    example: "Если мы упростим форму регистрации (убрав лишние поля), то конверсия в регистрацию увеличится на 15%, потому что пользователи не будут отвлекаться на ненужную информацию",
    tags: ["конверсия", "UI/UX", "оптимизация"],
    usageCount: 24,
    successRate: 73
  },
  {
    id: "retention-mobile",
    name: "Удержание через мобильное приложение",
    category: "Удержание",
    description: "Гипотеза о влиянии мобильного приложения на удержание пользователей",
    template: "Если мы запустим мобильное приложение с {features}, то {retention_metric} увеличится на {percentage}% через {timeframe}, потому что {reason}",
    variables: ["features", "retention_metric", "percentage", "timeframe", "reason"],
    example: "Если мы запустим мобильное приложение с push-уведомлениями и оффлайн-режимом, то удержание пользователей увеличится на 25% через 30 дней, потому что пользователи будут чаще взаимодействовать с продуктом",
    tags: ["удержание", "мобильное приложение", "engagement"],
    usageCount: 18,
    successRate: 68
  },
  {
    id: "personalization",
    name: "Персонализация контента",
    category: "Персонализация",
    description: "Гипотеза о влиянии персонализированного контента на поведение пользователей",
    template: "Если мы добавим персонализацию {content_type} на основе {data_source}, то {metric} улучшится на {percentage}%, потому что {reason}",
    variables: ["content_type", "data_source", "metric", "percentage", "reason"],
    example: "Если мы добавим персонализацию рекомендаций товаров на основе истории покупок, то CTR увеличится на 20%, потому что релевантные предложения лучше соответствуют интересам пользователей",
    tags: ["персонализация", "рекомендации", "ML"],
    usageCount: 31,
    successRate: 82
  },
  {
    id: "onboarding",
    name: "Улучшение онбординга",
    category: "Онбординг",
    description: "Гипотеза об оптимизации процесса знакомства новых пользователей с продуктом",
    template: "Если мы изменим процесс онбординга, добавив {element}, то {metric} новых пользователей улучшится на {percentage}%, потому что {reason}",
    variables: ["element", "metric", "percentage", "reason"],
    example: "Если мы изменим процесс онбординга, добавив интерактивный тур по интерфейсу, то активация новых пользователей улучшится на 30%, потому что пользователи быстрее поймут ценность продукта",
    tags: ["онбординг", "активация", "UX"],
    usageCount: 22,
    successRate: 75
  },
  {
    id: "performance",
    name: "Влияние производительности",
    category: "Производительность",
    description: "Гипотеза о влиянии технических улучшений на пользовательский опыт",
    template: "Если мы улучшим {technical_aspect} на {improvement}, то {metric} изменится на {percentage}%, потому что {reason}",
    variables: ["technical_aspect", "improvement", "metric", "percentage", "reason"],
    example: "Если мы улучшим скорость загрузки страницы на 2 секунды, то отказы уменьшатся на 25%, потому что пользователи не будут ждать загрузки и покидать сайт",
    tags: ["производительность", "скорость", "отказы"],
    usageCount: 15,
    successRate: 85
  },
  {
    id: "pricing",
    name: "Ценовая модель",
    category: "Монетизация",
    description: "Гипотеза о влиянии изменений в ценообразовании на поведение пользователей",
    template: "Если мы изменим {pricing_element} с {current_value} на {new_value}, то {metric} изменится на {percentage}%, потому что {reason}",
    variables: ["pricing_element", "current_value", "new_value", "metric", "percentage", "reason"],
    example: "Если мы изменим пробный период с 7 дней на 14 дней, то конверсия в платную подписку увеличится на 18%, потому что пользователи успеют лучше оценить ценность продукта",
    tags: ["монетизация", "ценообразование", "подписка"],
    usageCount: 19,
    successRate: 65
  }
];

export function HypothesisTemplates({ onSelectTemplate, onCreateFromTemplate }: HypothesisTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<HypothesisTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = Array.from(new Set(templates.map(t => t.category)));

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: HypothesisTemplate) => {
    setSelectedTemplate(template);

    // Инициализируем переменные пустыми значениями
    const initialVariables: Record<string, string> = {};
    template.variables.forEach(variable => {
      initialVariables[variable] = "";
    });
    setVariables(initialVariables);

    onSelectTemplate?.(template);
  };

  const handleVariableChange = (variable: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const generateHypothesis = () => {
    if (!selectedTemplate) return "";

    let hypothesis = selectedTemplate.template;
    Object.entries(variables).forEach(([variable, value]) => {
      hypothesis = hypothesis.replace(`{${variable}}`, value || `[${variable}]`);
    });

    return hypothesis;
  };

  const handleCreateFromTemplate = () => {
    if (selectedTemplate && onCreateFromTemplate) {
      onCreateFromTemplate(selectedTemplate, variables);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Конверсия": return <TrendingUp className="h-4 w-4" />;
      case "Удержание": return <Users className="h-4 w-4" />;
      case "Персонализация": return <Target className="h-4 w-4" />;
      case "Онбординг": return <Lightbulb className="h-4 w-4" />;
      case "Производительность": return <Zap className="h-4 w-4" />;
      case "Монетизация": return <ShoppingCart className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
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
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Список шаблонов */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Шаблоны гипотез ({filteredTemplates.length})</h3>

          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(template.category)}
                    <h4 className="font-medium">{template.name}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    {template.successRate && (
                      <Badge variant="outline" className="text-xs">
                        {template.successRate}% успех
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {template.usageCount} использований
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                <div className="flex flex-wrap gap-1 mb-2">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                  {template.template}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredTemplates.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Шаблоны не найдены</p>
                <p className="text-sm text-gray-400 mt-1">Попробуйте изменить критерии поиска</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Редактор гипотезы */}
        <div className="space-y-4">
          {selectedTemplate ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Copy className="h-5 w-5" />
                    Создание гипотезы из шаблона
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Шаблон: {selectedTemplate.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{selectedTemplate.description}</p>
                  </div>

                  <div>
                    <Label>Пример использования:</Label>
                    <div className="text-sm bg-green-50 border border-green-200 p-3 rounded mt-1">
                      {selectedTemplate.example}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Заполните переменные:</Label>
                    {selectedTemplate.variables.map((variable) => (
                      <div key={variable}>
                        <Label htmlFor={variable} className="text-sm">
                          {variable} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={variable}
                          value={variables[variable] || ""}
                          onChange={(e) => handleVariableChange(variable, e.target.value)}
                          placeholder={`Введите ${variable}...`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Результат</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                    <p className="font-medium text-blue-900">{generateHypothesis()}</p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={handleCreateFromTemplate}
                      disabled={Object.values(variables).some(v => !v.trim())}
                    >
                      Создать гипотезу
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(generateHypothesis());
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Копировать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Выберите шаблон</h3>
                <p className="text-gray-500">
                  Выберите шаблон слева, чтобы начать создание гипотезы
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default HypothesisTemplates;