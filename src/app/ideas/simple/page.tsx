"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function SimpleIdeaPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          status: 'NEW',
          priority: 'MEDIUM'
        }),
      });

      if (response.ok) {
        alert("✅ Идея успешно сохранена!");
        setTitle("");
        setDescription("");
        // Редирект на dashboard через 1 секунду
        setTimeout(() => {
          window.location.href = "/simple-dashboard";
        }, 1000);
      } else {
        throw new Error('Ошибка сохранения');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert("❌ Ошибка сохранения. Попробуйте еще раз.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/simple-dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Назад
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-medium text-gray-900">Новая идея</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Название идеи..."
              className="w-full text-3xl font-bold border-none outline-none placeholder-gray-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <textarea
              placeholder="Опишите вашу идею нового продукта. Не нужно детально - просто зафиксируйте основную мысль..."
              className="w-full h-40 text-base border-none outline-none resize-none placeholder-gray-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Helper */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-medium text-blue-900 mb-2">💡 Советы по фиксации идей</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Записывайте идеи в свободной форме - детали обсудим потом</li>
                <li>• Укажите контекст: откуда пришла идея, какую проблему решает</li>
                <li>• Не бойтесь "сырых" идей - лучше зафиксировать, чем потерять</li>
                <li>• Добавьте примерную целевую аудиторию, если понятно</li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="px-6"
            >
              Сохранить идею
            </Button>
            <Link href="/simple-dashboard">
              <Button variant="outline">
                Отмена
              </Button>
            </Link>
          </div>

          {/* What's next */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900 mb-2">Что дальше?</h3>
              <p className="text-sm text-gray-600 mb-3">
                После сохранения идеи вы сможете:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Оценить её по RICE-методике</li>
                <li>• Превратить в проверяемую гипотезу</li>
                <li>• Спланировать эксперимент для проверки</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}