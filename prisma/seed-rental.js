const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🏠 Создание новых данных по проекту "Аренда без депозита"...')

  // 1. Создаем тестового пользователя
  console.log('👤 Создание пользователя...')
  const hashedPassword = await bcrypt.hash('test123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: { password: hashedPassword },
    create: {
      email: 'test@example.com',
      name: 'Продуктовый Менеджер',
      role: 'LAB_DIRECTOR',
      password: hashedPassword
    }
  })

  // 2. Создаем идею: Аренда без депозита
  console.log('💡 Создание идеи "Аренда без депозита"...')
  const idea = await prisma.idea.create({
    data: {
      title: 'Аренда квартир без депозита со страхованием',
      description: 'Снять квартиру без депозита, но с гарантией для арендодателя через страховой продукт. Агентам удобно продавать как "услугу в один клик" вместе с договором аренды.',
      category: 'FINTECH_INSURANCE',
      status: 'SELECTED',
      priority: 'HIGH',
      context: 'Жалобы агентов + аналогичные кейсы в США и Европе (InsurRent, Rhino)',
      createdBy: user.id,
      // RICE оценки (ICE в данном случае)
      reach: 100000, // количество потенциальных арендаторов
      impact: 7, // высокое влияние на рынок
      confidence: 40, // низкая уверенность (4 из 10)
      effort: 90, // высокая сложность (3 из 10 = низкая простота)
      riceScore: 311.11 // (100000 * 7 * 40) / 90
    }
  })

  // 3. Создаем гипотезу L1 (черновик)
  console.log('🔬 Создание гипотезы L1...')
  const hypothesisL1 = await prisma.hypothesis.create({
    data: {
      title: 'Агенты будут предлагать аренду без депозита',
      statement: 'Если предложить агенту инструмент "аренда без депозита со страхованием", то он будет предлагать его арендаторам, потому что это снижает трение на сделке и помогает быстрее закрывать клиентов.',
      level: 'LEVEL_1',
      status: 'RESEARCH',
      confidenceLevel: 40,
      ideaId: idea.id,
      createdBy: user.id,
      ownerUserId: user.id,
      // ICE оценка
      reach: 10000,
      impact: 7,
      confidence: 40,
      effort: 30
    }
  })

  // 4. Создаем критерии успеха для L1
  console.log('🎯 Создание критериев успеха для L1...')
  await prisma.successCriteria.create({
    data: {
      name: 'Интерес агентов',
      description: 'Количество агентов, которые выразили интерес на питчинге идеи',
      targetValue: 20,
      unit: 'агентов',
      hypothesisId: hypothesisL1.id
    }
  })

  await prisma.successCriteria.create({
    data: {
      name: 'Готовность использовать',
      description: 'Количество сделок, где агенты готовы "теоретически" использовать продукт',
      targetValue: 50,
      unit: 'сделок',
      hypothesisId: hypothesisL1.id
    }
  })

  // 5. Создаем гипотезу L2 (после desk research)
  console.log('📚 Создание гипотезы L2...')
  const hypothesisL2 = await prisma.hypothesis.create({
    data: {
      title: 'Страховой продукт с комиссией 2-3 тыс руб',
      statement: 'Если предложить агентам страховой продукт вместо депозита с комиссией 2–3 тыс. руб. за сделку, то не менее 20% агентов начнут активно предлагать его клиентам, потому что арендаторы смогут избежать депозита ~50 тыс. руб., агенты получат дополнительный доход без увеличения сложности сделки, арендодатель будет защищён.',
      level: 'LEVEL_2',
      status: 'READY_FOR_TESTING',
      confidenceLevel: 60,
      ideaId: idea.id,
      createdBy: user.id,
      ownerUserId: user.id,
      deskResearchNotes: 'Объем рынка депозитов: около 1 трлн ₽ замороженных денег в год (по данным ЦИАН, 70% сделок аренды — с депозитом). Зарубежные аналоги показывают adoption rate 20–30%. Первичные интервью с агентами (5 интервью) → 4/5 говорят, что готовы предлагать.',
      deskResearchSources: 'ЦИАН, InsurRent (США), Rhino (США), интервью с 5 агентами',
      reach: 50000,
      impact: 8,
      confidence: 60,
      effort: 60
    }
  })

  // 6. Создаем критерии успеха для L2
  console.log('🎯 Создание критериев успеха для L2...')
  await prisma.successCriteria.create({
    data: {
      name: 'Adoption rate агентов',
      description: '20% агентов готовы использовать инструмент в реальных сделках',
      targetValue: 20,
      unit: '%',
      hypothesisId: hypothesisL2.id
    }
  })

  await prisma.successCriteria.create({
    data: {
      name: 'Конверсия арендаторов',
      description: 'Арендаторы не отказываются (конверсия в тестовом лендинге не ниже 10%)',
      targetValue: 10,
      unit: '%',
      hypothesisId: hypothesisL2.id
    }
  })

  // 7. Создаем эксперимент
  console.log('⚗️ Создание эксперимента...')
  const experiment = await prisma.experiment.create({
    data: {
      title: 'Фейкдор "Аренда без депозита"',
      description: 'Сделать лендинг "Аренда без депозита" с описанием продукта. Прогнать 200 арендных лидов через агентов и рекламу. Агенты получают скрипт: "Вы можете снять эту квартиру без депозита, мы подключаем страховку".',
      status: 'PLANNING',
      type: 'LANDING_PAGE',
      methodology: 'Фейкдор + лендинг + скрипт для агентов',
      timeline: '2 недели',
      resources: 'Маркетолог (Паша) для трафика, UX-ресерчер (Ксюша) для теста скриптов, продажи (Оля) для включения в звонки, мидл-офис (Света) для имитации консьерж-сервиса',
      successMetrics: '≥10% арендаторов кликают "хочу без депозита", ≥20% агентов предлагают продукт, не менее 5 успешных сделок с фейкдором',
      hypothesisId: hypothesisL2.id,
      createdBy: user.id
    }
  })

  // 8. Создаем MVP для эксперимента
  console.log('📱 Создание MVP...')
  const mvp = await prisma.mVP.create({
    data: {
      title: 'Лендинг "Аренда без депозита"',
      description: 'Фейкдор лендинг с описанием продукта, формой заявки и калькулятором экономии для арендаторов',
      type: 'LANDING_PAGE',
      status: 'PLANNING',
      url: 'https://rental-no-deposit.vercel.app',
      experimentId: experiment.id,
      createdBy: user.id
    }
  })

  // 9. Создаем дополнительный MVP - скрипт для агентов
  console.log('📋 Создание скрипта для агентов...')
  await prisma.mVP.create({
    data: {
      title: 'Скрипт для агентов',
      description: 'Готовый скрипт для агентов: "Вы можете снять эту квартиру без депозита, мы подключаем страховку. Вместо 50 тыс руб депозита вы платите всего 2500 руб страховой премии"',
      type: 'OTHER',
      status: 'PLANNING',
      experimentId: experiment.id,
      createdBy: user.id
    }
  })

  // 10. Создаем записи активности
  console.log('📋 Создание записей активности...')
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
      description: `Создана гипотеза L1: ${hypothesisL1.title}`,
      entityType: 'HYPOTHESIS',
      entityId: hypothesisL1.id,
      userId: user.id
    }
  })

  await prisma.activity.create({
    data: {
      type: 'CREATED',
      description: `Создана гипотеза L2 после desk research: ${hypothesisL2.title}`,
      entityType: 'HYPOTHESIS',
      entityId: hypothesisL2.id,
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

  console.log('✅ Новые seed данные успешно созданы!')
  console.log(`📊 Создано:
  - 1 пользователь (${user.email})
  - 1 идея: ${idea.title}
  - 2 гипотезы: L1 и L2 после desk research
  - 4 критерия успеха
  - 1 эксперимент: ${experiment.title}
  - 2 MVP: лендинг и скрипт
  - 4 записи активности

🏠 Тематика: Решение проблемы депозитов в аренде недвижимости через страхование`)
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при создании seed данных:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })