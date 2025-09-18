export default function Demo() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">InnoLab CRM - Демо</h1>
          <p className="text-gray-600">Система управления инновационными гипотезами</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Идеи</h3>
            <div className="text-3xl font-bold text-blue-600">12</div>
            <p className="text-sm text-gray-500">В процессе</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Гипотезы</h3>
            <div className="text-3xl font-bold text-green-600">8</div>
            <p className="text-sm text-gray-500">Активных</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Эксперименты</h3>
            <div className="text-3xl font-bold text-orange-600">5</div>
            <p className="text-sm text-gray-500">Запущено</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Успешность</h3>
            <div className="text-3xl font-bold text-purple-600">67%</div>
            <p className="text-sm text-gray-500">Подтвержденных гипотез</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Последние идеи</h2>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-medium">Персонализированная аналитика</h3>
                <p className="text-sm text-gray-600">Создать систему персонализации отчетов для пользователей</p>
                <span className="text-xs text-gray-400">2 дня назад</span>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-medium">Мобильное приложение</h3>
                <p className="text-sm text-gray-600">Разработать мобильную версию для работы в поле</p>
                <span className="text-xs text-gray-400">5 дней назад</span>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-medium">AI-ассистент</h3>
                <p className="text-sm text-gray-600">Интеграция ИИ для анализа гипотез</p>
                <span className="text-xs text-gray-400">1 неделя назад</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Канбан гипотез</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="font-medium text-sm mb-2">Новые</h3>
                <div className="space-y-2">
                  <div className="bg-white p-2 rounded text-xs">
                    Увеличить конверсию на 15%
                  </div>
                  <div className="bg-white p-2 rounded text-xs">
                    Снизить время отклика
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded">
                <h3 className="font-medium text-sm mb-2">В тестировании</h3>
                <div className="space-y-2">
                  <div className="bg-white p-2 rounded text-xs">
                    A/B тест лендинга
                  </div>
                  <div className="bg-white p-2 rounded text-xs">
                    Опрос пользователей
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded">
                <h3 className="font-medium text-sm mb-2">Завершено</h3>
                <div className="space-y-2">
                  <div className="bg-white p-2 rounded text-xs">
                    ✅ Новая регистрация
                  </div>
                  <div className="bg-white p-2 rounded text-xs">
                    ❌ Чат-бот поддержки
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">HADI-цикл</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="font-medium">Hypothesis</h3>
              <p className="text-sm text-gray-600">Формулировка предположения</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-medium">Action</h3>
              <p className="text-sm text-gray-600">Проведение эксперимента</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-medium">Data</h3>
              <p className="text-sm text-gray-600">Сбор и анализ данных</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="font-medium">Insight</h3>
              <p className="text-sm text-gray-600">Извлечение инсайтов</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}