import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "LAB_DIRECTOR")) {
      return NextResponse.json(
        { error: "Доступ запрещен" },
        { status: 403 }
      )
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
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

    const { name, email, role, password } = await request.json()

    // Валидация
    if (!name || !email || !role || !password) {
      return NextResponse.json(
        { error: "Все поля обязательны" },
        { status: 400 }
      )
    }

    // Проверяем допустимые роли
    const allowedRoles = ["LAB_DIRECTOR", "PRODUCT_MANAGER", "UX_RESEARCHER", "MARKETER", "SALES_EXPERT", "OPERATIONS_EXPERT", "HYPOTHESIS_OWNER", "VIEWER", "STAKEHOLDER", "ADMIN"]
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: "Недопустимая роль" },
        { status: 400 }
      )
    }

    // Проверяем длину пароля
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Пароль должен содержать минимум 6 символов" },
        { status: 400 }
      )
    }

    // Проверяем, не существует ли уже пользователь с таким email
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 400 }
      )
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10)

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
        status: "ACTIVE",
        isActive: true
      }
    })

    return NextResponse.json({
      message: "Пользователь успешно создан",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    })

  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    )
  }
}