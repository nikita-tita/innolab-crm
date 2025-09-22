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
    const { toStage, data } = await request.json()

    // Проверяем, что гипотеза существует
    const hypothesis = await prisma.hypothesis.findUnique({
      where: { id }
    })

    if (!hypothesis) {
      return NextResponse.json(
        { error: "Гипотеза не найдена" },
        { status: 404 }
      )
    }

    if (hypothesis.level !== "LEVEL_2") {
      return NextResponse.json(
        { error: "Переходы между этапами возможны только для гипотез уровня 2" },
        { status: 400 }
      )
    }

    // Определяем валидные переходы
    const validTransitions = {
      "DESK_RESEARCH": "EXPERIMENT_DESIGN",
      "EXPERIMENT_DESIGN": "EXPERIMENT_EXECUTION",
      "EXPERIMENT_EXECUTION": "CONCLUSION"
    }

    if (validTransitions[hypothesis.stage as keyof typeof validTransitions] !== toStage) {
      return NextResponse.json(
        { error: "Некорректный переход между этапами" },
        { status: 400 }
      )
    }

    // Определяем новый статус
    const statusMap = {
      "EXPERIMENT_DESIGN": "EXPERIMENT_DESIGN",
      "EXPERIMENT_EXECUTION": "IN_EXPERIMENT",
      "CONCLUSION": "COMPLETED"
    }

    const newStatus = statusMap[toStage as keyof typeof statusMap] || hypothesis.status

    // Обновляем гипотезу с новыми данными
    const updateData: any = {
      stage: toStage,
      status: newStatus
    }

    // Добавляем данные в зависимости от этапа
    if (data) {
      Object.assign(updateData, data)
    }

    const updatedHypothesis = await prisma.hypothesis.update({
      where: { id },
      data: updateData
    })

    // Создаем запись о переходе
    await prisma.hypothesisTransition.create({
      data: {
        hypothesisId: id,
        fromLevel: "LEVEL_2",
        toLevel: "LEVEL_2",
        fromStage: hypothesis.stage,
        toStage: toStage,
        userId: session.user.id,
        reason: `Переход на этап ${toStage}`
      }
    })

    return NextResponse.json({
      message: `Гипотеза успешно переведена на этап ${toStage}`,
      hypothesis: updatedHypothesis
    })

  } catch (error) {
    console.error("Error transitioning hypothesis stage:", error)
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    )
  }
}