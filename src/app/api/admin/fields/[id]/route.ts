import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "LAB_DIRECTOR")) {
      return NextResponse.json(
        { error: "Доступ запрещен" },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const {
      label,
      fieldType,
      isRequired,
      isVisible,
      position,
      validationRules,
      defaultValue,
      options
    } = body

    // Валидация входных данных
    const updateData: any = {}

    if (label !== undefined) updateData.label = label
    if (fieldType !== undefined) updateData.fieldType = fieldType
    if (isRequired !== undefined) updateData.isRequired = isRequired
    if (isVisible !== undefined) updateData.isVisible = isVisible
    if (position !== undefined) updateData.position = position
    if (validationRules !== undefined) updateData.validationRules = validationRules
    if (defaultValue !== undefined) updateData.defaultValue = defaultValue
    if (options !== undefined) updateData.options = options

    // Обновляем поле
    const field = await prisma.formFieldConfig.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      message: "Поле успешно обновлено",
      field
    })

  } catch (error) {
    console.error("Error updating field:", error)
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Доступ запрещен. Только администраторы могут удалять поля" },
        { status: 403 }
      )
    }

    const { id } = await params

    // Удаляем поле
    await prisma.formFieldConfig.delete({
      where: { id }
    })

    return NextResponse.json({
      message: "Поле успешно удалено"
    })

  } catch (error) {
    console.error("Error deleting field:", error)
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    )
  }
}