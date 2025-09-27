import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const criteria = await request.json()

    // Проверяем, что эксперимент существует
    const experiment = await prisma.experiment.findUnique({
      where: { id },
      select: { id: true }
    })

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 })
    }

    // Удаляем существующие критерии и создаем новые
    await prisma.$transaction(async (tx) => {
      // Удаляем старые критерии
      await tx.experimentSuccessCriteria.deleteMany({
        where: { experimentId: id }
      })

      // Создаем новые критерии
      if (criteria.length > 0) {
        await tx.experimentSuccessCriteria.createMany({
          data: criteria.map((criterion: any) => ({
            experimentId: id,
            name: criterion.name,
            planValue: criterion.planValue,
            actualValue: criterion.actualValue || null,
            unit: criterion.unit || null,
            isAchieved: criterion.isAchieved || null,
            notes: criterion.notes || null,
          }))
        })
      }
    })

    // Возвращаем обновленные критерии
    const updatedCriteria = await prisma.experimentSuccessCriteria.findMany({
      where: { experimentId: id },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json(updatedCriteria)
  } catch (error) {
    console.error("Error updating experiment success criteria:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}