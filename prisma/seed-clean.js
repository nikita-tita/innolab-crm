const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Создание чистых тестовых данных...')

  // 1. Найдем существующего или создадим пользователя
  console.log('👤 Поиск или создание пользователя...')
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Тестовый Пользователь',
      role: 'LAB_DIRECTOR'
    }
  })

  // 2. Создаем идею
  console.log('💡 Создание идеи...')
  const idea = await prisma.idea.create({
    data: {
      title: 'Мобильное приложение для доставки еды',
      description: 'Удобное приложение для заказа еды из ресторанов с быстрой доставкой и отслеживанием заказа в режиме реального времени.',
      category: 'MOBILE_APPS',
      status: 'SELECTED',
      priority: 'HIGH',
      createdBy: user.id,
      // RICE оценки
      reach: 10000,
      impact: 5,
      confidence: 80,
      effort: 30,
      riceScore: 1333.33
    }
  })

  // 3. Создаем гипотезу L1
  console.log('🔬 Создание гипотезы L1...')
  const hypothesis = await prisma.hypothesis.create({
    data: {
      title: 'Пользователи готовы платить за быструю доставку',
      statement: 'Если мы предложим доставку еды за 30 минут, то пользователи будут готовы платить премию 20% за скорость, потому что время - это ценность в современном мире.',
      level: 'LEVEL_1',
      status: 'READY_FOR_TESTING',
      confidenceLevel: 70,
      ideaId: idea.id,
      createdBy: user.id,
      ownerUserId: user.id
    }
  })

  // 4. Создаем критерии успеха для гипотезы
  console.log('🎯 Создание критериев успеха...')
  await prisma.successCriteria.create({
    data: {
      name: 'Время доставки',
      description: 'Средее время доставки не должно превышать 30 минут',
      targetValue: 30,
      unit: 'минут',
      hypothesisId: hypothesis.id
    }
  })

  await prisma.successCriteria.create({
    data: {
      name: 'Готовность доплачивать',
      description: 'Процент пользователей готовых доплачивать за быструю доставку',
      targetValue: 60,
      unit: '%',
      hypothesisId: hypothesis.id
    }
  })

  // 5. Создаем эксперимент
  console.log('⚗️ Создание эксперимента...')
  const experiment = await prisma.experiment.create({
    data: {
      title: 'Лендинг для тестирования спроса на быструю доставку',
      description: 'Создадим лендинг-страницу с предложением быстрой доставки за премию и измерим конверсию в заявки.',
      status: 'PLANNING',
      type: 'LANDING_PAGE',
      methodology: 'Landing Page Test',
      hypothesisId: hypothesis.id,
      createdBy: user.id
    }
  })

  // 6. Создаем MVP для эксперимента
  console.log('📱 Создание MVP...')
  await prisma.mVP.create({
    data: {
      title: 'Лендинг "Доставка за 30 минут"',
      description: 'Простая landing page с формой предзаказа для тестирования спроса',
      type: 'LANDING_PAGE',
      status: 'PLANNING',
      url: 'https://fast-delivery-test.vercel.app',
      experimentId: experiment.id,
      createdBy: user.id
    }
  })

  // 7. Создаем активность
  console.log('📋 Создание записи активности...')
  await prisma.activity.create({
    data: {
      type: 'CREATED',
      description: `Создана идея: ${idea.title}`,
      entityType: 'IDEA',
      entityId: idea.id,
      userId: user.id
    }
  })

  await prisma.activity.create({
    data: {
      type: 'CREATED',
      description: `Создана гипотеза: ${hypothesis.title}`,
      entityType: 'HYPOTHESIS',
      entityId: hypothesis.id,
      userId: user.id
    }
  })

  await prisma.activity.create({
    data: {
      type: 'CREATED',
      description: `Создан эксперимент: ${experiment.title}`,
      entityType: 'EXPERIMENT',
      entityId: experiment.id,
      userId: user.id
    }
  })

  console.log('✅ Seed данные успешно созданы!')
  console.log(`📊 Создано:
  - 1 пользователь (${user.email})
  - 1 идея (${idea.title})
  - 1 гипотеза L1 (${hypothesis.title})
  - 2 критерия успеха
  - 1 эксперимент (${experiment.title})
  - 1 MVP
  - 3 записи активности`)
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при создании seed данных:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })