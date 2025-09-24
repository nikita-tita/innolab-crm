const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function cleanupAndInitialize() {
  console.log('🧹 Начинаем очистку базы данных...')

  try {
    // Удаляем все данные в правильном порядке (только основные сущности)
    console.log('📝 Удаляем комментарии...')
    await prisma.comment.deleteMany({}).catch(() => console.log('  Таблица комментариев не найдена'))

    console.log('🔬 Удаляем гипотезы...')
    await prisma.hypothesis.deleteMany({}).catch(() => console.log('  Таблица гипотез не найдена'))

    console.log('📊 Удаляем активности...')
    await prisma.activity.deleteMany({}).catch(() => console.log('  Таблица активности не найдена'))

    console.log('💡 Удаляем идеи...')
    await prisma.idea.deleteMany({}).catch(() => console.log('  Таблица идей не найдена'))

    console.log('🔐 Удаляем сессии и аккаунты...')
    await prisma.session.deleteMany({}).catch(() => console.log('  Таблица сессий не найдена'))
    await prisma.account.deleteMany({}).catch(() => console.log('  Таблица аккаунтов не найдена'))

    console.log('👥 Удаляем всех пользователей...')
    await prisma.user.deleteMany({}).catch(() => console.log('  Таблица пользователей не найдена'))

    console.log('✅ Очистка завершена!')

    // Создаем главного администратора
    console.log('👑 Создаем главного администратора...')

    const hashedPassword = await bcrypt.hash('admin2024', 12)

    const admin = await prisma.user.upsert({
      where: { email: 'admin@innolab.com' },
      update: {
        name: 'Главный Администратор',
        role: 'ADMIN',
        status: 'ACTIVE',
        isActive: true,
        password: hashedPassword
      },
      create: {
        email: 'admin@innolab.com',
        name: 'Главный Администратор',
        role: 'ADMIN',
        status: 'ACTIVE',
        isActive: true,
        password: hashedPassword
      }
    })

    console.log('✅ Администратор создан:', admin.email)

    // Инициализируем базовые поля форм
    console.log('⚙️ Инициализируем базовые поля форм...')

    const basicFields = [
      // Поля для уровня 1 - формулирование
      {
        fieldName: 'actionDescription',
        label: 'Если мы сделаем...',
        fieldType: 'TEXTAREA',
        isRequired: true,
        isVisible: true,
        stage: 'DRAFT',
        level: 'LEVEL_1',
        order: 1
      },
      {
        fieldName: 'expectedResult',
        label: 'То произойдёт...',
        fieldType: 'TEXTAREA',
        isRequired: true,
        isVisible: true,
        stage: 'DRAFT',
        level: 'LEVEL_1',
        order: 2
      },
      {
        fieldName: 'reasoning',
        label: 'Потому что...',
        fieldType: 'TEXTAREA',
        isRequired: true,
        isVisible: true,
        stage: 'DRAFT',
        level: 'LEVEL_1',
        order: 3
      }
    ]

    for (const field of basicFields) {
      await prisma.formFieldConfig.create({ data: field })
    }

    console.log('✅ Базовые поля созданы!')

    console.log('')
    console.log('🎉 Инициализация завершена!')
    console.log('📧 Email администратора: admin@innolab.com')
    console.log('🔑 Пароль: admin2024')
    console.log('')
    console.log('🚀 Система готова к работе!')

  } catch (error) {
    console.error('❌ Ошибка при очистке и инициализации:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем только если скрипт вызван напрямую
if (require.main === module) {
  cleanupAndInitialize().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}

module.exports = { cleanupAndInitialize }