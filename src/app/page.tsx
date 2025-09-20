import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Notion-style header */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">IL</span>
              </div>
              <span className="font-medium text-gray-900">InnoLab</span>
            </div>
            <Link
              href="/simple-dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Войти
            </Link>
          </div>
        </div>
      </div>

      {/* Hero section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Превращайте идеи<br />в успешные продукты
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Простая система для тестирования идей новых продуктов.
            Проверяйте гипотезы быстро и дёшево, прежде чем вкладывать большие ресурсы.
          </p>
          <Link
            href="/simple-dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Начать бесплатно →
          </Link>
        </div>

        {/* Quick overview */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Собирайте идеи</h3>
            <p className="text-gray-600 text-sm">Фиксируйте все идеи команды в одном месте</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧪</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Тестируйте быстро</h3>
            <p className="text-gray-600 text-sm">Проверяйте гипотезы за дни, а не месяцы</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Принимайте решения</h3>
            <p className="text-gray-600 text-sm">Основывайтесь на данных, а не на мнениях</p>
          </div>
        </div>

        {/* Simple process */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Как это работает
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Добавьте идею</h3>
                <p className="text-gray-600 text-sm">Опишите идею нового продукта в свободной форме</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Сформулируйте гипотезу</h3>
                <p className="text-gray-600 text-sm">Превратите идею в проверяемое предположение</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Выберите эксперимент</h3>
                <p className="text-gray-600 text-sm">Лендинг, прототип, опросы или MVP — выберите подходящий тест</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Получите результат</h3>
                <p className="text-gray-600 text-sm">Проанализируйте данные и примите решение о дальнейших шагах</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/simple-dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Попробовать сейчас
          </Link>
          <p className="text-gray-500 text-sm mt-4">Бесплатно • Без регистрации • Начните за 2 минуты</p>
        </div>
      </div>
    </div>
  );
}
