import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Функция для пересчета среднего ICE score идеи
async function updateIdeaIceScore(ideaId: string) {
  const scores = await prisma.iceScore.findMany({
    where: { ideaId },
    select: { impact: true, confidence: true, ease: true }
  })

  if (scores.length === 0) {
    // Если нет оценок, очищаем поля
    await prisma.idea.update({
      where: { id: ideaId },
      data: {
        impact: null,
        confidence: null,
        effort: null, // ease -> effort
        riceScore: null,
        status: "NEW"
      }
    })
    return
  }

  // Вычисляем средние значения
  const avgImpact = Math.round(scores.reduce((sum, s) => sum + s.impact, 0) / scores.length)
  const avgConfidence = Math.round(scores.reduce((sum, s) => sum + s.confidence, 0) / scores.length)
  const avgEase = Math.round(scores.reduce((sum, s) => sum + s.ease, 0) / scores.length)

  // ICE score = Impact × Confidence × Ease
  const iceScore = avgImpact * avgConfidence * avgEase

  await prisma.idea.update({
    where: { id: ideaId },
    data: {
      impact: avgImpact,
      confidence: avgConfidence,
      effort: avgEase, // ease -> effort mapping
      riceScore: iceScore,
      status: "SCORED"
    }
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      )
    }

    const { id } = await params
    const { impact, confidence, ease, comment } = await request.json()

    // Валидация оценок
    if (!impact || !confidence || !ease) {
      return NextResponse.json(
        { error: "Все ICE оценки обязательны" },
        { status: 400 }
      )
    }

    if (impact < 1 || impact > 10 || confidence < 1 || confidence > 10 || ease < 1 || ease > 10) {
      return NextResponse.json(
        { error: "Оценки должны быть от 1 до 10" },
        { status: 400 }
      )
    }

    // Проверяем, что идея существует
    const idea = await prisma.idea.findUnique({
      where: { id }
    })

    if (!idea) {
      return NextResponse.json(
        { error: "Идея не найдена" },
        { status: 404 }
      )
    }

    // Проверяем, не оценивал ли уже пользователь эту идею
    const existingScore = await prisma.iceScore.findFirst({
      where: {
        ideaId: id,
        userId: session.user.id
      }
    })

    if (existingScore) {
      // Обновляем существующую оценку
      const updatedScore = await prisma.iceScore.update({
        where: { id: existingScore.id },
        data: {
          impact,
          confidence,
          ease,
          comment: comment?.trim() || null
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        }
      })

      // Пересчитываем средний ICE score для идеи
      await updateIdeaIceScore(id)

      return NextResponse.json({
        message: "Оценка обновлена",
        score: updatedScore
      })
    } else {
      // Создаем новую оценку
      const newScore = await prisma.iceScore.create({
        data: {
          impact,
          confidence,
          ease,
          comment: comment?.trim() || null,
          ideaId: id,
          userId: session.user.id
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        }
      })

      // Пересчитываем средний ICE score для идеи
      await updateIdeaIceScore(id)

      return NextResponse.json({
        message: "Оценка добавлена",
        score: newScore
      })
    }

  } catch (error) {
    console.error("Error adding ICE score:", error)
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const scores = await prisma.iceScore.findMany({
      where: { ideaId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(scores)
  } catch (error) {
    console.error("Error fetching ICE scores:", error)
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    )
  }
}