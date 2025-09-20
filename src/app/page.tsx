import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            InnoLab CRM
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            Простая система управления идеями и гипотезами
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link href="/ideas" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">💡</div>
              <h3 className="text-lg font-semibold mb-2">Идеи</h3>
              <p className="text-gray-600">Создание и управление идеями</p>
            </Link>

            <Link href="/hypotheses" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">🔬</div>
              <h3 className="text-lg font-semibold mb-2">Гипотезы</h3>
              <p className="text-gray-600">Проверяемые гипотезы и тесты</p>
            </Link>

            <Link href="/experiments" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">🧪</div>
              <h3 className="text-lg font-semibold mb-2">Эксперименты</h3>
              <p className="text-gray-600">Проведение и результаты</p>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Открыть систему
            </Link>
            <Link
              href="/workflow"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Процесс работы
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
