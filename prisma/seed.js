/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Ensure demo user exists
  const demo = await prisma.user.upsert({
    where: { email: 'demo@innolab.com' },
    update: {},
    create: {
      email: 'demo@innolab.com',
      name: 'Demo User',
      role: 'PRODUCT_MANAGER',
    }
  })

  console.log('Seed completed. Demo user id:', demo.id)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})


