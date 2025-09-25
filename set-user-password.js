const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function setPassword() {
  const email = 'test@example.com'
  const password = 'test123'

  console.log(`🔐 Устанавливаем пароль для пользователя ${email}...`)

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  })

  console.log(`✅ Пароль установлен!`)
  console.log(`📧 Email: ${email}`)
  console.log(`🔑 Пароль: ${password}`)

  await prisma.$disconnect()
}

setPassword().catch(console.error)