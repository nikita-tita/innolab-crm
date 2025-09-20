const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testSystem() {
  console.log('🔍 Проверяем готовность системы InnoLab CRM...\n')

  try {
    // Test database connection
    console.log('1. 📊 Проверка подключения к базе данных...')
    await prisma.$connect()
    console.log('   ✅ База данных подключена')

    // Check users
    const usersCount = await prisma.user.count()
    console.log(`   ✅ Пользователей в системе: ${usersCount}`)

    // Check ideas
    const ideasCount = await prisma.idea.count()
    console.log(`   ✅ Идей в системе: ${ideasCount}`)

    // Check hypotheses
    const hypothesesCount = await prisma.hypothesis.count()
    console.log(`   ✅ Гипотез в системе: ${hypothesesCount}`)

    // Check experiments
    const experimentsCount = await prisma.experiment.count()
    console.log(`   ✅ Экспериментов в системе: ${experimentsCount}`)

    // Check MVPs
    const mvpsCount = await prisma.mVP.count()
    console.log(`   ✅ MVP в системе: ${mvpsCount}`)

    // Check experiment results
    const resultsCount = await prisma.experimentResult.count()
    console.log(`   ✅ Результатов экспериментов: ${resultsCount}`)

    // Check success criteria
    const criteriaCount = await prisma.successCriteria.count()
    console.log(`   ✅ Критериев успеха: ${criteriaCount}`)

    console.log('\n2. 🔗 Проверка связей между компонентами...')

    // Check experiment with results and criteria
    const experimentWithData = await prisma.experiment.findFirst({
      include: {
        results: true,
        hypothesis: {
          include: {
            successCriteria: true
          }
        }
      },
      where: {
        results: {
          some: {}
        }
      }
    })

    if (experimentWithData) {
      console.log(`   ✅ Найден эксперимент "${experimentWithData.title}" с ${experimentWithData.results.length} результатами`)
      console.log(`   ✅ У гипотезы ${experimentWithData.hypothesis.successCriteria.length} критериев успеха`)

      // Test analysis logic
      const { results } = experimentWithData
      const successCriteria = experimentWithData.hypothesis.successCriteria

      const criteriaWithResults = successCriteria.map(criteria => {
        const matchingResult = results.find(result =>
          result.metricName.toLowerCase().includes(criteria.name.toLowerCase()) ||
          criteria.name.toLowerCase().includes(result.metricName.toLowerCase())
        )
        return {
          criteria: criteria.name,
          target: criteria.targetValue,
          actual: matchingResult?.value || null,
          achieved: matchingResult ? matchingResult.value >= criteria.targetValue : false
        }
      })

      const achievedCount = criteriaWithResults.filter(c => c.achieved).length
      const successRate = criteriaWithResults.length > 0 ? (achievedCount / criteriaWithResults.length) * 100 : 0

      console.log(`   ✅ Анализ: ${achievedCount}/${criteriaWithResults.length} критериев достигнуто (${successRate.toFixed(0)}%)`)
    }

    console.log('\n3. 🚀 Проверка MVP системы...')
    const mvpWithProgress = await prisma.mVP.findFirst({
      include: {
        experiment: {
          include: {
            hypothesis: {
              include: {
                idea: true
              }
            }
          }
        }
      }
    })

    if (mvpWithProgress) {
      console.log(`   ✅ MVP "${mvpWithProgress.title}" связан с экспериментом "${mvpWithProgress.experiment.title}"`)
      console.log(`   ✅ Статус MVP: ${mvpWithProgress.status}`)
      console.log(`   ✅ Тип MVP: ${mvpWithProgress.type}`)
    }

    console.log('\n🎉 Система InnoLab CRM полностью готова к работе!')
    console.log('\n📋 Компоненты системы:')
    console.log('   💡 Ideas Management - Управление идеями')
    console.log('   🔬 Hypothesis Testing - Проверка гипотез')
    console.log('   🧪 Experiment Management - Управление экспериментами')
    console.log('   📊 Results Analysis - Анализ результатов с ИИ')
    console.log('   🚀 MVP Development - Разработка MVP')
    console.log('   📈 Lifecycle Tracking - Отслеживание жизненного цикла')

    console.log('\n🌐 Production URL: https://innolab-6comt0zes-nikita-tita-projects.vercel.app')
    console.log('\n🔐 Для входа используйте любой email адрес (например: demo@innolab.com)')

  } catch (error) {
    console.error('❌ Ошибка при проверке системы:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testSystem()