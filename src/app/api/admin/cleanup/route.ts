import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { initializeTeam } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Доступ запрещен. Только администраторы могут очищать данные" },
        { status: 403 }
      )
    }

    const { confirmPassword } = await request.json()

    // Простая проверка пароля для безопасности
    if (confirmPassword !== "delete-all-data-2024") {
      return NextResponse.json(
        { error: "Неверный пароль подтверждения" },
        { status: 400 }
      )
    }

    // Начинаем транзакцию для очистки данных
    await prisma.$transaction(async (tx) => {
      // Удаляем данные в правильном порядке (учитывая зависимости)

      // 1. Удаляем переходы гипотез
      await tx.hypothesisTransition.deleteMany({})

      // 2. Удаляем ICE оценки
      await tx.iceScore.deleteMany({})

      // 3. Удаляем артефакты
      await tx.artifact.deleteMany({})

      // 4. Удаляем лабораторные ресурсы
      await tx.labInventory.deleteMany({})

      // 5. Удаляем конфигурацию полей
      await tx.formFieldConfig.deleteMany({})

      // 6. Удаляем эксперименты
      await tx.experiment.deleteMany({})

      // 7. Удаляем гипотезы
      await tx.hypothesis.deleteMany({})

      // 8. Удаляем идеи
      await tx.idea.deleteMany({})

      // 9. Удаляем всех пользователей кроме админа
      await tx.user.deleteMany({
        where: {
          role: {
            not: "ADMIN"
          }
        }
      })

      // 10. Удаляем сессии и аккаунты
      await tx.session.deleteMany({})
      await tx.account.deleteMany({})
    })

    // Инициализируем команду заново
    await initializeTeam()

    return NextResponse.json({
      message: "Все данные успешно очищены. Команда заново инициализирована.",
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("Error during cleanup:", error)
    return NextResponse.json(
      { error: "Ошибка при очистке данных" },
      { status: 500 }
    )
  }
}