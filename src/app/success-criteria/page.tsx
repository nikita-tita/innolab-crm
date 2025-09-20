"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, TrendingUp, Users, DollarSign, Clock, CheckCircle, Info } from "lucide-react";
import Link from "next/link";

export default function SuccessCriteriaPage() {
  const [activeTab, setActiveTab] = useState("define");
  const [criteria, setCriteria] = useState({
    userMetrics: {
      conversionRate: "",
      retention: "",
      engagement: "",
      nps: ""
    },
    businessMetrics: {
      cac: "",
      ltv: "",
      revenue: "",
      roi: ""
    },
    productMetrics: {
      timeToValue: "",
      featureAdoption: "",
      churnRate: "",
      satisfaction: ""
    }
  });

  const handleSave = () => {
    localStorage.setItem('successCriteria', JSON.stringify(criteria));
    alert('✅ Критерии успеха сохранены!');
  };

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
              <h1 className="text-xl font-semibold text-gray-900">Критерии успеха экспериментов</h1>
              <p className="text-sm text-gray-600">Определите, как измерять успех ваших продуктовых гипотез</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("define")}
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "define"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Определить критерии
          </button>
          <button
            onClick={() => setActiveTab("theory")}
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "theory"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Теория и примеры
          </button>
        </div>

        {/* Define Criteria Tab */}
        {activeTab === "define" && (
          <div className="space-y-8">
            {/* Introduction */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-2">Зачем нужны критерии успеха?</h3>
                    <p className="text-blue-800 text-sm">
                      Критерии успеха помогают объективно оценить результаты экспериментов и принять решение:
                      продолжать развитие идеи, изменить подход или остановиться.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Metrics */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Пользовательские метрики</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Конверсия в целевое действие
                    </label>
                    <input
                      type="text"
                      placeholder="Например: 15% посетителей оставят заявку"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={criteria.userMetrics.conversionRate}
                      onChange={(e) => setCriteria({
                        ...criteria,
                        userMetrics: { ...criteria.userMetrics, conversionRate: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Удержание пользователей (Retention)
                    </label>
                    <input
                      type="text"
                      placeholder="Например: 60% вернутся в течение недели"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={criteria.userMetrics.retention}
                      onChange={(e) => setCriteria({
                        ...criteria,
                        userMetrics: { ...criteria.userMetrics, retention: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Вовлеченность (Engagement)
                    </label>
                    <input
                      type="text"
                      placeholder="Например: 5+ действий за сессию"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={criteria.userMetrics.engagement}
                      onChange={(e) => setCriteria({
                        ...criteria,
                        userMetrics: { ...criteria.userMetrics, engagement: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NPS (Лояльность)
                    </label>
                    <input
                      type="text"
                      placeholder="Например: NPS > 50"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={criteria.userMetrics.nps}
                      onChange={(e) => setCriteria({
                        ...criteria,
                        userMetrics: { ...criteria.userMetrics, nps: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Metrics */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Бизнес-метрики</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CAC (Стоимость привлечения клиента)
                    </label>
                    <input
                      type="text"
                      placeholder="Например: CAC < 1000 ₽"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={criteria.businessMetrics.cac}
                      onChange={(e) => setCriteria({
                        ...criteria,
                        businessMetrics: { ...criteria.businessMetrics, cac: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LTV (Жизненная ценность клиента)
                    </label>
                    <input
                      type="text"
                      placeholder="Например: LTV > 5000 ₽"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={criteria.businessMetrics.ltv}
                      onChange={(e) => setCriteria({
                        ...criteria,
                        businessMetrics: { ...criteria.businessMetrics, ltv: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Доходы (Revenue)
                    </label>
                    <input
                      type="text"
                      placeholder="Например: 100k ₽ за первый месяц"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={criteria.businessMetrics.revenue}
                      onChange={(e) => setCriteria({
                        ...criteria,
                        businessMetrics: { ...criteria.businessMetrics, revenue: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ROI (Возврат инвестиций)
                    </label>
                    <input
                      type="text"
                      placeholder="Например: ROI > 200%"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={criteria.businessMetrics.roi}
                      onChange={(e) => setCriteria({
                        ...criteria,
                        businessMetrics: { ...criteria.businessMetrics, roi: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Metrics */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Продуктовые метрики</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time to Value (Время до ценности)
                    </label>
                    <input
                      type="text"
                      placeholder="Например: Пользователь получает результат за < 2 минут"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={criteria.productMetrics.timeToValue}
                      onChange={(e) => setCriteria({
                        ...criteria,
                        productMetrics: { ...criteria.productMetrics, timeToValue: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feature Adoption (Принятие функций)
                    </label>
                    <input
                      type="text"
                      placeholder="Например: 70% используют ключевую функцию"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={criteria.productMetrics.featureAdoption}
                      onChange={(e) => setCriteria({
                        ...criteria,
                        productMetrics: { ...criteria.productMetrics, featureAdoption: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Churn Rate (Отток)
                    </label>
                    <input
                      type="text"
                      placeholder="Например: Churn < 5% в месяц"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={criteria.productMetrics.churnRate}
                      onChange={(e) => setCriteria({
                        ...criteria,
                        productMetrics: { ...criteria.productMetrics, churnRate: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Satisfaction (Удовлетворенность)
                    </label>
                    <input
                      type="text"
                      placeholder="Например: Рейтинг > 4.5/5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={criteria.productMetrics.satisfaction}
                      onChange={(e) => setCriteria({
                        ...criteria,
                        productMetrics: { ...criteria.productMetrics, satisfaction: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="text-center">
              <Button onClick={handleSave} className="px-8">
                <CheckCircle className="h-4 w-4 mr-2" />
                Сохранить критерии успеха
              </Button>
            </div>
          </div>
        )}

        {/* Theory Tab */}
        {activeTab === "theory" && (
          <div className="space-y-8">
            {/* SMART Criteria */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">SMART-критерии для метрик</h2>
                <p className="text-gray-600 mb-6">
                  Каждая метрика должна быть SMART: конкретной, измеримой, достижимой, релевантной и ограниченной по времени.
                </p>

                <div className="grid md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Specific</h3>
                    <p className="text-sm text-gray-600">Конкретная</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Measurable</h3>
                    <p className="text-sm text-gray-600">Измеримая</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-yellow-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Achievable</h3>
                    <p className="text-sm text-gray-600">Достижимая</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Relevant</h3>
                    <p className="text-sm text-gray-600">Релевантная</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Clock className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Time-bound</h3>
                    <p className="text-sm text-gray-600">Ограниченная</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Examples */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Примеры хороших критериев</h2>

                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-green-900 mb-2">✅ Хорошо</h3>
                    <p className="text-green-800 mb-1">"15% посетителей лендинга оставят email для получения beta-доступа в течение первых 2 недель"</p>
                    <p className="text-sm text-green-600">Конкретно, измеримо, ограничено по времени</p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h3 className="font-semibold text-red-900 mb-2">❌ Плохо</h3>
                    <p className="text-red-800 mb-1">"Пользователям понравится продукт"</p>
                    <p className="text-sm text-red-600">Слишком расплывчато, неизмеримо</p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-green-900 mb-2">✅ Хорошо</h3>
                    <p className="text-green-800 mb-1">"60% пользователей вернутся в приложение в течение 7 дней после регистрации"</p>
                    <p className="text-sm text-green-600">Четкая метрика с временными рамками</p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h3 className="font-semibold text-red-900 mb-2">❌ Плохо</h3>
                    <p className="text-red-800 mb-1">"Высокий retention"</p>
                    <p className="text-sm text-red-600">Неконкретно, что означает "высокий"?</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metric Types */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Типы метрик по этапам продукта</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">🚀 Ранний этап (Problem-Solution Fit)</h3>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Количество интервью с потенциальными клиентами</li>
                        <li>• % подтверждения проблемы в интервью</li>
                        <li>• Конверсия лендинга в заявки</li>
                        <li>• Время на объяснение ценности продукта</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Средний этап (Product-Market Fit)</h3>
                    <div className="bg-green-50 rounded-lg p-4">
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• DAU/MAU (ежедневные/месячные активные пользователи)</li>
                        <li>• Retention: Day 1, Day 7, Day 30</li>
                        <li>• NPS &gt; 50</li>
                        <li>• Органический рост через рекомендации</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">📈 Поздний этап (Scaling)</h3>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>• LTV/CAC &gt; 3</li>
                        <li>• Payback period &lt; 12 месяцев</li>
                        <li>• Revenue growth rate</li>
                        <li>• Market share</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Industry Benchmarks */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Бенчмарки по индустриям</h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Индустрия</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Конверсия лендинга</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Email открытия</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Retention (Day 7)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900">SaaS B2B</td>
                        <td className="py-3 px-4 text-gray-600">2-5%</td>
                        <td className="py-3 px-4 text-gray-600">20-25%</td>
                        <td className="py-3 px-4 text-gray-600">40-60%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900">E-commerce</td>
                        <td className="py-3 px-4 text-gray-600">1-3%</td>
                        <td className="py-3 px-4 text-gray-600">15-20%</td>
                        <td className="py-3 px-4 text-gray-600">20-30%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900">Мобильные игры</td>
                        <td className="py-3 px-4 text-gray-600">25-40%</td>
                        <td className="py-3 px-4 text-gray-600">25-35%</td>
                        <td className="py-3 px-4 text-gray-600">10-20%</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-gray-900">Финтех</td>
                        <td className="py-3 px-4 text-gray-600">5-10%</td>
                        <td className="py-3 px-4 text-gray-600">22-28%</td>
                        <td className="py-3 px-4 text-gray-600">50-70%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  * Данные являются примерными и могут варьироваться в зависимости от продукта и рынка
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}