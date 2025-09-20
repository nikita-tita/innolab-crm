"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, ExternalLink, FileText, TrendingUp } from "lucide-react";

interface DeskResearchData {
  notes: string;
  sources: string[];
  marketSize?: string;
  competitors?: string[];
  targetAudience?: string;
  businessImpact?: string;
  risks?: string[];
  opportunities?: string[];
  researchDate?: Date;
}

interface DeskResearchProps {
  hypothesisId?: string;
  initialData?: DeskResearchData;
  onSave?: (data: DeskResearchData) => void;
  onStatusChange?: (status: string) => void;
  disabled?: boolean;
}

export function DeskResearch({
  hypothesisId,
  initialData,
  onSave,
  onStatusChange,
  disabled = false
}: DeskResearchProps) {
  const [data, setData] = useState<DeskResearchData>({
    notes: initialData?.notes || "",
    sources: initialData?.sources || [],
    marketSize: initialData?.marketSize || "",
    competitors: initialData?.competitors || [],
    targetAudience: initialData?.targetAudience || "",
    businessImpact: initialData?.businessImpact || "",
    risks: initialData?.risks || [],
    opportunities: initialData?.opportunities || [],
    researchDate: initialData?.researchDate || new Date()
  });

  const [newSource, setNewSource] = useState("");
  const [newCompetitor, setNewCompetitor] = useState("");
  const [newRisk, setNewRisk] = useState("");
  const [newOpportunity, setNewOpportunity] = useState("");

  const addItem = (field: keyof DeskResearchData, item: string, setter: (val: string) => void) => {
    if (!item.trim()) return;

    const current = data[field] as string[];
    setData(prev => ({
      ...prev,
      [field]: [...current, item.trim()]
    }));
    setter("");
  };

  const removeItem = (field: keyof DeskResearchData, index: number) => {
    const current = data[field] as string[];
    setData(prev => ({
      ...prev,
      [field]: current.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave?.(data);
  };

  const handleComplete = () => {
    onSave?.(data);
    onStatusChange?.("READY_FOR_TESTING");
  };

  const getCompletionPercentage = () => {
    const fields = [
      data.notes,
      data.sources.length > 0,
      data.marketSize,
      data.targetAudience,
      data.businessImpact
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const completion = getCompletionPercentage();

  return (
    <div className="space-y-6">
      {/* Заголовок с прогрессом */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Desk Research
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Кабинетное исследование для проверки гипотезы
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${completion >= 80 ? 'text-green-600' : completion >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {completion}%
              </div>
              <div className="text-sm text-gray-500">завершено</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Основные заметки */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📝 Заметки исследования</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="notes">Основные выводы и заметки</Label>
              <Textarea
                id="notes"
                value={data.notes}
                onChange={(e) => setData(prev => ({ ...prev, notes: e.target.value }))}
                disabled={disabled}
                placeholder="Запишите ключевые выводы, статистику, данные..."
                className="min-h-[120px]"
              />
            </div>

            <div>
              <Label htmlFor="marketSize">Размер рынка</Label>
              <Input
                id="marketSize"
                value={data.marketSize}
                onChange={(e) => setData(prev => ({ ...prev, marketSize: e.target.value }))}
                disabled={disabled}
                placeholder="например: $10M TAM, $2M SAM"
              />
            </div>

            <div>
              <Label htmlFor="targetAudience">Целевая аудитория</Label>
              <Textarea
                id="targetAudience"
                value={data.targetAudience}
                onChange={(e) => setData(prev => ({ ...prev, targetAudience: e.target.value }))}
                disabled={disabled}
                placeholder="Описание сегментов, демографии, потребностей..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="businessImpact">Бизнес-воздействие</Label>
              <Textarea
                id="businessImpact"
                value={data.businessImpact}
                onChange={(e) => setData(prev => ({ ...prev, businessImpact: e.target.value }))}
                disabled={disabled}
                placeholder="Ожидаемое влияние на бизнес-метрики..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Источники и конкуренты */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🔍 Источники и анализ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Источники */}
            <div>
              <Label>Источники информации</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="URL, название исследования, отчет..."
                  disabled={disabled}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem('sources', newSource, setNewSource)}
                  disabled={disabled}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.sources.map((source, index) => (
                  <Badge key={index} variant="outline" className="pr-1">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {source}
                    {!disabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => removeItem('sources', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Конкуренты */}
            <div>
              <Label>Конкуренты</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newCompetitor}
                  onChange={(e) => setNewCompetitor(e.target.value)}
                  placeholder="Название компании или продукта"
                  disabled={disabled}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem('competitors', newCompetitor, setNewCompetitor)}
                  disabled={disabled}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.competitors?.map((competitor, index) => (
                  <Badge key={index} variant="secondary" className="pr-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {competitor}
                    {!disabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => removeItem('competitors', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Риски */}
            <div>
              <Label>Риски</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newRisk}
                  onChange={(e) => setNewRisk(e.target.value)}
                  placeholder="Описание потенциального риска"
                  disabled={disabled}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem('risks', newRisk, setNewRisk)}
                  disabled={disabled}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.risks?.map((risk, index) => (
                  <Badge key={index} variant="destructive" className="pr-1">
                    {risk}
                    {!disabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 text-white hover:text-red-600"
                        onClick={() => removeItem('risks', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Возможности */}
            <div>
              <Label>Возможности</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newOpportunity}
                  onChange={(e) => setNewOpportunity(e.target.value)}
                  placeholder="Описание возможности"
                  disabled={disabled}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem('opportunities', newOpportunity, setNewOpportunity)}
                  disabled={disabled}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.opportunities?.map((opportunity, index) => (
                  <Badge key={index} variant="default" className="pr-1 bg-green-100 text-green-800">
                    {opportunity}
                    {!disabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => removeItem('opportunities', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Действия */}
      {!disabled && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">
                  Заполнено {completion}% полей. {completion >= 80 ? "Готово к переходу к эксперименту!" : "Заполните основные поля для завершения исследования."}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSave}>
                  Сохранить
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={completion < 80}
                  className={completion >= 80 ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {completion >= 80 ? "Завершить исследование" : "Завершить (80%+ нужно)"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default DeskResearch;