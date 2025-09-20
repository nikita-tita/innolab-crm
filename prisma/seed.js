/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Начало заполнения базы данных...')

  // Создание пользователей
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'demo@innolab.com' },
      update: {},
      create: {
        email: 'demo@innolab.com',
        name: 'Demo User',
        role: 'PRODUCT_MANAGER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'product@example.com' },
      update: {},
      create: {
        email: 'product@example.com',
        name: 'Анна Продактова',
        role: 'PRODUCT_MANAGER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'designer@example.com' },
      update: {},
      create: {
        email: 'designer@example.com',
        name: 'Михаил Дизайнеров',
        role: 'DESIGNER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'analyst@example.com' },
      update: {},
      create: {
        email: 'analyst@example.com',
        name: 'Елена Аналитикова',
        role: 'ANALYST',
      },
    }),
  ])

  console.log('Пользователи созданы:', users.length)

  // Создание идей
  const ideas = await Promise.all([
    prisma.idea.create({
      data: {
        title: 'Мобильное приложение для клиентов',
        description: 'Разработать мобильное приложение для улучшения клиентского опыта',
        category: 'Мобильная разработка',
        priority: 'HIGH',
        status: 'SELECTED',
        createdBy: users[0].id,
      },
    }),
    prisma.idea.create({
      data: {
        title: 'Персонализация контента',
        description: 'Система рекомендаций на основе поведения пользователей',
        category: 'Персонализация',
        priority: 'MEDIUM',
        status: 'SCORED',
        createdBy: users[1].id,
      },
    }),
    prisma.idea.create({
      data: {
        title: 'Чат-бот поддержки',
        description: 'Автоматизированная система поддержки клиентов',
        category: 'Автоматизация',
        priority: 'MEDIUM',
        status: 'NEW',
        createdBy: users[2].id,
      },
    }),
  ])

  console.log('Идеи созданы:', ideas.length)

  // Создание гипотез
  const hypotheses = await Promise.all([
    prisma.hypothesis.create({
      data: {
        title: 'Мобильное приложение увеличит удержание',
        description: 'Пользователи с мобильным приложением остаются активными дольше',
        statement: 'Если мы запустим мобильное приложение, то удержание пользователей увеличится на 25%',
        status: 'IN_EXPERIMENT',
        priority: 'HIGH',
        confidenceLevel: 80,
        testingMethod: 'A/B тестирование',
        successCriteriaText: 'Удержание пользователей увеличивается на 25% через 30 дней',
        ideaId: ideas[0].id,
        createdBy: users[0].id,
      },
    }),
    prisma.hypothesis.create({
      data: {
        title: 'Персонализация повысит конверсию',
        description: 'Персональные рекомендации увеличат покупки',
        statement: 'Если мы добавим персональные рекомендации, то конверсия увеличится на 15%',
        status: 'READY_FOR_TESTING',
        priority: 'MEDIUM',
        confidenceLevel: 70,
        testingMethod: 'Многовариантное тестирование',
        successCriteriaText: 'Конверсия увеличивается на 15% в течение 2 недель',
        ideaId: ideas[1].id,
        createdBy: users[1].id,
      },
    }),
    prisma.hypothesis.create({
      data: {
        title: 'Чат-бот сократит время отклика',
        description: 'Автоматические ответы ускорят поддержку',
        statement: 'Если мы внедрим чат-бот, то время отклика сократится на 60%',
        status: 'DRAFT',
        priority: 'MEDIUM',
        confidenceLevel: 65,
        testingMethod: 'Пилотное внедрение',
        successCriteriaText: 'Время отклика сокращается до 30 секунд',
        ideaId: ideas[2].id,
        createdBy: users[3].id,
      },
    }),
  ])

  console.log('Гипотезы созданы:', hypotheses.length)

  // Создание экспериментов
  const experiments = await Promise.all([
    prisma.experiment.create({
      data: {
        title: 'A/B тест мобильного приложения',
        description: 'Тестирование бета-версии приложения с частью пользователей',
        type: 'AB_TEST',
        status: 'RUNNING',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-02-15'),
        methodology: 'Случайное разделение пользователей на группы A и B',
        timeline: '30 дней тестирования',
        resources: 'Команда разработки, 1000 тестовых пользователей',
        successMetrics: 'Удержание, активность, отзывы пользователей',
        hypothesisId: hypotheses[0].id,
        createdBy: users[0].id,
      },
    }),
    prisma.experiment.create({
      data: {
        title: 'Тест персональных рекомендаций',
        description: 'Внедрение системы рекомендаций для части пользователей',
        type: 'AB_TEST',
        status: 'PLANNING',
        methodology: 'Машинное обучение на основе поведения пользователей',
        timeline: '2 недели подготовки, 3 недели тестирования',
        resources: 'Команда ML, аналитики, сегмент пользователей',
        successMetrics: 'Конверсия, время на сайте, повторные покупки',
        hypothesisId: hypotheses[1].id,
        createdBy: users[1].id,
      },
    }),
  ])

  console.log('Эксперименты созданы:', experiments.length)

  // Создание критериев успеха для гипотез
  const successCriteria = await Promise.all([
    // Для первой гипотезы (мобильное приложение)
    prisma.successCriteria.create({
      data: {
        name: 'Удержание пользователей',
        description: 'Увеличение удержания через 30 дней',
        targetValue: 25,
        unit: '%',
        hypothesisId: hypotheses[0].id,
      },
    }),
    prisma.successCriteria.create({
      data: {
        name: 'Активность пользователей',
        description: 'Увеличение DAU (Daily Active Users)',
        targetValue: 30,
        unit: '%',
        hypothesisId: hypotheses[0].id,
      },
    }),
    // Для второй гипотезы (персонализация)
    prisma.successCriteria.create({
      data: {
        name: 'Конверсия',
        description: 'Увеличение конверсии в покупку',
        targetValue: 15,
        unit: '%',
        hypothesisId: hypotheses[1].id,
      },
    }),
    prisma.successCriteria.create({
      data: {
        name: 'Время на сайте',
        description: 'Увеличение времени пребывания на сайте',
        targetValue: 20,
        unit: '%',
        hypothesisId: hypotheses[1].id,
      },
    }),
  ])

  console.log('Критерии успеха созданы:', successCriteria.length)

  // Создание результатов экспериментов
  const experimentResults = await Promise.all([
    // Результаты для A/B теста мобильного приложения
    prisma.experimentResult.create({
      data: {
        metricName: 'Удержание пользователей',
        value: 28.5,
        unit: '%',
        notes: 'Превысили ожидания! Особенно хорошие результаты у пользователей 25-35 лет',
        experimentId: experiments[0].id,
      },
    }),
    prisma.experimentResult.create({
      data: {
        metricName: 'Активность пользователей (DAU)',
        value: 35.2,
        unit: '%',
        notes: 'Увеличение активности благодаря push-уведомлениям',
        experimentId: experiments[0].id,
      },
    }),
    prisma.experimentResult.create({
      data: {
        metricName: 'NPS (Net Promoter Score)',
        value: 67,
        unit: 'баллы',
        notes: 'Пользователи особенно отмечают удобство интерфейса',
        experimentId: experiments[0].id,
      },
    }),
    // Результаты для теста персонализации (пока частичные)
    prisma.experimentResult.create({
      data: {
        metricName: 'Конверсия',
        value: 12.3,
        unit: '%',
        notes: 'Результат пока ниже ожидаемого, но эксперимент еще идет',
        experimentId: experiments[1].id,
      },
    }),
  ])

  console.log('Результаты экспериментов созданы:', experimentResults.length)

  // Создание MVP
  const mvps = await Promise.all([
    // MVP для первого эксперимента (мобильное приложение)
    prisma.mVP.create({
      data: {
        title: 'Beta-версия мобильного приложения',
        description: 'Простая версия мобильного приложения с основными функциями для тестирования гипотезы об увеличении удержания пользователей',
        type: 'PROTOTYPE',
        status: 'DEVELOPMENT',
        features: 'Авторизация, основной экран, push-уведомления, базовый профиль пользователя',
        technicalSpecs: 'React Native, Firebase для push-уведомлений, REST API интеграция',
        resources: 'Frontend разработчик, дизайнер UI/UX, QA инженер',
        timeline: '3 недели разработки, 1 неделя тестирования',
        successCriteria: 'Установка и активация приложения минимум 100 пользователями, удержание 25%+',
        experimentId: experiments[0].id,
        createdBy: users[0].id,
      },
    }),
    // MVP для второго эксперимента (персонализация)
    prisma.mVP.create({
      data: {
        title: 'Система персональных рекомендаций',
        description: 'MVP системы рекомендаций на основе поведения пользователей для проверки влияния на конверсию',
        type: 'DEMO',
        status: 'TESTING',
        features: 'Алгоритм collaborative filtering, виджет рекомендаций, A/B тестирование показов',
        technicalSpecs: 'Python ML модель, Redis для кеширования, интеграция с основным сайтом',
        resources: 'ML инженер, Backend разработчик, аналитик данных',
        timeline: '2 недели разработки, 3 недели тестирования',
        successCriteria: 'Увеличение конверсии на 15%, улучшение времени на сайте на 20%',
        experimentId: experiments[1].id,
        createdBy: users[1].id,
      },
    }),
    // Дополнительный MVP в планировании
    prisma.mVP.create({
      data: {
        title: 'Landing page для чат-бота',
        description: 'Простая посадочная страница для демонстрации возможностей чат-бота поддержки',
        type: 'LANDING_PAGE',
        status: 'PLANNING',
        features: 'Интерактивное демо чат-бота, форма обратной связи, описание возможностей',
        technicalSpecs: 'HTML/CSS/JS, встроенный чат виджет, форма с email уведомлениями',
        resources: 'Frontend разработчик, копирайтер, дизайнер',
        timeline: '1 неделя разработки, 2 недели сбора обратной связи',
        successCriteria: 'Минимум 50 заявок на тестирование, 70%+ положительных отзывов',
        experimentId: experiments[0].id, // Привязываем к первому эксперименту для демо
        createdBy: users[2].id,
      },
    }),
  ])

  console.log('MVP созданы:', mvps.length)

  // Создание активностей
  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        type: 'CREATED',
        description: 'demo@innolab.com создал(а) идею "Мобильное приложение для клиентов"',
        entityType: 'idea',
        entityId: ideas[0].id,
        userId: users[0].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'CREATED',
        description: 'product@example.com создал(а) гипотезу "Мобильное приложение увеличит удержание"',
        entityType: 'hypothesis',
        entityId: hypotheses[0].id,
        userId: users[1].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'EXPERIMENT_STARTED',
        description: 'demo@innolab.com запустил(а) эксперимент "A/B тест мобильного приложения"',
        entityType: 'experiment',
        entityId: experiments[0].id,
        userId: users[0].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'STATUS_CHANGED',
        description: 'product@example.com изменил(а) статус гипотезы "Персонализация повысит конверсию"',
        entityType: 'hypothesis',
        entityId: hypotheses[1].id,
        userId: users[1].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'COMMENT_ADDED',
        description: 'analyst@example.com добавил(а) комментарий к идее "Чат-бот поддержки"',
        entityType: 'idea',
        entityId: ideas[2].id,
        userId: users[3].id,
      },
    }),
  ])

  console.log('Активности созданы:', activities.length)

  console.log('База данных успешно заполнена!')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})


