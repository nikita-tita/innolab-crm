import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const ideaId = searchParams.get("ideaId")

    if (ideaId) {
      // Get detailed flow for specific idea
      const ideaWithFlow = await prisma.idea.findUnique({
        where: { id: ideaId },
        include: {
          creator: {
            select: { name: true, email: true, role: true }
          },
          hypotheses: {
            include: {
              creator: {
                select: { name: true, email: true }
              },
              experiments: {
                include: {
                  results: true,
                  mvps: {
                    select: {
                      id: true,
                      title: true,
                      status: true,
                      type: true
                    }
                  },
                  creator: {
                    select: { name: true, email: true }
                  }
                }
              },
              successCriteria: true
            }
          },
          comments: {
            include: {
              user: {
                select: { name: true, email: true }
              }
            }
          },
          _count: {
            select: {
              hypotheses: true,
              comments: true
            }
          }
        }
      })

      if (!ideaWithFlow) {
        return NextResponse.json({ error: "Idea not found" }, { status: 404 })
      }

      // Calculate lifecycle metrics
      const metrics = {
        totalHypotheses: ideaWithFlow.hypotheses.length,
        validatedHypotheses: ideaWithFlow.hypotheses.filter(h => h.status === 'VALIDATED').length,
        invalidatedHypotheses: ideaWithFlow.hypotheses.filter(h => h.status === 'INVALIDATED').length,
        activeExperiments: ideaWithFlow.hypotheses.flatMap(h => h.experiments).filter(e => e.status === 'RUNNING').length,
        completedExperiments: ideaWithFlow.hypotheses.flatMap(h => h.experiments).filter(e => e.status === 'COMPLETED').length,
        totalResults: ideaWithFlow.hypotheses.flatMap(h => h.experiments).flatMap(e => e.results).length,
        successRate: ideaWithFlow.hypotheses.length > 0
          ? Math.round((ideaWithFlow.hypotheses.filter(h => h.status === 'VALIDATED').length / ideaWithFlow.hypotheses.length) * 100)
          : 0
      }

      // Determine current stage
      const stages = {
        idea: true,
        hypothesis: ideaWithFlow.hypotheses.length > 0,
        experiment: ideaWithFlow.hypotheses.some(h => h.experiments.length > 0),
        data: ideaWithFlow.hypotheses.some(h => h.experiments.some(e => e.results.length > 0)),
        insight: ideaWithFlow.hypotheses.some(h => h.status === 'VALIDATED' || h.status === 'INVALIDATED')
      }

      // Calculate stage completion percentage
      const stageProgress = Object.values(stages).filter(Boolean).length / 5 * 100

      // Generate next steps recommendations
      const nextSteps = generateNextSteps(ideaWithFlow, stages)

      return NextResponse.json({
        idea: ideaWithFlow,
        metrics,
        stages,
        stageProgress,
        nextSteps
      })
    } else {
      // Get overview of all ideas with their lifecycle status
      const ideas = await prisma.idea.findMany({
        include: {
          creator: {
            select: { name: true, email: true }
          },
          hypotheses: {
            include: {
              experiments: {
                include: {
                  results: true
                }
              }
            }
          },
          _count: {
            select: { hypotheses: true, comments: true }
          }
        },
        orderBy: { createdAt: "desc" }
      })

      // Transform data with lifecycle information
      const ideasWithLifecycle = ideas.map(idea => {
        const stages = {
          idea: true,
          hypothesis: idea.hypotheses.length > 0,
          experiment: idea.hypotheses.some(h => h.experiments.length > 0),
          data: idea.hypotheses.some(h => h.experiments.some(e => e.results.length > 0)),
          insight: idea.hypotheses.some(h => h.status === 'VALIDATED' || h.status === 'INVALIDATED')
        }

        const stageProgress = Object.values(stages).filter(Boolean).length / 5 * 100

        return {
          id: idea.id,
          title: idea.title,
          status: idea.status,
          createdAt: idea.createdAt,
          creator: idea.creator,
          stages,
          stageProgress,
          metrics: {
            hypotheses: idea.hypotheses.length,
            experiments: idea.hypotheses.flatMap(h => h.experiments).length,
            results: idea.hypotheses.flatMap(h => h.experiments).flatMap(e => e.results).length
          }
        }
      })

      return NextResponse.json(ideasWithLifecycle)
    }
  } catch (error) {
    console.error("Error fetching lifecycle data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

function generateNextSteps(idea: any, stages: any) {
  const steps = []

  if (!stages.hypothesis) {
    steps.push({
      priority: "high",
      action: "Создать гипотезу",
      description: "Сформулируйте проверяемое предположение на основе идеи",
      link: `/hypotheses/new?ideaId=${idea.id}`,
      icon: "🔬"
    })
  } else if (idea.hypotheses.some((h: any) => h.status === 'DRAFT')) {
    steps.push({
      priority: "medium",
      action: "Доработать гипотезы",
      description: "Переведите черновики в статус 'Готова к тестированию'",
      link: "/hypotheses",
      icon: "📝"
    })
  }

  if (stages.hypothesis && !stages.experiment && idea.hypotheses.some((h: any) => h.status === 'READY_FOR_TESTING')) {
    steps.push({
      priority: "high",
      action: "Запустить эксперимент",
      description: "Создайте эксперимент для проверки гипотезы",
      link: "/experiments/new",
      icon: "⚗️"
    })
  }

  if (stages.experiment && !stages.data) {
    steps.push({
      priority: "medium",
      action: "Собрать данные",
      description: "Добавьте результаты эксперимента в систему",
      link: "/experiments",
      icon: "📊"
    })
  }

  if (stages.data && !stages.insight) {
    steps.push({
      priority: "high",
      action: "Проанализировать результаты",
      description: "Сделайте выводы и обновите статус гипотез",
      link: "/hypotheses",
      icon: "💎"
    })
  }

  if (stages.insight) {
    const validatedHypotheses = idea.hypotheses.filter((h: any) => h.status === 'VALIDATED')
    if (validatedHypotheses.length > 0) {
      steps.push({
        priority: "low",
        action: "Масштабировать решение",
        description: "Внедрите проверенные гипотезы в продукт",
        link: "/experiments",
        icon: "🚀"
      })
    } else {
      steps.push({
        priority: "medium",
        action: "Итерировать идею",
        description: "Создайте новые гипотезы на основе полученных инсайтов",
        link: `/hypotheses/new?ideaId=${idea.id}`,
        icon: "🔄"
      })
    }
  }

  return steps.slice(0, 3) // Return top 3 priority steps
}