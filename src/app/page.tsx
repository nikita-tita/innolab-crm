import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            InnoLab CRM
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Полнофункциональная система управления инновациями с HADI методологией
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Полный цикл от идеи до инсайтов: управление гипотезами, эксперименты,
            автоматический анализ результатов и MVP разработка
          </p>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">💡</div>
              <h3 className="text-lg font-semibold mb-2">Ideas</h3>
              <p className="text-gray-600">Управление и приоритизация идей</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🔬</div>
              <h3 className="text-lg font-semibold mb-2">Hypotheses</h3>
              <p className="text-gray-600">Формулирование проверяемых гипотез</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🧪</div>
              <h3 className="text-lg font-semibold mb-2">Experiments</h3>
              <p className="text-gray-600">Планирование и проведение экспериментов</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold mb-2">MVP</h3>
              <p className="text-gray-600">Разработка минимальных продуктов</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔥 Новые возможности</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🤖 Автоматический анализ</h3>
                <p className="text-sm text-gray-600">ИИ-powered анализ результатов экспериментов с инсайтами и рекомендациями</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📊 Lifecycle визуализация</h3>
                <p className="text-sm text-gray-600">Полная прозрачность движения идей через весь HADI цикл</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📈 Управление результатами</h3>
                <p className="text-sm text-gray-600">Сбор метрик с автоматическим сравнением с критериями успеха</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🎯 MVP трекер</h3>
                <p className="text-sm text-gray-600">Канбан доска с прогресс-трекингом разработки MVP</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              🚀 Открыть систему
            </Link>
            <Link
              href="/workflow"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              📊 Воронка процесса
            </Link>
            <Link
              href="/auth/signin"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              🔐 Войти в систему
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>💡 Тестовые данные уже загружены. Используйте любой email для входа.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
