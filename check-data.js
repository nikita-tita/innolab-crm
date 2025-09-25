const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkData() {
  console.log('📊 Проверка данных в базе...')

  try {
    // Проверяем идеи
    const ideas = await prisma.idea.findMany({
      where: { deletedAt: null },
      include: {
        creator: { select: { name: true, email: true } },
        hypotheses: {
          include: {
            experiments: true
          }
        }
      }
    })

    console.log(`💡 Идей найдено: ${ideas.length}`)
    ideas.forEach(idea => {
      console.log(`  - ${idea.title} (статус: ${idea.status})`)
      console.log(`    Создатель: ${idea.creator.name} (${idea.creator.email})`)
      console.log(`    Гипотез: ${idea.hypotheses.length}`)
    })

    // Проверяем гипотезы
    const hypotheses = await prisma.hypothesis.findMany({
      where: { deletedAt: null },
      include: {
        idea: { select: { title: true } },
        creator: { select: { name: true } },
        experiments: true
      }
    })

    console.log(`\n🔬 Гипотез найдено: ${hypotheses.length}`)
    hypotheses.forEach(hyp => {
      console.log(`  - ${hyp.title} (статус: ${hyp.status})`)
      console.log(`    Идея: ${hyp.idea ? hyp.idea.title : 'НЕТ СВЯЗИ!'}`)
      console.log(`    Создатель: ${hyp.creator.name}`)
      console.log(`    Экспериментов: ${hyp.experiments.length}`)
    })

    // Проверяем эксперименты
    const experiments = await prisma.experiment.findMany({
      where: { deletedAt: null },
      include: {
        hypothesis: {
          select: {
            title: true,
            idea: { select: { title: true } }
          }
        },
        creator: { select: { name: true } }
      }
    })

    console.log(`\n⚗️ Экспериментов найдено: ${experiments.length}`)
    experiments.forEach(exp => {
      console.log(`  - ${exp.title} (статус: ${exp.status})`)
      console.log(`    Гипотеза: ${exp.hypothesis ? exp.hypothesis.title : 'НЕТ СВЯЗИ!'}`)
      console.log(`    Идея: ${exp.hypothesis?.idea ? exp.hypothesis.idea.title : 'НЕТ СВЯЗИ!'}`)
    })

    // Проверяем пользователей
    const users = await prisma.user.findMany()
    console.log(`\n👤 Пользователей: ${users.length}`)
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - роль: ${user.role}`)
    })

  } catch (error) {
    console.error('❌ Ошибка при проверке данных:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkData()