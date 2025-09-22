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
    const { status, role, isActive } = await request.json()

    const updateData: any = {}

    if (status !== undefined) {
      updateData.status = status
    }

    if (role !== undefined) {
      updateData.role = role
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      message: "Пользователь успешно обновлен",
      user
    })
  } catch (error) {
    console.error("Error updating user:", error)
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
        { error: "Доступ запрещен. Только администраторы могут удалять пользователей" },
        { status: 403 }
      )
    }

    const { id } = await params

    // Проверяем, что пользователь не пытается удалить сам себя
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "Нельзя удалить самого себя" },
        { status: 400 }
      )
    }

    // Удаляем пользователя
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({
      message: "Пользователь успешно удален"
    })

  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    )
  }
}