import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Проверяем, что гипотеза существует и находится на уровне 1
    const hypothesis = await prisma.hypothesis.findUnique({
      where: { id },
      include: {
        iceScores: true
      }
    })

    if (!hypothesis) {
      return NextResponse.json(
        { error: "Гипотеза не найдена" },
        { status: 404 }
      )
    }

    if (hypothesis.level !== "LEVEL_1") {
      return NextResponse.json(
        { error: "Переход возможен только для гипотез уровня 1" },
        { status: 400 }
      )
    }

    if (hypothesis.status !== "SCORED") {
      return NextResponse.json(
        { error: "Гипотеза должна быть оценена для перехода на уровень 2" },
        { status: 400 }
      )
    }

    // Проверяем, что есть хотя бы одна ICE оценка
    if (!hypothesis.iceScores || hypothesis.iceScores.length === 0) {
      return NextResponse.json(
        { error: "Необходимы ICE оценки для перехода на уровень 2" },
        { status: 400 }
      )
    }

    // Переводим гипотезу на уровень 2
    const updatedHypothesis = await prisma.hypothesis.update({
      where: { id },
      data: {
        level: "LEVEL_2",
        stage: "DESK_RESEARCH",
        status: "RESEARCH"
      }
    })

    // Создаем запись о переходе
    await prisma.hypothesisTransition.create({
      data: {
        hypothesisId: id,
        fromLevel: "LEVEL_1",
        toLevel: "LEVEL_2",
        fromStage: "FORMULATION",
        toStage: "DESK_RESEARCH",
        userId: session.user.id,
        reason: "Переход на уровень 2 после ICE оценки"
      }
    })

    return NextResponse.json({
      message: "Гипотеза успешно переведена на уровень 2",
      hypothesis: updatedHypothesis
    })

  } catch (error) {
    console.error("Error transitioning hypothesis:", error)
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    )
  }
}