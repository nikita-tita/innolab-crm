import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Базовая конфигурация полей для разных этапов и уровней
const DEFAULT_FIELDS = {
  LEVEL_1: {
    FORMULATION: [
      {
        fieldName: "actionDescription",
        label: "Если мы сделаем...",
        fieldType: "TEXTAREA",
        isRequired: true,
        isVisible: true,
        position: 1
      },
      {
        fieldName: "expectedResult",
        label: "То произойдёт...",
        fieldType: "TEXTAREA",
        isRequired: true,
        isVisible: true,
        position: 2
      },
      {
        fieldName: "reasoning",
        label: "Потому что...",
        fieldType: "TEXTAREA",
        isRequired: true,
        isVisible: true,
        position: 3
      },
      {
        fieldName: "iceImpact",
        label: "Impact (Влияние)",
        fieldType: "NUMBER",
        isRequired: false,
        isVisible: true,
        position: 4,
        validationRules: { min: 1, max: 10 }
      },
      {
        fieldName: "iceConfidence",
        label: "Confidence (Уверенность)",
        fieldType: "NUMBER",
        isRequired: false,
        isVisible: true,
        position: 5,
        validationRules: { min: 1, max: 10 }
      },
      {
        fieldName: "iceEase",
        label: "Ease (Простота)",
        fieldType: "NUMBER",
        isRequired: false,
        isVisible: true,
        position: 6,
        validationRules: { min: 1, max: 10 }
      }
    ]
  },
  LEVEL_2: {
    DESK_RESEARCH: [
      {
        fieldName: "researchSources",
        label: "Источники исследования",
        fieldType: "TEXTAREA",
        isRequired: true,
        isVisible: true,
        position: 1
      },
      {
        fieldName: "researchFindings",
        label: "Результаты исследования",
        fieldType: "TEXTAREA",
        isRequired: true,
        isVisible: true,
        position: 2
      },
      {
        fieldName: "marketAnalysis",
        label: "Анализ рынка",
        fieldType: "TEXTAREA",
        isRequired: false,
        isVisible: true,
        position: 3
      },
      {
        fieldName: "competitorAnalysis",
        label: "Анализ конкурентов",
        fieldType: "TEXTAREA",
        isRequired: false,
        isVisible: true,
        position: 4
      }
    ],
    EXPERIMENT_DESIGN: [
      {
        fieldName: "experimentGoal",
        label: "Цель эксперимента",
        fieldType: "TEXTAREA",
        isRequired: true,
        isVisible: true,
        position: 1
      },
      {
        fieldName: "targetAudience",
        label: "Целевая аудитория",
        fieldType: "TEXTAREA",
        isRequired: true,
        isVisible: true,
        position: 2
      },
      {
        fieldName: "experimentMethod",
        label: "Метод проведения",
        fieldType: "TEXTAREA",
        isRequired: true,
        isVisible: true,
        position: 3
      },
      {
        fieldName: "successMetrics",
        label: "Метрики успеха",
        fieldType: "TEXTAREA",
        isRequired: true,
        isVisible: true,
        position: 4
      },
      {
        fieldName: "duration",
        label: "Длительность эксперимента",
        fieldType: "TEXT",
        isRequired: false,
        isVisible: true,
        position: 5
      },
      {
        fieldName: "budget",
        label: "Бюджет",
        fieldType: "NUMBER",
        isRequired: false,
        isVisible: true,
        position: 6
      }
    ],
    EXPERIMENT_EXECUTION: [
      {
        fieldName: "executionResults",
        label: "Результаты выполнения",
        fieldType: "TEXTAREA",
        isRequired: true,
        isVisible: true,
        position: 1
      },
      {
        fieldName: "dataCollected",
        label: "Собранные данные",
        fieldType: "TEXTAREA",
        isRequired: true,
        isVisible: true,
        position: 2
      },
      {
        fieldName: "observations",
        label: "Наблюдения",
        fieldType: "TEXTAREA",
        isRequired: false,
        isVisible: true,
        position: 3
      },
      {
        fieldName: "issues",
        label: "Возникшие проблемы",
        fieldType: "TEXTAREA",
        isRequired: false,
        isVisible: true,
        position: 4
      }
    ],
    CONCLUSION: [
      {
        fieldName: "conclusion",
        label: "Заключение",
        fieldType: "SELECT",
        isRequired: true,
        isVisible: true,
        position: 1,
        options: ["CONFIRMED", "REFUTED", "PARTIALLY_CONFIRMED", "INCONCLUSIVE"]
      },
      {
        fieldName: "conclusionDescription",
        label: "Описание заключения",
        fieldType: "TEXTAREA",
        isRequired: true,
        isVisible: true,
        position: 2
      },
      {
        fieldName: "recommendations",
        label: "Рекомендации",
        fieldType: "TEXTAREA",
        isRequired: false,
        isVisible: true,
        position: 3
      },
      {
        fieldName: "nextSteps",
        label: "Следующие шаги",
        fieldType: "TEXTAREA",
        isRequired: false,
        isVisible: true,
        position: 4
      }
    ]
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Доступ запрещен. Только администраторы могут инициализировать поля" },
        { status: 403 }
      )
    }

    const { level, stage, force } = await request.json()

    // Если указаны конкретные level и stage - инициализируем только их
    if (level && stage) {
      const fields = DEFAULT_FIELDS[level as keyof typeof DEFAULT_FIELDS]?.[stage as keyof typeof DEFAULT_FIELDS.LEVEL_1]

      if (!fields) {
        return NextResponse.json(
          { error: "Некорректные параметры level или stage" },
          { status: 400 }
        )
      }

      // Проверяем, есть ли уже поля для данного этапа и уровня
      if (!force) {
        const existingFields = await prisma.formFieldConfig.findFirst({
          where: { stage, hypothesisLevel: level }
        })

        if (existingFields) {
          return NextResponse.json(
            { error: "Поля для данного этапа и уровня уже существуют. Используйте force=true для перезаписи" },
            { status: 400 }
          )
        }
      }

      // Удаляем существующие поля если force=true
      if (force) {
        await prisma.formFieldConfig.deleteMany({
          where: { stage, hypothesisLevel: level }
        })
      }

      // Создаем новые поля
      const createdFields = await prisma.formFieldConfig.createMany({
        data: fields.map(field => ({
          ...field,
          stage,
          hypothesisLevel: level
        }))
      })

      return NextResponse.json({
        message: `Инициализированы поля для ${level} - ${stage}`,
        count: createdFields.count
      })
    }

    // Полная инициализация всех полей
    let totalCreated = 0

    for (const [levelKey, stages] of Object.entries(DEFAULT_FIELDS)) {
      for (const [stageKey, fields] of Object.entries(stages)) {
        // Проверяем, есть ли уже поля для данного этапа и уровня
        if (!force) {
          const existingFields = await prisma.formFieldConfig.findFirst({
            where: { stage: stageKey, hypothesisLevel: levelKey }
          })

          if (existingFields) {
            continue // Пропускаем если уже есть поля
          }
        } else {
          // Удаляем существующие поля если force=true
          await prisma.formFieldConfig.deleteMany({
            where: { stage: stageKey, hypothesisLevel: levelKey }
          })
        }

        // Создаем новые поля
        const result = await prisma.formFieldConfig.createMany({
          data: fields.map(field => ({
            ...field,
            stage: stageKey,
            hypothesisLevel: levelKey
          }))
        })

        totalCreated += result.count
      }
    }

    return NextResponse.json({
      message: "Базовая конфигурация полей успешно создана",
      totalCreated
    })

  } catch (error) {
    console.error("Error initializing fields:", error)
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    )
  }
}