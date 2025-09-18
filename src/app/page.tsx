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
            Адаптивный IT-сервис для управления инновационными гипотезами
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Систематизируйте инновационный процесс от идеи до результата с использованием методологии HADI
            (Hypothesis, Action, Data, Insight)
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">💡</div>
              <h3 className="text-lg font-semibold mb-2">Управление идеями</h3>
              <p className="text-gray-600">От первоначальной идеи до проверяемой гипотезы</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🔬</div>
              <h3 className="text-lg font-semibold mb-2">HADI-циклы</h3>
              <p className="text-gray-600">Структурированное тестирование гипотез</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2">Аналитика</h3>
              <p className="text-gray-600">Метрики и инсайты для принятия решений</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Перейти к дашборду
            </Link>
            <Link
              href="/auth/signin"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Войти в систему
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
