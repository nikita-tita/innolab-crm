"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lightbulb, Target, FlaskConical, TrendingUp, CheckCircle, Users, Clock, DollarSign } from "lucide-react";
import Link from "next/link";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/simple-dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Назад
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Методология тестирования идей</h1>
              <p className="text-sm text-gray-600">Как превратить идею в успешный продукт</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Introduction */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Lean Startup методология</h2>
          <p className="text-lg text-gray-600 mb-6">
            Система быстрого и дешевого тестирования бизнес-идей перед крупными инвестициями в разработку.
            Основана на цикле «Создать → Измерить → Учиться».
          </p>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-medium text-blue-900 mb-3">💡 Основной принцип</h3>
              <p className="text-blue-800">
                Вместо того чтобы тратить месяцы и большие бюджеты на разработку продукта, который может оказаться невостребованным,
                мы проверяем ключевые гипотезы быстрыми и дешевыми экспериментами.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Process Steps */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Процесс работы</h2>

          <div className="grid gap-8">
            {/* Step 1 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Фиксация идеи</h3>
                    <p className="text-gray-600 mb-4">
                      Записываем идею в свободной форме. Главное — зафиксировать основную мысль,
                      не теряя детали в голове.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Что записывать:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Суть продукта или сервиса</li>
                        <li>• Какую проблему решает</li>
                        <li>• Для кого предназначен</li>
                        <li>• Откуда пришла идея</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Формулировка гипотезы</h3>
                    <p className="text-gray-600 mb-4">
                      Превращаем идею в проверяемое утверждение. Гипотеза должна быть конкретной и измеримой.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Формат гипотезы:</h4>
                      <p className="text-sm text-gray-600 italic">
                        "Если мы [что сделаем], то [количество] [целевая аудитория]
                        [выполнит целевое действие] в течение [временной период]"
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">Пример:</h4>
                      <p className="text-sm text-green-800">
                        "Если мы запустим лендинг каршеринга по подписке, то 500+ пользователей
                        оставят заявку в течение первого месяца"
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FlaskConical className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Выбор эксперимента</h3>
                    <p className="text-gray-600 mb-4">
                      Выбираем самый быстрый и дешевый способ проверить гипотезу.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">🖥️ Landing Page</h4>
                        <p className="text-sm text-gray-600 mb-2">Проверка интереса к продукту</p>
                        <div className="space-y-1 text-xs text-gray-500">
                          <div>⏱️ Время: 1-3 дня</div>
                          <div>💰 Бюджет: 5-20k ₽</div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">📊 Опросы</h4>
                        <p className="text-sm text-gray-600 mb-2">Изучение потребностей аудитории</p>
                        <div className="space-y-1 text-xs text-gray-500">
                          <div>⏱️ Время: 1-2 недели</div>
                          <div>💰 Бюджет: 10-30k ₽</div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">🎨 Прототип</h4>
                        <p className="text-sm text-gray-600 mb-2">Тестирование UX/UI решений</p>
                        <div className="space-y-1 text-xs text-gray-500">
                          <div>⏱️ Время: 1-2 недели</div>
                          <div>💰 Бюджет: 20-50k ₽</div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">📊 Критерии успеха</h4>
                        <p className="text-sm text-gray-600 mb-2">Четкие метрики для оценки результата</p>
                        <div className="space-y-1 text-xs text-gray-500">
                          <div>⏱️ Время: 2-8 недель</div>
                          <div>💰 Бюджет: 100-500k ₽</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Анализ результатов</h3>
                    <p className="text-gray-600 mb-4">
                      Измеряем результаты и принимаем решение о дальнейших шагах.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                        <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
                        <h4 className="font-medium text-green-900 mb-1">✅ Гипотеза подтвердилась</h4>
                        <p className="text-sm text-green-700">Переходим к следующему этапу развития продукта</p>
                      </div>

                      <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
                        <Target className="h-6 w-6 text-yellow-600 mb-2" />
                        <h4 className="font-medium text-yellow-900 mb-1">🔄 Частично подтвердилась</h4>
                        <p className="text-sm text-yellow-700">Корректируем гипотезу и проводим новый тест</p>
                      </div>

                      <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                        <div className="w-6 h-6 text-red-600 mb-2">❌</div>
                        <h4 className="font-medium text-red-900 mb-1">❌ Гипотеза не подтвердилась</h4>
                        <p className="text-sm text-red-700">Пересматриваем идею или меняем подход</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RICE Methodology */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">RICE-методология приоритизации</h2>

          <Card>
            <CardContent className="p-6">
              <p className="text-gray-600 mb-6">
                RICE помогает оценить идеи и расставить приоритеты. Каждая идея оценивается по четырем критериям:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Reach (Охват)</h4>
                      <p className="text-sm text-gray-600">Сколько пользователей затронет изменение за период времени</p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Impact (Влияние)</h4>
                      <p className="text-sm text-gray-600">Насколько сильно повлияет на каждого пользователя (1-3)</p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Confidence (Уверенность)</h4>
                      <p className="text-sm text-gray-600">Насколько мы уверены в оценках (10-100%)</p>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Effort (Усилия)</h4>
                      <p className="text-sm text-gray-600">Сколько ресурсов потребует реализация</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Формула расчета:</h4>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      RICE = (R × I × C) ÷ E
                    </div>
                    <div className="text-sm text-gray-600">
                      Чем выше значение, тем выше приоритет
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-white rounded border">
                    <h5 className="font-medium text-gray-900 mb-1">Пример:</h5>
                    <div className="text-sm text-gray-600">
                      R: 1000 пользователей<br/>
                      I: 2 (средний эффект)<br/>
                      C: 70% (достаточно уверены)<br/>
                      E: 3 месяца<br/>
                      <strong>RICE = (1000 × 2 × 0.7) ÷ 3 = 466.7</strong>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Metrics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Критерии успеха экспериментов</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Пользовательские метрики</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Конверсия в регистрацию</li>
                  <li>• Retention (удержание)</li>
                  <li>• Engagement (вовлеченность)</li>
                  <li>• NPS (лояльность)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <DollarSign className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Бизнес-метрики</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• CAC (стоимость привлечения)</li>
                  <li>• LTV (жизненная ценность)</li>
                  <li>• Revenue (доходы)</li>
                  <li>• ROI (возврат инвестиций)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Clock className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Продуктовые метрики</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Time to Value</li>
                  <li>• Feature adoption</li>
                  <li>• Churn rate</li>
                  <li>• Customer satisfaction</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                Готовы применить методологию?
              </h3>
              <p className="text-blue-700 mb-6">
                Начните с простой идеи и пройдите полный цикл от гипотезы до результата
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/ideas/simple">
                  <Button className="gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Добавить идею
                  </Button>
                </Link>
                <Link href="/simple-dashboard">
                  <Button variant="outline">
                    Перейти к работе
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}