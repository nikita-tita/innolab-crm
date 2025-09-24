/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Начало заполнения базы данных...')

  // Создание только одного пользователя-админа
  const admin = await prisma.user.upsert({
    where: { email: 'admin@inlab.com' },
    update: {},
    create: {
      email: 'admin@inlab.com',
      name: 'Главный Администратор',
      role: 'ADMIN',
      status: 'ACTIVE',
      isActive: true,
    },
  })

  console.log('✅ Пользователь создан:', admin.email)

  // Создание одной тестовой идеи
  const testIdea = await prisma.idea.create({
    data: {
      title: '[ТЕСТ] Улучшение пользовательского опыта в личном кабинете',
      description: 'Тестовая идея для демонстрации полного цикла инноваций: от идеи через гипотезы к экспериментам и результатам. Идея заключается в редизайне интерфейса личного кабинета клиентов М2 для повышения удовлетворенности и снижения количества обращений в поддержку.',
      category: 'UX/UI',
      priority: 'HIGH',
      status: 'SELECTED',
      reach: 5000,     // 5000 пользователей личного кабинета
      impact: 4,       // Высокое влияние на опыт (1-5)
      confidence: 80,  // 80% уверенности
      effort: 30,      // 30 человеко-дней
      riceScore: 533.33, // (5000 * 4 * 0.80) / 30
      context: 'На основе анализа обращений в поддержку выявлено, что 60% проблем связаны с навигацией в личном кабинете',
      createdBy: admin.id,
    },
  })

  console.log('✅ Тестовая идея создана')

  // Создание тестовых гипотез для главной идеи
  const testHypothesisL1 = await prisma.hypothesis.create({
    data: {
      title: '[ТЕСТ] Гипотеза L1: Новый интерфейс снизит количество обращений',
      description: 'Базовая гипотеза первого уровня о влиянии улучшенного интерфейса на количество обращений в поддержку',
      statement: 'Если мы улучшим навигацию и UX личного кабинета, то количество обращений в поддержку снизится на 30%, потому что пользователи смогут самостоятельно найти нужную информацию',
      status: 'RESEARCH',
      level: 'LEVEL_1',
      priority: 'HIGH',
      confidenceLevel: 80,
      testingMethod: 'A/B тестирование нового интерфейса',
      successCriteriaText: 'Снижение количества тикетов поддержки на 30% за 30 дней',

      // Детали формулировки
      actionDescription: 'улучшим навигацию и UX личного кабинета (добавим поиск, улучшим меню, оптимизируем мобильную версию)',
      expectedResult: 'количество обращений в поддержку снизится на 30%',
      reasoning: 'пользователи смогут самостоятельно найти нужную информацию без обращения в службу поддержки',

      // RICE для гипотезы
      reach: 5000,
      impact: 4,
      confidence: 80,
      effort: 20, // Меньше, чем вся идея
      riceScore: 800, // (5000 * 4 * 0.80) / 20

      ideaId: testIdea.id,
      createdBy: admin.id,
    },
  })

  const testHypothesisL2 = await prisma.hypothesis.create({
    data: {
      title: '[ТЕСТ] Гипотеза L2: Конкретные UX-улучшения повысят NPS',
      description: 'Детализированная гипотеза второго уровня после проведения desk research',
      statement: 'Если мы внедрим поиск по FAQ, упростим процесс смены тарифа и добавим прогресс-индикаторы для операций, то NPS клиентов увеличится на 15 пунктов и время выполнения задач сократится на 40%, потому что основные болевые точки будут устранены',
      status: 'IN_EXPERIMENT',
      level: 'LEVEL_2',
      priority: 'HIGH',
      confidenceLevel: 85,

      // Desk Research результаты
      deskResearchNotes: 'Проанализированы 500 обращений за последние 3 месяца. Топ проблемы: 1) Не могу найти информацию о тарифе (35%), 2) Как сменить тариф (25%), 3) Когда завершится операция (20%), 4) Где скачать документы (15%), 5) Прочее (5%)',
      deskResearchSources: 'Тикеты Zendesk, интервью с 3 представителями поддержки, анализ записей пользовательских сессий (Hotjar), опрос 50 клиентов',
      deskResearchDate: new Date('2024-01-10'),

      risks: 'Возможное снижение конверсии при изменении привычного интерфейса, технические сложности интеграции поиска',
      opportunities: 'Потенциальное снижение нагрузки на поддержку на 40%, улучшение репутации компании, снижение churn rate',
      marketSize: 'TAM: 50000 клиентов М2, SAM: 20000 активных пользователей ЛК, SOM: 5000 регулярных пользователей',
      competitors: 'Тинькофф Бизнес, Сбер Бизнес - у обоих есть развитая система поиска и FAQ в ЛК',
      assumptions: 'Пользователи готовы использовать поиск, время адаптации к новому интерфейсу не превысит 1 неделю',

      // Дизайн эксперимента
      experimentMethod: 'A/B тест с разделением 50/50, длительность 6 недель',
      northStarMetric: 'Количество тикетов поддержки на 1000 активных пользователей',
      successThreshold: 'Снижение количества тикетов на 30%, повышение NPS на 15 пунктов',
      guardrailMetrics: 'Конверсия в оплату не должна снизиться более чем на 5%, время загрузки страниц не более 3 сек',
      sampleSize: 2500,
      testDuration: 42, // 6 недель
      budget: 450000, // 450к рублей
      channels: 'Все пользователи личного кабинета М2, случайное разделение',

      ideaId: testIdea.id,
      createdBy: admin.id,
    },
  })

  console.log('✅ Тестовые гипотезы созданы')

  // Создание тестового эксперимента
  const testExperiment = await prisma.experiment.create({
    data: {
      title: '[ТЕСТ] A/B тест нового интерфейса личного кабинета',
      description: 'Тестирование улучшенного интерфейса личного кабинета с интегрированным поиском, упрощенной сменой тарифа и прогресс-индикаторами для проверки гипотезы о снижении количества обращений в поддержку',
      type: 'AB_TEST',
      status: 'RUNNING',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-26'), // 6 недель
      actualStartDate: new Date('2024-01-15'),
      methodology: 'Случайное разделение пользователей ЛК на группы A (контрольная, старый интерфейс) и B (тестовая, новый интерфейс) в соотношении 50/50',
      timeline: '6 недель тестирования + 1 неделя анализа результатов',
      resources: 'Frontend разработчик, UX-дизайнер, аналитик, 2500 пользователей в каждой группе',
      successMetrics: 'Количество тикетов поддержки, NPS, время выполнения типовых задач, конверсия в оплату',
      hypothesisId: testHypothesisL2.id,
      createdBy: admin.id,
    },
  })

  console.log('✅ Тестовый эксперимент создан')

  // Создание критериев успеха для тестовых гипотез
  const testSuccessCriteria = await Promise.all([
    // Для гипотезы L1
    prisma.successCriteria.create({
      data: {
        name: 'Снижение тикетов поддержки',
        description: 'Количество обращений в службу поддержки за 30 дней',
        targetValue: 30,
        unit: '%',
        hypothesisId: testHypothesisL1.id,
      },
    }),
    // Для гипотезы L2
    prisma.successCriteria.create({
      data: {
        name: 'Повышение NPS',
        description: 'Индекс лояльности клиентов (Net Promoter Score)',
        targetValue: 15,
        actualValue: 12,
        unit: 'пунктов',
        hypothesisId: testHypothesisL2.id,
      },
    }),
    prisma.successCriteria.create({
      data: {
        name: 'Сокращение времени выполнения задач',
        description: 'Среднее время на выполнение типовых операций в ЛК',
        targetValue: 40,
        actualValue: 35,
        unit: '%',
        hypothesisId: testHypothesisL2.id,
      },
    }),
    prisma.successCriteria.create({
      data: {
        name: 'Сохранение конверсии в оплату',
        description: 'Конверсия не должна снижаться',
        targetValue: 0,
        actualValue: -2,
        unit: '%',
        hypothesisId: testHypothesisL2.id,
      },
    }),
  ])

  console.log('✅ Критерии успеха созданы:', testSuccessCriteria.length)

  // Создание результатов тестового эксперимента
  const testExperimentResults = await Promise.all([
    prisma.experimentResult.create({
      data: {
        metricName: 'Снижение тикетов поддержки',
        value: 28,
        unit: '%',
        notes: 'Близко к целевому показателю 30%. Особенно хорошие результаты по вопросам смены тарифа (-45%)',
        experimentId: testExperiment.id,
      },
    }),
    prisma.experimentResult.create({
      data: {
        metricName: 'NPS (Net Promoter Score)',
        value: 12,
        unit: 'пунктов',
        notes: 'Увеличение на 12 пунктов (цель 15). Пользователи отмечают удобство поиска и понятность процессов',
        experimentId: testExperiment.id,
      },
    }),
    prisma.experimentResult.create({
      data: {
        metricName: 'Время выполнения задач',
        value: 35,
        unit: '%',
        notes: 'Сокращение времени на 35% (цель 40%). Наибольший эффект на операции со справочной информацией',
        experimentId: testExperiment.id,
      },
    }),
    prisma.experimentResult.create({
      data: {
        metricName: 'Конверсия в оплату',
        value: -2,
        unit: '%',
        notes: 'Незначительное снижение конверсии на 2% (в пределах допустимого). Возможно связано с периодом адаптации',
        experimentId: testExperiment.id,
      },
    }),
  ])

  console.log('✅ Результаты тестового эксперимента созданы:', testExperimentResults.length)

  // Создание MVP для тестового эксперимента
  const testMVP = await prisma.mVP.create({
    data: {
      title: '[ТЕСТ] MVP улучшенного интерфейса личного кабинета',
      description: 'Минимально жизнеспособный продукт с новым интерфейсом личного кабинета, включающий поиск по FAQ, упрощенную смену тарифа и прогресс-индикаторы',
      type: 'PROTOTYPE',
      status: 'DEPLOYED',
      url: 'https://lk-test.m2.ru',
      features: 'Поиск по FAQ и документам, упрощенная форма смены тарифа, прогресс-бар для операций, мобильная оптимизация, новое меню навигации',
      technicalSpecs: 'React.js frontend, интеграция с Elasticsearch для поиска, API для операций с тарифами, WebSocket для real-time обновлений прогресса',
      resources: '2 Frontend разработчика, 1 Backend разработчик, 1 UX-дизайнер, 1 QA инженер',
      timeline: '3 недели разработки, 1 неделя тестирования, 2 недели запуска',
      successCriteria: 'Снижение тикетов поддержки на 30%, повышение NPS на 15 пунктов, время адаптации пользователей <1 недели',
      experimentId: testExperiment.id,
      createdBy: admin.id,
    },
  })

  console.log('✅ Тестовый MVP создан')

  // Создание комментариев для демонстрации обсуждений
  const testComments = await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Отличная идея! По данным нашей аналитики, 60% обращений в поддержку действительно связаны с навигацией в ЛК. Поддерживаю приоритизацию.',
        userId: admin.id,
        ideaId: testIdea.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Провел анализ пользовательских сессий - все подтверждают проблемы с поиском информации. Особенно критично для новых пользователей.',
        userId: admin.id,
        hypothesisId: testHypothesisL1.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Первые результаты обнадеживают! Уже видим снижение количества вопросов по смене тарифа на 45%. Пользователи быстро адаптируются к новому интерфейсу.',
        userId: admin.id,
        experimentId: testExperiment.id,
      },
    }),
  ])

  console.log('✅ Комментарии созданы:', testComments.length)

  console.log('')
  console.log('🎉 База данных успешно заполнена!')
  console.log('')
  console.log('📊 Создано:')
  console.log('   • Пользователи: 1 (admin@inlab.com)')
  console.log('   • Идеи: 1 тестовая')
  console.log('   • Гипотезы: 2 (L1 и L2)')
  console.log('   • Эксперименты: 1')
  console.log('   • Критерии успеха: 4')
  console.log('   • Результаты: 4')
  console.log('   • MVP: 1')
  console.log('   • Комментарии: 3')
  console.log('')
  console.log('🔗 Тестовая связка:')
  console.log('   [ТЕСТ] Идея → Гипотеза L1 → Гипотеза L2 → Эксперимент → MVP → Результаты')
  console.log('')
  console.log('👤 Пользователь для входа:')
  console.log('   • admin@inlab.com (пароль: admin2024)')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})