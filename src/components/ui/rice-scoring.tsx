"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface RiceScoringProps {
  reach?: number;
  impact?: number;
  confidence?: number;
  effort?: number;
  onScoreChange?: (score: number, values: RiceValues) => void;
  disabled?: boolean;
}

interface RiceValues {
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
}

export function RiceScoring({
  reach = 0,
  impact = 1,
  confidence = 50,
  effort = 1,
  onScoreChange,
  disabled = false
}: RiceScoringProps) {
  const [values, setValues] = useState<RiceValues>({
    reach,
    impact,
    confidence,
    effort
  });

  const calculateScore = (vals: RiceValues) => {
    if (vals.effort === 0) return 0;
    return (vals.reach * vals.impact * vals.confidence) / (vals.effort * 100);
  };

  useEffect(() => {
    const score = calculateScore(values);
    onScoreChange?.(score, values);
  }, [values, onScoreChange]);

  const handleValueChange = (field: keyof RiceValues, value: number) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);
  };

  const score = calculateScore(values);

  const getScoreColor = (score: number) => {
    if (score >= 10) return "text-green-600 bg-green-50";
    if (score >= 5) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 10) return "Высокий приоритет";
    if (score >= 5) return "Средний приоритет";
    return "Низкий приоритет";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">RICE Scoring</CardTitle>
        <div className={`text-2xl font-bold p-3 rounded-lg ${getScoreColor(score)}`}>
          {score.toFixed(1)}
          <span className="text-sm font-normal ml-2">{getScoreLabel(score)}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="reach">
              Охват (Reach)
              <span className="text-sm text-gray-500 block">
                Количество людей/событий за период
              </span>
            </Label>
            <Input
              id="reach"
              type="number"
              min="0"
              value={values.reach}
              onChange={(e) => handleValueChange('reach', parseInt(e.target.value) || 0)}
              disabled={disabled}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="impact">
              Влияние (Impact)
              <span className="text-sm text-gray-500 block">
                Сила эффекта (1-5)
              </span>
            </Label>
            <select
              id="impact"
              value={values.impact}
              onChange={(e) => handleValueChange('impact', parseInt(e.target.value))}
              disabled={disabled}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value={1}>1 - Минимальное</option>
              <option value={2}>2 - Низкое</option>
              <option value={3}>3 - Среднее</option>
              <option value={4}>4 - Высокое</option>
              <option value={5}>5 - Максимальное</option>
            </select>
          </div>

          <div>
            <Label htmlFor="confidence">
              Уверенность (Confidence)
              <span className="text-sm text-gray-500 block">
                Процент уверенности (0-100%)
              </span>
            </Label>
            <Input
              id="confidence"
              type="number"
              min="0"
              max="100"
              value={values.confidence}
              onChange={(e) => handleValueChange('confidence', parseInt(e.target.value) || 0)}
              disabled={disabled}
              placeholder="50"
            />
          </div>

          <div>
            <Label htmlFor="effort">
              Затраты (Effort)
              <span className="text-sm text-gray-500 block">
                Человеко-дни или сложность
              </span>
            </Label>
            <Input
              id="effort"
              type="number"
              min="1"
              value={values.effort}
              onChange={(e) => handleValueChange('effort', Math.max(1, parseInt(e.target.value) || 1))}
              disabled={disabled}
              placeholder="1"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <Label className="text-sm font-medium">Формула расчета:</Label>
          <p className="text-sm text-gray-600 mt-1">
            RICE = (Охват × Влияние × Уверенность) ÷ (Затраты × 100)
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {values.reach} × {values.impact} × {values.confidence}% ÷ ({values.effort} × 100) = {score.toFixed(1)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default RiceScoring;