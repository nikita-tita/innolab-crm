import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    // Валидация
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Все поля обязательны" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Пароль должен быть не менее 6 символов" },
        { status: 400 }
      )
    }

    // Проверяем, что роль разрешена для регистрации
    const allowedRoles = [
      "PRODUCT_MANAGER",
      "UX_RESEARCHER",
      "MARKETER",
      "SALES_EXPERT",
      "OPERATIONS_EXPERT",
      "HYPOTHESIS_OWNER",
      "STAKEHOLDER"
    ]

    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: "Недопустимая роль для регистрации" },
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
    const hashedPassword = await bcrypt.hash(password, 12)

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // ✅ Сохраняем хешированный пароль
        role,
        status: "ACTIVE", // Команда активируется сразу
        isActive: true
      }
    })

    // Создаем аккаунт с учетными данными
    await prisma.account.create({
      data: {
        userId: user.id,
        type: "credentials",
        provider: "credentials",
        providerAccountId: user.id,
        access_token: hashedPassword // Сохраняем хешированный пароль
      }
    })

    return NextResponse.json({
      message: "Пользователь успешно зарегистрирован",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    })

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    )
  }
}