const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Creating admin user...')

  // Создаем или обновляем админа
  const admin = await prisma.user.upsert({
    where: { email: 'admin@innolab.com' },
    update: {
      role: 'ADMIN',
      status: 'ACTIVE',
      isActive: true
    },
    create: {
      name: 'Администратор',
      email: 'admin@innolab.com',
      role: 'ADMIN',
      status: 'ACTIVE',
      isActive: true
    }
  })

  // Создаем учетные данные для админа
  const hashedPassword = await bcrypt.hash('admin123', 12)

  await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: 'credentials',
        providerAccountId: admin.id
      }
    },
    update: {
      access_token: hashedPassword
    },
    create: {
      userId: admin.id,
      type: 'credentials',
      provider: 'credentials',
      providerAccountId: admin.id,
      access_token: hashedPassword
    }
  })

  console.log('✅ Admin user created!')
  console.log('Email: admin@innolab.com')
  console.log('Password: admin123')

  // Обновляем demo пользователя
  await prisma.user.upsert({
    where: { email: 'demo@innolab.com' },
    update: {
      status: 'ACTIVE',
      isActive: true
    },
    create: {
      name: 'Demo User',
      email: 'demo@innolab.com',
      role: 'PRODUCT_MANAGER',
      status: 'ACTIVE',
      isActive: true
    }
  })

  console.log('✅ Demo user updated!')

  // Создаем тестового наблюдателя
  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@innolab.com' },
    update: {
      role: 'VIEWER',
      status: 'ACTIVE',
      isActive: true
    },
    create: {
      name: 'Тестовый Наблюдатель',
      email: 'viewer@innolab.com',
      role: 'VIEWER',
      status: 'ACTIVE',
      isActive: true
    }
  })

  console.log('✅ Test viewer created!')
  console.log('Email: viewer@innolab.com')
  console.log('(Наблюдатели входят без пароля через админ-панель)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })