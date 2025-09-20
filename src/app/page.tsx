import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            InnoLab CRM
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Система для запуска новых продуктов
          </p>
          <p className="text-base text-gray-500 mb-12 max-w-2xl mx-auto">
            От идеи до MVP: проверяйте гипотезы быстро и дёшево, прежде чем вкладывать большие ресурсы
          </p>

          {/* 8-этапный процесс */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-xl font-semibold mb-6">8 этапов методологии</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-800">1. Банк идей</div>
                <div className="text-gray-600">Сбор и фиксация</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="font-semibold text-yellow-800">2. RICE-скоринг</div>
                <div className="text-gray-600">Приоритизация</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-800">3. Гипотезы</div>
                <div className="text-gray-600">Формулирование</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="font-semibold text-purple-800">4. Приоритизация</div>
                <div className="text-gray-600">Выбор для теста</div>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="font-semibold text-indigo-800">5. Desk Research</div>
                <div className="text-gray-600">Кабинетный анализ</div>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg">
                <div className="font-semibold text-pink-800">6. Дизайн теста</div>
                <div className="text-gray-600">Планирование MVP</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="font-semibold text-orange-800">7. Эксперимент</div>
                <div className="text-gray-600">Тестирование</div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <div className="font-semibold text-emerald-800">8. Анализ</div>
                <div className="text-gray-600">Выводы и решения</div>
              </div>
            </div>
          </div>

          {/* Основные разделы */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link href="/workflow" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">🔄</div>
              <h3 className="text-lg font-semibold mb-2">Воронка процесса</h3>
              <p className="text-gray-600">Визуализация 8-этапного движения идей</p>
            </Link>

            <Link href="/ideas" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">💡</div>
              <h3 className="text-lg font-semibold mb-2">Банк идей</h3>
              <p className="text-gray-600">Сбор идей для новых продуктов</p>
            </Link>

            <Link href="/hypotheses" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">🔬</div>
              <h3 className="text-lg font-semibold mb-2">Гипотезы</h3>
              <p className="text-gray-600">Проверяемые предположения</p>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              🚀 Начать работу
            </Link>
            <Link
              href="/workflow"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              📊 Посмотреть процесс
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
