import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const experimentId = params.id

    // Get experiment with all related data
    const experiment = await prisma.experiment.findUnique({
      where: { id: experimentId },
      include: {
        hypothesis: {
          include: {
            successCriteria: true,
            idea: {
              select: { title: true }
            }
          }
        },
        results: {
          orderBy: { createdAt: "desc" }
        },
        creator: {
          select: { name: true, email: true }
        }
      }
    })

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 })
    }

    // Generate analysis
    const analysis = generateExperimentAnalysis(experiment)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error generating experiment analysis:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

function generateExperimentAnalysis(experiment: Record<string, any>) {
  const { hypothesis, results } = experiment
  const successCriteria = hypothesis.successCriteria || []

  // Calculate overall success rate
  const criteriaWithResults = successCriteria.map((criteria: Record<string, any>) => {
    const matchingResult = results.find((result: Record<string, any>) =>
      result.metricName.toLowerCase().includes(criteria.name.toLowerCase()) ||
      criteria.name.toLowerCase().includes(result.metricName.toLowerCase())
    )

    const achieved = matchingResult ? matchingResult.value >= criteria.targetValue : false
    const achievement = matchingResult
      ? ((matchingResult.value / criteria.targetValue) * 100)
      : 0

    return {
      ...criteria,
      actualValue: matchingResult?.value || null,
      achieved,
      achievement,
      result: matchingResult
    }
  })

  const achievedCriteria = criteriaWithResults.filter(c => c.achieved)
  const totalCriteria = criteriaWithResults.length
  const successRate = totalCriteria > 0 ? (achievedCriteria.length / totalCriteria) * 100 : 0

  // Determine hypothesis status recommendation
  let recommendedStatus = hypothesis.status
  let statusReason = ""

  if (results.length === 0) {
    recommendedStatus = "IN_EXPERIMENT"
    statusReason = "Нет данных для анализа"
  } else if (successRate >= 80) {
    recommendedStatus = "VALIDATED"
    statusReason = `Большинство критериев успеха достигнуто (${successRate.toFixed(0)}%)`
  } else if (successRate >= 50) {
    recommendedStatus = "IN_EXPERIMENT"
    statusReason = `Частичный успех (${successRate.toFixed(0)}%), требуется дополнительный анализ`
  } else if (totalCriteria > 0 && successRate < 50) {
    recommendedStatus = "INVALIDATED"
    statusReason = `Критерии успеха не достигнуты (${successRate.toFixed(0)}%)`
  }

  // Generate insights and recommendations
  const insights = generateInsights(experiment, criteriaWithResults, successRate)
  const recommendations = generateRecommendations(experiment, criteriaWithResults, successRate)

  // Calculate statistical significance (simplified)
  const statisticalSignificance = calculateStatisticalSignificance(results, successCriteria)

  return {
    experiment: {
      id: experiment.id,
      title: experiment.title,
      status: experiment.status,
      type: experiment.type
    },
    hypothesis: {
      id: hypothesis.id,
      title: hypothesis.title,
      statement: hypothesis.statement,
      currentStatus: hypothesis.status,
      recommendedStatus,
      statusReason
    },
    metrics: {
      totalResults: results.length,
      totalCriteria,
      achievedCriteria: achievedCriteria.length,
      successRate: Math.round(successRate),
      statisticalSignificance
    },
    criteriaAnalysis: criteriaWithResults,
    insights,
    recommendations,
    nextSteps: generateNextSteps(recommendedStatus, successRate, totalCriteria),
    generatedAt: new Date().toISOString()
  }
}

function generateInsights(experiment: Record<string, any>, criteriaWithResults: Record<string, any>[], successRate: number) {
  const insights = []

  // Performance insights
  if (successRate >= 80) {
    insights.push({
      type: "success",
      title: "Отличные результаты!",
      description: `Эксперимент показал отличные результаты с ${successRate.toFixed(0)}% достигнутых критериев успеха.`,
      icon: "🎉"
    })
  } else if (successRate >= 50) {
    insights.push({
      type: "mixed",
      title: "Смешанные результаты",
      description: `Эксперимент показал частичный успех. ${successRate.toFixed(0)}% критериев достигнуто.`,
      icon: "⚖️"
    })
  } else if (successRate > 0) {
    insights.push({
      type: "warning",
      title: "Результаты ниже ожиданий",
      description: `Только ${successRate.toFixed(0)}% критериев успеха достигнуто. Требуется анализ причин.`,
      icon: "⚠️"
    })
  }

  // Individual metric insights
  criteriaWithResults.forEach(criteria => {
    if (criteria.achieved && criteria.achievement > 120) {
      insights.push({
        type: "success",
        title: `Превосходные результаты по "${criteria.name}"`,
        description: `Результат ${criteria.actualValue} ${criteria.unit} превысил цель на ${(criteria.achievement - 100).toFixed(0)}%`,
        icon: "📈"
      })
    } else if (!criteria.achieved && criteria.actualValue) {
      const gap = ((criteria.targetValue - criteria.actualValue) / criteria.targetValue * 100)
      insights.push({
        type: "info",
        title: `Анализ "${criteria.name}"`,
        description: `Результат ${criteria.actualValue} ${criteria.unit} не достиг цели на ${gap.toFixed(0)}%`,
        icon: "📊"
      })
    }
  })

  // Experiment type specific insights
  if (experiment.type === 'AB_TEST') {
    insights.push({
      type: "info",
      title: "A/B тест завершен",
      description: "Рекомендуется провести дополнительный анализ сегментов пользователей",
      icon: "🔬"
    })
  }

  return insights
}

function generateRecommendations(experiment: Record<string, any>, criteriaWithResults: Record<string, any>[], successRate: number) {
  const recommendations = []

  if (successRate >= 80) {
    recommendations.push({
      priority: "high",
      action: "Масштабировать решение",
      description: "Внедрить изменения в продакшн для всех пользователей",
      timeframe: "1-2 недели"
    })
    recommendations.push({
      priority: "medium",
      action: "Мониторить долгосрочные эффекты",
      description: "Отслеживать метрики в течение 1-3 месяцев после внедрения",
      timeframe: "1-3 месяца"
    })
  } else if (successRate >= 50) {
    recommendations.push({
      priority: "high",
      action: "Проанализировать причины частичного успеха",
      description: "Изучить, почему некоторые метрики не достигли целей",
      timeframe: "1 неделя"
    })
    recommendations.push({
      priority: "medium",
      action: "Провести дополнительное исследование",
      description: "Запустить качественное исследование для понимания пользователей",
      timeframe: "2-3 недели"
    })
  } else {
    recommendations.push({
      priority: "high",
      action: "Переосмыслить подход",
      description: "Критически пересмотреть исходную гипотезу и предположения",
      timeframe: "1-2 недели"
    })
    recommendations.push({
      priority: "medium",
      action: "Изучить причины неудачи",
      description: "Провести root cause analysis для понимания проблем",
      timeframe: "1 неделя"
    })
  }

  // Data quality recommendations
  const resultsCount = experiment.results.length
  if (resultsCount < 3) {
    recommendations.push({
      priority: "medium",
      action: "Собрать больше данных",
      description: "Добавить дополнительные метрики для более полного анализа",
      timeframe: "Ongoing"
    })
  }

  return recommendations
}

function generateNextSteps(recommendedStatus: string, successRate: number, totalCriteria: number) {
  const steps = []

  switch (recommendedStatus) {
    case "VALIDATED":
      steps.push("Обновить статус гипотезы на VALIDATED")
      steps.push("Подготовить план внедрения в продакшн")
      steps.push("Создать документацию полученных инсайтов")
      steps.push("Запланировать мониторинг post-launch метрик")
      break

    case "INVALIDATED":
      steps.push("Обновить статус гипотезы на INVALIDATED")
      steps.push("Провести ретроспективу эксперимента")
      steps.push("Сформулировать новые гипотезы на основе полученных данных")
      steps.push("Определить learnings для будущих экспериментов")
      break

    case "IN_EXPERIMENT":
      if (totalCriteria === 0) {
        steps.push("Определить критерии успеха для гипотезы")
        steps.push("Продолжить сбор данных")
      } else {
        steps.push("Собрать дополнительные данные")
        steps.push("Провести углубленный анализ результатов")
        steps.push("Рассмотреть возможность продления эксперимента")
      }
      break

    default:
      steps.push("Завершить сбор данных эксперимента")
      steps.push("Провести полный анализ результатов")
  }

  return steps
}

function calculateStatisticalSignificance(results: Record<string, any>[], successCriteria: Record<string, any>[]) {
  // Simplified statistical significance calculation
  // In real app, you'd use proper statistical methods

  if (results.length < 2) return "insufficient_data"
  if (results.length >= 3 && successCriteria.length > 0) return "significant"
  if (results.length >= 2) return "moderate"

  return "insufficient_data"
}