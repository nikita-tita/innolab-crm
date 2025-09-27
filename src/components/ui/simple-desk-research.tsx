"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Save } from "lucide-react";

interface SimpleDeskResearchProps {
  hypothesisId?: string;
  initialNotes?: string;
  onSave?: (notes: string) => void;
  disabled?: boolean;
}

export function SimpleDeskResearch({
  hypothesisId,
  initialNotes = "",
  onSave,
  disabled = false
}: SimpleDeskResearchProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.(notes);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Desk Research
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Результаты кабинетного исследования и ссылки на артефакты
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="research-notes">Результаты исследования</Label>
            <Textarea
              id="research-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={disabled}
              placeholder="Запишите ключевые выводы, статистику, данные и ссылки на источники...

Примеры:
• Основные выводы исследования
• Статистика и данные
• Ссылки на источники: https://example.com
• Анализ конкурентов
• Выявленные риски и возможности"
              className="min-h-[200px] font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Совет: Добавляйте прямые ссылки на источники и артефакты - они автоматически станут кликабельными
            </p>
          </div>

          {!disabled && (
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Предпросмотр с кликабельными ссылками */}
      {notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📖 Предпросмотр</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="text-sm text-gray-700 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: notes.replace(
                  /(https?:\/\/[^\s]+)/g,
                  '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>'
                )
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}