"use client"

type Step = {
  key: "H" | "A" | "D" | "I"
  title: string
  description: string
}

const steps: Step[] = [
  { key: "H", title: "Hypothesis", description: "Сформулируйте проверяемое предположение" },
  { key: "A", title: "Action", description: "Запланируйте и выполните эксперимент" },
  { key: "D", title: "Data", description: "Соберите и проанализируйте данные" },
  { key: "I", title: "Insight", description: "Сделайте выводы и примите решение" }
]

export default function HADIStepper({ current }: { current: "H" | "A" | "D" | "I" }) {
  const currentIndex = steps.findIndex(s => s.key === current)
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        {steps.map((s, idx) => (
          <div key={s.key} className="flex-1 flex items-center">
            <div className={`flex flex-col items-center text-center ${idx <= currentIndex ? "text-blue-700" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${idx <= currentIndex ? "bg-blue-100" : "bg-gray-100"}`}>
                {s.key}
              </div>
              <div className="mt-1 text-xs font-medium">{s.title}</div>
            </div>
            {idx < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-2 ${idx < currentIndex ? "bg-blue-300" : "bg-gray-200"}`}></div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 text-sm text-gray-600">
        {steps[currentIndex]?.description}
      </div>
    </div>
  )
}


