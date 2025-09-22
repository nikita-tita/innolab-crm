const { PrismaClient } = require('@prisma/client')
const { TEAM_MEMBERS, OBSERVERS } = require('../src/lib/team-config')

const prisma = new PrismaClient()

async function initializeTeam() {
  console.log('🚀 Инициализация команды лаборатории...')

  try {
    // Инициализируем участников команды
    for (const member of TEAM_MEMBERS) {
      const user = await prisma.user.upsert({
        where: { email: member.email },
        update: {
          name: member.name,
          role: member.role,
          status: 'ACTIVE',
          isActive: true
        },
        create: {
          id: member.id,
          email: member.email,
          name: member.name,
          role: member.role,
          status: 'ACTIVE',
          isActive: true
        }
      })
      console.log(`✅ ${member.name} (${member.role})`)
    }

    // Инициализируем наблюдателей
    for (const observer of OBSERVERS) {
      const user = await prisma.user.upsert({
        where: { email: observer.email },
        update: {
          name: observer.name,
          role: observer.role,
          status: 'ACTIVE',
          isActive: true
        },
        create: {
          id: observer.id,
          email: observer.email,
          name: observer.name,
          role: observer.role,
          status: 'ACTIVE',
          isActive: true
        }
      })
      console.log(`✅ ${observer.name} (${observer.role})`)
    }

    // Создаем демо-данные для лаборатории
    await createDemoData()

    console.log('🎉 Команда лаборатории успешно инициализирована!')
  } catch (error) {
    console.error('❌ Ошибка инициализации команды:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function createDemoData() {
  console.log('\n📊 Создание демо-данных...')

  // Находим руководителя лаборатории
  const director = await prisma.user.findFirst({
    where: { role: 'LAB_DIRECTOR' }
  })

  if (!director) {
    console.log('⚠️ Руководитель лаборатории не найден')
    return
  }

  // Создаем демо-идею
  const demoIdea = await prisma.idea.upsert({
    where: { id: 'demo-idea-001' },
    update: {},
    create: {
      id: 'demo-idea-001',
      title: 'Персонализированные предложения для агентов',
      description: 'Система рекомендаций объектов недвижимости на основе истории запросов и предпочтений агентов',
      category: 'Продукт',
      priority: 'HIGH',
      status: 'SELECTED',
      reach: 5000,
      impact: 4,
      confidence: 70,
      effort: 8,
      riceScore: 1750,
      context: 'Результат анализа поведения агентов и их запросов к системе',
      createdBy: director.id
    }
  })

  // Создаем демо-гипотезу
  const demoHypothesis = await prisma.hypothesis.upsert({
    where: { id: 'demo-hypothesis-001' },
    update: {},
    create: {
      id: 'demo-hypothesis-001',
      title: 'Персональные рекомендации увеличат конверсию агентов',
      actionDescription: 'Внедрим систему персональных рекомендаций объектов недвижимости для агентов на основе их истории запросов',
      expectedResult: 'Увеличится время сессии агентов на 30% и количество просмотренных объектов на 40%',
      reasoning: 'Агенты тратят много времени на поиск подходящих объектов для клиентов, персонализация поможет им быстрее находить релевантные варианты',
      statement: 'Если мы внедрим систему персональных рекомендаций объектов недвижимости для агентов на основе их истории запросов, то увеличится время сессии агентов на 30% и количество просмотренных объектов на 40%, потому что агенты тратят много времени на поиск подходящих объектов для клиентов',
      status: 'DRAFT',
      priority: 'HIGH',
      confidenceLevel: 75,
      targetAudience: 'Активные агенты недвижимости с опытом работы более 6 месяцев',
      userValue: 'Экономия времени на поиск, повышение эффективности работы',
      businessImpact: 'Увеличение активности агентов, рост конверсии в сделки',
      financialImpact: 'Потенциальный рост выручки на 15-20% за счет увеличения активности агентов',
      strategicAlignment: 'Соответствует стратегии цифровизации и улучшения пользовательского опыта',
      ideaId: demoIdea.id,
      createdBy: director.id
    }
  })

  // Создаем демо-артефакты
  await prisma.artifact.createMany({
    data: [
      {
        id: 'artifact-001',
        name: 'Аналитика поведения пользователей',
        type: 'Внутренние данные',
        url: '/analytics/user-behavior-2024',
        description: 'Отчет по поведению агентов в системе за 2024 год',
        conclusion: 'Агенты в среднем проводят 40% времени на поиск объектов',
        hypothesisId: demoHypothesis.id
      },
      {
        id: 'artifact-002',
        name: 'Исследование Avito Pro',
        type: 'Внешнее исследование',
        url: 'https://example.com/avito-study',
        description: 'Кейс внедрения персональных рекомендаций на платформе Avito Pro',
        conclusion: 'Персонализация увеличила время сессии на 35%',
        hypothesisId: demoHypothesis.id
      },
      {
        id: 'artifact-003',
        name: 'Интервью с агентами',
        type: 'Качественное исследование',
        description: 'Глубинные интервью с 15 активными агентами',
        conclusion: 'Все агенты отмечают сложность поиска подходящих объектов',
        hypothesisId: demoHypothesis.id
      }
    ],
    skipDuplicates: true
  })

  // Создаем ICE-оценки от команды
  const teamMembers = await prisma.user.findMany({
    where: {
      role: {
        in: ['PRODUCT_MANAGER', 'UX_RESEARCHER', 'MARKETER', 'SALES_EXPERT', 'OPERATIONS_EXPERT']
      }
    }
  })

  const iceScores = [
    { impact: 4, confidence: 4, ease: 3 }, // Менеджер по продукту
    { impact: 4, confidence: 6, ease: 1 }, // UX-исследователь
    { impact: 3, confidence: 3, ease: 1 }, // Маркетолог
    { impact: 3, confidence: 2, ease: 3 }, // Эксперт по продажам
    { impact: 4, confidence: 4, ease: 3 }, // Эксперт по операциям
  ]

  for (let i = 0; i < Math.min(teamMembers.length, iceScores.length); i++) {
    await prisma.iCEScore.upsert({
      where: {
        userId_hypothesisId: {
          userId: teamMembers[i].id,
          hypothesisId: demoHypothesis.id
        }
      },
      update: iceScores[i],
      create: {
        ...iceScores[i],
        userId: teamMembers[i].id,
        hypothesisId: demoHypothesis.id
      }
    })
  }

  // Создаем инвентарь лаборатории
  await prisma.labInventory.createMany({
    data: [
      {
        id: 'traffic-yandex-direct',
        category: 'TRAFFIC_SOURCE',
        name: 'Яндекс.Директ',
        description: 'Контекстная реклама для привлечения трафика',
        details: {
          budget: 'до 100 000 руб/месяц',
          access: 'Павел Литвинов',
          setup_time: '1-2 дня'
        }
      },
      {
        id: 'traffic-vk-ads',
        category: 'TRAFFIC_SOURCE',
        name: 'VK Реклама',
        description: 'Таргетированная реклама ВКонтакте',
        details: {
          budget: 'до 50 000 руб/месяц',
          access: 'Павел Литвинов',
          setup_time: '1 день'
        }
      },
      {
        id: 'sales-agent-base',
        category: 'SALES_VALIDATION',
        name: 'База агентской сети',
        description: 'Прямые продажи через агентскую сеть',
        details: {
          size: '2000+ активных агентов',
          access: 'Ольга Царькова',
          response_rate: '15-20%'
        }
      },
      {
        id: 'research-interviews',
        category: 'RESEARCH_TOOL',
        name: 'Глубинные интервью',
        description: 'Качественные исследования с пользователями',
        details: {
          capacity: 'до 20 интервью/неделя',
          access: 'Ксения Зюбина',
          cost_per_interview: '3000 руб'
        }
      },
      {
        id: 'analytics-yandex-metrika',
        category: 'ANALYTICS_TOOL',
        name: 'Яндекс.Метрика',
        description: 'Веб-аналитика для отслеживания поведения пользователей',
        details: {
          access: 'Павел Литвинов, Ксения Зюбина',
          features: ['События', 'Цели', 'Когорты', 'Карты кликов']
        }
      }
    ],
    skipDuplicates: true
  })

  console.log('✅ Демо-данные созданы:')
  console.log(`   • 1 идея: ${demoIdea.title}`)
  console.log(`   • 1 гипотеза: ${demoHypothesis.title}`)
  console.log(`   • 3 артефакта`)
  console.log(`   • ${teamMembers.length} ICE-оценок`)
  console.log(`   • 5 единиц инвентаря лаборатории`)
}

// Запускаем инициализацию
if (require.main === module) {
  initializeTeam()
}

module.exports = { initializeTeam }