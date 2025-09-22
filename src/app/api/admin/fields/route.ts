import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "LAB_DIRECTOR")) {
      return NextResponse.json(
        { error: "Доступ запрещен" },
        { status: 403 }
      )
    }

    const url = new URL(request.url)
    const stage = url.searchParams.get("stage") || "FORMULATION"
    const level = url.searchParams.get("level") || "LEVEL_1"

    const fields = await prisma.formFieldConfig.findMany({
      where: {
        stage,
        hypothesisLevel: level
      },
      orderBy: {
        position: "asc"
      }
    })

    return NextResponse.json(fields)
  } catch (error) {
    console.error("Error fetching fields:", error)
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "LAB_DIRECTOR")) {
      return NextResponse.json(
        { error: "Доступ запрещен" },
        { status: 403 }
      )
    }

    const {
      fieldName,
      label,
      fieldType,
      isRequired,
      isVisible,
      stage,
      hypothesisLevel,
      position,
      validationRules,
      defaultValue,
      options
    } = await request.json()

    // Валидация
    if (!fieldName || !label || !fieldType || !stage || !hypothesisLevel) {
      return NextResponse.json(
        { error: "Обязательные поля не заполнены" },
        { status: 400 }
      )
    }

    // Проверяем, не существует ли уже поле с таким именем для данного этапа и уровня
    const existingField = await prisma.formFieldConfig.findFirst({
      where: {
        fieldName,
        stage,
        hypothesisLevel
      }
    })

    if (existingField) {
      return NextResponse.json(
        { error: "Поле с таким именем уже существует для данного этапа и уровня" },
        { status: 400 }
      )
    }

    // Если позиция не указана, ставим в конец
    let finalPosition = position
    if (!finalPosition) {
      const maxPosition = await prisma.formFieldConfig.findFirst({
        where: { stage, hypothesisLevel },
        orderBy: { position: "desc" }
      })
      finalPosition = (maxPosition?.position || 0) + 1
    }

    const field = await prisma.formFieldConfig.create({
      data: {
        fieldName,
        label,
        fieldType,
        isRequired: isRequired ?? false,
        isVisible: isVisible ?? true,
        stage,
        hypothesisLevel,
        position: finalPosition,
        validationRules,
        defaultValue,
        options
      }
    })

    return NextResponse.json({
      message: "Поле успешно создано",
      field
    })

  } catch (error) {
    console.error("Error creating field:", error)
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    )
  }
}