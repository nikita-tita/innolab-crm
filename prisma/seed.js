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

  // Создание дополнительных идей для канбан-доски
  const additionalIdeas = await Promise.all([
    // Идея в статусе NEW
    prisma.idea.create({
      data: {
        title: 'Внедрение чат-бота для первичной поддержки клиентов',
        description: 'Автоматизация ответов на типовые вопросы клиентов с помощью AI-чат-бота для разгрузки службы поддержки и повышения скорости ответа',
        category: 'Автоматизация',
        priority: 'MEDIUM',
        status: 'NEW',
        context: 'Анализ показал, что 70% обращений в поддержку - типовые вопросы, которые можно автоматизировать',
        createdBy: admin.id,
      },
    }),

    // Идея в статусе SCORED
    prisma.idea.create({
      data: {
        title: 'Мобильное приложение для управления недвижимостью',
        description: 'Разработка мобильного приложения для собственников недвижимости с функциями мониторинга, уведомлений и быстрых операций',
        category: 'Мобильные технологии',
        priority: 'HIGH',
        status: 'SCORED',
        reach: 10000,
        impact: 5,
        confidence: 70,
        effort: 60,
        riceScore: 583.33,
        context: 'Исследование показало высокий спрос на мобильные решения среди клиентов',
        createdBy: admin.id,
      },
    }),

    // Простая идея без гипотез
    prisma.idea.create({
      data: {
        title: 'Программа лояльности для постоянных клиентов',
        description: 'Внедрение системы бонусов и скидок для долгосрочных клиентов М2',
        category: 'Маркетинг',
        priority: 'LOW',
        status: 'NEW',
        context: 'Retention analysis показал потребность в удержании существующих клиентов',
        createdBy: admin.id,
      },
    }),
  ])

  // Создание гипотез для мобильного приложения
  const mobileAppHypothesis = await prisma.hypothesis.create({
    data: {
      title: 'Мобильное приложение повысит engagement клиентов на 40%',
      description: 'Гипотеза о влиянии мобильного приложения на активность клиентов',
      statement: 'Если мы создадим мобильное приложение с push-уведомлениями и быстрыми действиями, то engagement клиентов увеличится на 40%, потому что мобильный доступ более удобен для ежедневного использования',
      status: 'DRAFT',
      level: 'LEVEL_1',
      priority: 'HIGH',
      confidenceLevel: 75,
      reach: 10000,
      impact: 4,
      confidence: 75,
      effort: 40,
      riceScore: 750,
      ideaId: additionalIdeas[1].id,
      createdBy: admin.id,
    },
  })

  // Создание второй гипотезы для мобильного приложения
  const mobileAppHypothesisL2 = await prisma.hypothesis.create({
    data: {
      title: 'Push-уведомления увеличат частоту входов в приложение в 3 раза',
      description: 'Детализированная гипотеза после исследования',
      statement: 'Если мы внедрим персонализированные push-уведомления о важных событиях и напоминания о платежах, то частота входов в приложение увеличится в 3 раза и количество просроченных платежей снизится на 25%, потому что пользователи будут получать своевременные напоминания',
      status: 'READY_FOR_TESTING',
      level: 'LEVEL_2',
      priority: 'HIGH',
      confidenceLevel: 80,
      deskResearchNotes: 'Анализ данных показал, что 65% просроченных платежей происходят из-за забывчивости клиентов',
      researchCompleted: true,
      experimentDesigned: true,
      ideaId: additionalIdeas[1].id,
      createdBy: admin.id,
    },
  })

  // Создание эксперимента для мобильного приложения
  const mobileAppExperiment = await prisma.experiment.create({
    data: {
      title: 'Пилот мобильного приложения с 1000 beta-тестерами',
      description: 'Тестирование базовой функциональности мобильного приложения с группой добровольных beta-тестеров',
      type: 'MVP_TEST',
      status: 'PLANNING',
      methodology: 'Closed beta с 1000 активных клиентов',
      timeline: '8 недель тестирования',
      resources: 'Команда мобильной разработки, 1000 beta-тестеров',
      successMetrics: 'Daily Active Users, частота входов, NPS',
      hypothesisId: mobileAppHypothesisL2.id,
      createdBy: admin.id,
    },
  })

  // Создание завершенного эксперимента с результатами
  const completedIdea = await prisma.idea.create({
    data: {
      title: 'Онлайн-калькулятор доходности инвестиций',
      description: 'Интерактивный калькулятор для расчета потенциальной доходности от инвестиций в недвижимость',
      category: 'Финтех',
      priority: 'HIGH',
      status: 'COMPLETED',
      reach: 15000,
      impact: 4,
      confidence: 90,
      effort: 25,
      riceScore: 2160,
      createdBy: admin.id,
    },
  })

  const completedHypothesis = await prisma.hypothesis.create({
    data: {
      title: 'Калькулятор увеличит количество заявок на инвестиции на 50%',
      statement: 'Если мы добавим интерактивный калькулятор доходности на сайт, то количество заявок на инвестиционные продукты увеличится на 50%, потому что клиенты смогут сразу оценить потенциальную выгоду',
      status: 'VALIDATED',
      level: 'LEVEL_2',
      priority: 'HIGH',
      confidenceLevel: 95,
      conclusion: 'VALIDATED',
      conclusionNotes: 'Гипотеза полностью подтверждена. Конверсия в заявки выросла на 65%, превысив ожидания',
      lessonLearned: 'Клиенты высоко ценят инструменты для самостоятельной оценки инвестиций. Важно делать калькулятор максимально простым и понятным',
      ideaId: completedIdea.id,
      createdBy: admin.id,
    },
  })

  const completedExperiment = await prisma.experiment.create({
    data: {
      title: 'A/B тест калькулятора доходности на лендинге',
      description: 'Тестирование влияния калькулятора на конверсию лендинга инвестиционных продуктов',
      type: 'AB_TEST',
      status: 'COMPLETED',
      startDate: new Date('2023-11-01'),
      endDate: new Date('2023-12-15'),
      actualStartDate: new Date('2023-11-01'),
      actualEndDate: new Date('2023-12-15'),
      methodology: 'Split-test: 50% трафика на лендинг с калькулятором, 50% на стандартный лендинг',
      resources: 'Веб-разработчик, аналитик, дизайнер',
      successMetrics: 'Конверсия в заявку, время на сайте, показатель отказов',
      hypothesisId: completedHypothesis.id,
      createdBy: admin.id,
    },
  })

  // Результаты завершенного эксперимента
  await Promise.all([
    prisma.experimentResult.create({
      data: {
        metricName: 'Конверсия в заявки',
        value: 65,
        unit: '%',
        notes: 'Рост конверсии на 65% (ожидали 50%). Особенно высокий результат у сегмента "новых инвесторов"',
        experimentId: completedExperiment.id,
      },
    }),
    prisma.experimentResult.create({
      data: {
        metricName: 'Время на сайте',
        value: 180,
        unit: '%',
        notes: 'Время на сайте увеличилось на 180%. Пользователи активно используют калькулятор',
        experimentId: completedExperiment.id,
      },
    }),
  ])

  console.log('✅ Дополнительные данные для канбан-доски созданы')
  console.log('')
  console.log('🎉 База данных успешно заполнена!')
  console.log('')
  console.log('📊 Создано:')
  console.log('   • Пользователи: 1 (admin@inlab.com)')
  console.log('   • Идеи: 5 (разные статусы)')
  console.log('   • Гипотезы: 5 (L1 и L2, разные статусы)')
  console.log('   • Эксперименты: 3 (планирование, выполняется, завершен)')
  console.log('   • Критерии успеха: 4')
  console.log('   • Результаты: 6')
  console.log('   • MVP: 1')
  console.log('   • Комментарии: 3')
  console.log('')
  console.log('🌊 Канбан-доска содержит:')
  console.log('   • Полный цикл: Идея → Гипотезы L1/L2 → Эксперимент → Результат')
  console.log('   • Идеи в разных статусах: NEW, SCORED, SELECTED, COMPLETED')
  console.log('   • Гипотезы в разных статусах: DRAFT, RESEARCH, READY_FOR_TESTING, VALIDATED')
  console.log('   • Эксперименты: PLANNING, RUNNING, COMPLETED')
  console.log('')
  console.log('👤 Пользователь для входа:')
  console.log('   • admin@inlab.com (пароль: admin2024)')
  console.log('')
  console.log('🎯 Для демонстрации канбан-доски перейдите на /kanban')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})