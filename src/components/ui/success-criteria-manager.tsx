"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  X,
  Target,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Save
} from "lucide-react";

interface SuccessCriteria {
  id: string;
  name: string;
  description: string;
  targetValue: number;
  unit: string;
  actualValue?: number;
  status?: "not_started" | "in_progress" | "achieved" | "failed";
  measurementMethod?: string;
  timeline?: string;
  priority: "low" | "medium" | "high" | "critical";
}

interface SuccessCriteriaManagerProps {
  hypothesisId: string;
  initialCriteria?: SuccessCriteria[];
  onSave?: (criteria: SuccessCriteria[]) => void;
  disabled?: boolean;
  showProgress?: boolean;
}

const defaultCriteria: Partial<SuccessCriteria> = {
  name: "",
  description: "",
  targetValue: 0,
  unit: "%",
  priority: "medium",
  status: "not_started"
};

export function SuccessCriteriaManager({
  hypothesisId,
  initialCriteria = [],
  onSave,
  disabled = false,
  showProgress = true
}: SuccessCriteriaManagerProps) {
  const [criteria, setCriteria] = useState<SuccessCriteria[]>(initialCriteria);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newCriteria, setNewCriteria] = useState<Partial<SuccessCriteria>>(defaultCriteria);

  useEffect(() => {
    setCriteria(initialCriteria);
  }, [initialCriteria]);

  const addCriteria = () => {
    if (!newCriteria.name || newCriteria.targetValue === undefined) return;

    const criteria_item: SuccessCriteria = {
      id: Date.now().toString(),
      name: newCriteria.name,
      description: newCriteria.description || "",
      targetValue: newCriteria.targetValue,
      unit: newCriteria.unit || "%",
      priority: newCriteria.priority || "medium",
      status: "not_started",
      measurementMethod: newCriteria.measurementMethod,
      timeline: newCriteria.timeline
    };

    setCriteria(prev => [...prev, criteria_item]);
    setNewCriteria(defaultCriteria);
  };

  const updateCriteria = (id: string, updates: Partial<SuccessCriteria>) => {
    setCriteria(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const removeCriteria = (id: string) => {
    setCriteria(prev => prev.filter(item => item.id !== id));
  };

  const handleSave = () => {
    onSave?.(criteria);
    setIsEditing(false);
    setEditingItem(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "achieved": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "failed": return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "in_progress": return <TrendingUp className="h-4 w-4 text-blue-600" />;
      default: return <Target className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "achieved": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAchievementRate = () => {
    if (criteria.length === 0) return 0;
    const achieved = criteria.filter(c => c.status === "achieved").length;
    return Math.round((achieved / criteria.length) * 100);
  };

  const achievementRate = getAchievementRate();

  return (
    <div className="space-y-6">
      {/* Заголовок с прогрессом */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <CardTitle>Критерии успеха</CardTitle>
              <Badge variant="outline">{criteria.length} критериев</Badge>
            </div>

            {showProgress && criteria.length > 0 && (
              <div className="text-right">
                <div className={`text-2xl font-bold ${achievementRate >= 80 ? 'text-green-600' : achievementRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {achievementRate}%
                </div>
                <div className="text-sm text-gray-500">достигнуто</div>
              </div>
            )}
          </div>

          {showProgress && criteria.length > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all ${achievementRate >= 80 ? 'bg-green-600' : achievementRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${achievementRate}%` }}
              ></div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Список критериев */}
      {criteria.length > 0 && (
        <div className="space-y-3">
          {criteria.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {editingItem === item.id ? (
                  // Режим редактирования
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Название критерия</Label>
                        <Input
                          value={item.name}
                          onChange={(e) => updateCriteria(item.id, { name: e.target.value })}
                          placeholder="Название метрики"
                        />
                      </div>
                      <div>
                        <Label>Целевое значение</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={item.targetValue}
                            onChange={(e) => updateCriteria(item.id, { targetValue: parseFloat(e.target.value) || 0 })}
                            placeholder="0"
                          />
                          <Input
                            value={item.unit}
                            onChange={(e) => updateCriteria(item.id, { unit: e.target.value })}
                            placeholder="единица"
                            className="w-20"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Описание</Label>
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateCriteria(item.id, { description: e.target.value })}
                        placeholder="Как измеряется этот критерий..."
                        rows={2}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label>Приоритет</Label>
                        <select
                          value={item.priority}
                          onChange={(e) => updateCriteria(item.id, { priority: e.target.value as any })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="low">Низкий</option>
                          <option value="medium">Средний</option>
                          <option value="high">Высокий</option>
                          <option value="critical">Критический</option>
                        </select>
                      </div>

                      <div>
                        <Label>Статус</Label>
                        <select
                          value={item.status}
                          onChange={(e) => updateCriteria(item.id, { status: e.target.value as any })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="not_started">Не начато</option>
                          <option value="in_progress">В процессе</option>
                          <option value="achieved">Достигнуто</option>
                          <option value="failed">Не достигнуто</option>
                        </select>
                      </div>

                      <div>
                        <Label>Фактическое значение</Label>
                        <Input
                          type="number"
                          value={item.actualValue || ""}
                          onChange={(e) => updateCriteria(item.id, { actualValue: parseFloat(e.target.value) || undefined })}
                          placeholder="Текущий результат"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" onClick={() => setEditingItem(null)}>
                        <Save className="h-4 w-4 mr-1" />
                        Сохранить
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingItem(null)}>
                        Отмена
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => removeCriteria(item.id)}>
                        <X className="h-4 w-4 mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Режим просмотра
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(item.status!)}
                          <h4 className="font-medium">{item.name}</h4>
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority === "critical" ? "Критический" :
                             item.priority === "high" ? "Высокий" :
                             item.priority === "medium" ? "Средний" : "Низкий"}
                          </Badge>
                          <Badge className={getStatusColor(item.status!)}>
                            {item.status === "achieved" ? "Достигнуто" :
                             item.status === "failed" ? "Не достигнуто" :
                             item.status === "in_progress" ? "В процессе" : "Не начато"}
                          </Badge>
                        </div>

                        {item.description && (
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        )}

                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="font-medium">Цель:</span> {item.targetValue} {item.unit}
                          </div>
                          {item.actualValue !== undefined && (
                            <div>
                              <span className="font-medium">Факт:</span> {item.actualValue} {item.unit}
                              {item.targetValue > 0 && (
                                <span className={`ml-1 ${item.actualValue >= item.targetValue ? 'text-green-600' : 'text-red-600'}`}>
                                  ({Math.round((item.actualValue / item.targetValue) * 100)}%)
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {!disabled && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingItem(item.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Прогресс бар для критерия */}
                    {item.actualValue !== undefined && item.targetValue > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.actualValue >= item.targetValue ? 'bg-green-600' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min(100, (item.actualValue / item.targetValue) * 100)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Добавление нового критерия */}
      {!disabled && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Добавить критерий успеха</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="criteriaName">Название критерия</Label>
                <Input
                  id="criteriaName"
                  value={newCriteria.name}
                  onChange={(e) => setNewCriteria(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Например: Конверсия в покупку"
                />
              </div>
              <div>
                <Label htmlFor="targetValue">Целевое значение</Label>
                <div className="flex gap-2">
                  <Input
                    id="targetValue"
                    type="number"
                    value={newCriteria.targetValue}
                    onChange={(e) => setNewCriteria(prev => ({ ...prev, targetValue: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                  <Input
                    value={newCriteria.unit}
                    onChange={(e) => setNewCriteria(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="единица"
                    className="w-20"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="criteriaDescription">Описание (опционально)</Label>
              <Textarea
                id="criteriaDescription"
                value={newCriteria.description}
                onChange={(e) => setNewCriteria(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Как измеряется и что означает этот критерий..."
                rows={2}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Приоритет</Label>
                <select
                  value={newCriteria.priority}
                  onChange={(e) => setNewCriteria(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                  <option value="critical">Критический</option>
                </select>
              </div>
              <div>
                <Label htmlFor="measurementMethod">Метод измерения (опционально)</Label>
                <Input
                  id="measurementMethod"
                  value={newCriteria.measurementMethod}
                  onChange={(e) => setNewCriteria(prev => ({ ...prev, measurementMethod: e.target.value }))}
                  placeholder="Google Analytics, опрос пользователей..."
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={addCriteria}
                disabled={!newCriteria.name || newCriteria.targetValue === undefined}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить критерий
              </Button>
              {criteria.length > 0 && (
                <Button variant="outline" onClick={handleSave}>
                  Сохранить все изменения
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Пустое состояние */}
      {criteria.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Нет критериев успеха</h3>
            <p className="text-gray-500 mb-4">
              Добавьте измеримые критерии для оценки успешности гипотезы
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SuccessCriteriaManager;