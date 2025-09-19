"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

interface KnowledgeItem {
  id: string
  title: string
  content: string
  category: string
  type: 'article' | 'template' | 'checklist' | 'guide'
}

export default function Knowledge() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  const knowledgeBase: KnowledgeItem[] = [
    {
      id: "hadi-methodology",
      title: "Методология HADI: Основы",
      content: `# Методология HADI

HADI (Hypothesis, Action, Data, Insight) — это итеративный подход к проверке гипотез и принятию решений на основе данных.

## Этапы HADI цикла:

### 1. Hypothesis (Гипотеза)
- Формулируйте конкретные, измеримые предположения
- Используйте формат: "Если мы сделаем X, то получим Y, потому что Z"
- Определите критерии успеха заранее

### 2. Action (Действие)
- Создайте минимальный жизнеспособный продукт (MVP)
- Запустите эксперимент для проверки гипотезы
- Определите временные рамки и ресурсы

### 3. Data (Данные)
- Собирайте релевантные метрики
- Анализируйте качественные и количественные данные
- Обеспечьте статистическую значимость результатов

### 4. Insight (Инсайт)
- Интерпретируйте результаты объективно
- Определите следующие шаги на основе полученных данных
- Зафиксируйте полученные знания для будущего использования`,
      category: "methodology",
      type: "article"
    },
    {
      id: "hypothesis-template",
      title: "Шаблон формулирования гипотез",
      content: `# Шаблон для создания гипотез

## Базовая структура:
**"Если мы [действие], то [ожидаемый результат], потому что [обоснование]"**

## Детальный шаблон:

### Название гипотезы:
_Краткое описание того, что вы хотите проверить_

### Проблема:
_Какую проблему или возможность вы хотите решить?_

### Целевая аудитория:
_Кто ваши пользователи?_

### Гипотеза:
Если мы _________________ (действие/изменение)
То _____________________ (ожидаемый результат)
Потому что _____________ (обоснование/причина)

### Критерии успеха:
- Метрика 1: ___________
- Метрика 2: ___________
- Минимальный порог: ___________

### Уровень уверенности:
_От 1 до 100% - насколько вы уверены в успехе_

### Способ проверки:
_Как вы будете тестировать эту гипотезу?_

### Временные рамки:
_Сколько времени потребуется на тест?_`,
      category: "templates",
      type: "template"
    },
    {
      id: "experiment-checklist",
      title: "Чек-лист для запуска эксперимента",
      content: `# Чек-лист перед запуском эксперимента

## Подготовка

- [ ] Гипотеза четко сформулирована
- [ ] Определены критерии успеха
- [ ] Выбрана целевая аудитория
- [ ] Рассчитан необходимый размер выборки
- [ ] Определена длительность эксперимента
- [ ] Выбраны метрики для отслеживания
- [ ] Настроена система аналитики

## Планирование эксперимента

- [ ] Создан план эксперимента
- [ ] Определены контрольная и тестовая группы
- [ ] Выбран метод рандомизации
- [ ] Учтены внешние факторы
- [ ] Подготовлены материалы (MVP, лендинги, анкеты)
- [ ] Команда проинформирована о плане

## Во время эксперимента

- [ ] Мониторинг метрик в режиме реального времени
- [ ] Проверка качества данных
- [ ] Документирование наблюдений
- [ ] Отслеживание внешних событий
- [ ] Регулярные check-in с командой

## После эксперимента

- [ ] Собраны все данные
- [ ] Проведен статистический анализ
- [ ] Сделаны выводы
- [ ] Зафиксированы инсайты
- [ ] Определены следующие шаги
- [ ] Результаты представлены команде`,
      category: "process",
      type: "checklist"
    },
    {
      id: "mvp-types",
      title: "Типы MVP и когда их использовать",
      content: `# Типы MVP для проверки гипотез

## 1. Лендинг-страница
**Когда использовать:** Проверка спроса на продукт
**Как:** Создайте страницу с описанием продукта и кнопкой CTA
**Метрики:** Конверсия в подписку/предзаказ

## 2. Интерактивный прототип
**Когда использовать:** Тестирование UX и пользовательских сценариев
**Как:** Используйте Figma, InVision или похожие инструменты
**Метрики:** Время выполнения задач, успешность прохождения сценариев

## 3. Wizard of Oz
**Когда использовать:** Проверка сложной функциональности
**Как:** Имитируйте автоматизацию ручными процессами
**Метрики:** Удовлетворенность пользователей, частота использования

## 4. Конкьерж MVP
**Когда использовать:** Глубокое понимание потребностей пользователей
**Как:** Оказывайте услугу вручную небольшой группе клиентов
**Метрики:** NPS, готовность платить, feedback качества

## 5. A/B тест существующего продукта
**Когда использовать:** Оптимизация текущих функций
**Как:** Измените один элемент для части пользователей
**Метрики:** Конверсия, удержание, выручка

## 6. Дымовый тест
**Когда использовать:** Быстрая проверка интереса к идее
**Как:** Создайте видео или объявление о несуществующем продукте
**Метрики:** Клики, комментарии, запросы информации`,
      category: "mvp",
      type: "guide"
    },
    {
      id: "metrics-guide",
      title: "Руководство по выбору метрик",
      content: `# Как выбрать правильные метрики

## Принципы выбора метрик

### 1. HEART Framework
- **H**appiness: Удовлетворенность пользователей
- **E**ngagement: Вовлеченность
- **A**doption: Принятие продукта
- **R**etention: Удержание
- **T**ask success: Успешность выполнения задач

### 2. Пирамида метрик
1. **Северная звезда** - главная метрика продукта
2. **Ключевые метрики** - 3-5 основных показателей
3. **Вспомогательные метрики** - детализирующие показатели

## Типы метрик по стадиям

### Ранняя стадия (Problem-Solution Fit)
- Готовность пользователей решать проблему
- Частота возникновения проблемы
- Существующие способы решения

### Средняя стадия (Product-Market Fit)
- Net Promoter Score (NPS)
- Органический рост
- Повторные покупки/использование

### Поздняя стадия (Масштабирование)
- Customer Lifetime Value (CLV)
- Customer Acquisition Cost (CAC)
- Чистая прибыль

## Примеры метрик по типу продукта

### SaaS продукты
- Monthly Recurring Revenue (MRR)
- Churn Rate
- Daily/Monthly Active Users

### E-commerce
- Conversion Rate
- Average Order Value
- Return Customer Rate

### Контентные продукты
- Time on Site
- Pages per Session
- Return Visitor Rate`,
      category: "analytics",
      type: "guide"
    },
    {
      id: "common-mistakes",
      title: "Частые ошибки в экспериментах",
      content: `# Топ-10 ошибок в экспериментах

## 1. Недостаточный размер выборки
**Проблема:** Результаты статистически незначимы
**Решение:** Рассчитайте необходимый размер выборки заранее

## 2. Слишком короткий период тестирования
**Проблема:** Не учитываются сезонные колебания
**Решение:** Тестируйте минимум 1-2 недели, лучше полный бизнес-цикл

## 3. Тестирование множественных изменений
**Проблема:** Невозможно определить, что именно повлияло на результат
**Решение:** Изменяйте только один элемент за раз

## 4. Bias в интерпретации данных
**Проблема:** Видим то, что хотим увидеть
**Решение:** Заранее определите критерии успеха и придерживайтесь их

## 5. Игнорирование статистической значимости
**Проблема:** Ложные выводы из случайных колебаний
**Решение:** Используйте p-value < 0.05 и доверительные интервалы

## 6. Останавливание теста при первых положительных результатах
**Проблема:** Peeking problem - подглядывание в результаты
**Решение:** Определите длительность теста заранее и не меняйте

## 7. Не учет внешних факторов
**Проблема:** Результаты искажены внешними событиями
**Решение:** Документируйте все внешние события во время теста

## 8. Фокус только на статистической значимости
**Проблема:** Игнорирование практической значимости
**Решение:** Учитывайте effect size и business impact

## 9. Тестирование нерепрезентативной аудитории
**Проблема:** Результаты не применимы к целевой аудитории
**Решение:** Тщательно сегментируйте и рандомизируйте группы

## 10. Отсутствие follow-up
**Проблема:** Не отслеживаем долгосрочные эффекты
**Решение:** Мониторьте ключевые метрики после завершения теста`,
      category: "best-practices",
      type: "article"
    }
  ]

  const categories = [
    { value: "all", label: "Все категории" },
    { value: "methodology", label: "Методология" },
    { value: "templates", label: "Шаблоны" },
    { value: "process", label: "Процессы" },
    { value: "mvp", label: "MVP" },
    { value: "analytics", label: "Аналитика" },
    { value: "best-practices", label: "Лучшие практики" }
  ]

  const types = [
    { value: "all", label: "Все типы" },
    { value: "article", label: "Статьи" },
    { value: "template", label: "Шаблоны" },
    { value: "checklist", label: "Чек-листы" },
    { value: "guide", label: "Руководства" }
  ]

  const filteredItems = knowledgeBase.filter(item => {
    const matchesSearch = searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesType = selectedType === "all" || item.type === selectedType

    return matchesSearch && matchesCategory && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article": return "📄"
      case "template": return "📝"
      case "checklist": return "✅"
      case "guide": return "📖"
      default: return "📄"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "article": return "bg-blue-100 text-blue-800"
      case "template": return "bg-green-100 text-green-800"
      case "checklist": return "bg-purple-100 text-purple-800"
      case "guide": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
                InnoLab CRM
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {session.user?.name || session.user?.email}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link href="/dashboard" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Дашборд
            </Link>
            <Link href="/ideas" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Идеи
            </Link>
            <Link href="/hypotheses" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Гипотезы
            </Link>
            <Link href="/experiments" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Эксперименты
            </Link>
            <Link href="/knowledge" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
              База знаний
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">База знаний</h1>
            <div className="text-sm text-gray-500">
              {filteredItems.length} материалов
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Поиск
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по названию или содержимому..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип материала
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {types.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Knowledge Items */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{getTypeIcon(item.type)}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(item.type)}`}>
                      {types.find(t => t.value === item.type)?.label}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>

                <div className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {item.content.slice(0, 150)}...
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {categories.find(c => c.value === item.category)?.label}
                  </span>
                  <button
                    onClick={() => {
                      // В реальном приложении здесь был бы переход на отдельную страницу
                      alert(`Содержимое: ${item.content}`)
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Читать полностью
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📚</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ничего не найдено</h3>
              <p className="text-gray-500">
                Попробуйте изменить критерии поиска
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
