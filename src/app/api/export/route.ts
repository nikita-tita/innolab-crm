import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // "ideas", "hypotheses", "experiments", "all"
    const format = searchParams.get("format") || "json" // "json", "csv"

    let data: any = {}

    // Fetch data based on type
    if (type === "ideas" || type === "all") {
      data.ideas = await prisma.idea.findMany({
        include: {
          creator: {
            select: { name: true, email: true, role: true }
          },
          hypotheses: {
            select: { id: true, title: true, status: true }
          },
          _count: {
            select: { hypotheses: true, comments: true }
          }
        },
        orderBy: { createdAt: "desc" }
      })
    }

    if (type === "hypotheses" || type === "all") {
      data.hypotheses = await prisma.hypothesis.findMany({
        include: {
          creator: {
            select: { name: true, email: true, role: true }
          },
          idea: {
            select: { title: true, category: true }
          },
          experiments: {
            select: { id: true, title: true, status: true }
          },
          _count: {
            select: { experiments: true, comments: true }
          }
        },
        orderBy: { createdAt: "desc" }
      })
    }

    if (type === "experiments" || type === "all") {
      data.experiments = await prisma.experiment.findMany({
        include: {
          creator: {
            select: { name: true, email: true, role: true }
          },
          hypothesis: {
            select: { title: true, statement: true }
          },
          results: true,
          _count: {
            select: { results: true, comments: true, mvps: true }
          }
        },
        orderBy: { createdAt: "desc" }
      })
    }

    // Handle CSV export
    if (format === "csv") {
      const csvContent = convertToCSV(data, type || "all")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="inlab-export-${type || "all"}-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    // Handle JSON export
    const jsonContent = JSON.stringify(data, null, 2)

    return new NextResponse(jsonContent, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="inlab-export-${type || "all"}-${new Date().toISOString().split('T')[0]}.json"`
      }
    })
  } catch (error) {
    console.error("Error exporting data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

function convertToCSV(data: any, type: string): string {
  let csvContent = ""

  if (data.ideas && data.ideas.length > 0) {
    csvContent += "=== ИДЕИ ===\\n"
    csvContent += "ID,Название,Описание,Категория,Приоритет,Статус,Автор,Email автора,Роль автора,Дата создания,Количество гипотез,Количество комментариев\\n"

    data.ideas.forEach((idea: any) => {
      const row = [
        idea.id,
        `"${idea.title.replace(/"/g, '""')}"`,
        `"${idea.description.replace(/"/g, '""')}"`,
        idea.category || "",
        idea.priority,
        idea.status,
        idea.creator.name || "",
        idea.creator.email,
        idea.creator.role,
        new Date(idea.createdAt).toLocaleDateString('ru-RU'),
        idea._count.hypotheses,
        idea._count.comments
      ]
      csvContent += row.join(",") + "\\n"
    })
    csvContent += "\\n"
  }

  if (data.hypotheses && data.hypotheses.length > 0) {
    csvContent += "=== ГИПОТЕЗЫ ===\\n"
    csvContent += "ID,Название,Описание,Утверждение,Статус,Приоритет,Уровень уверенности,Метод тестирования,Критерии успеха,Связанная идея,Автор,Email автора,Дата создания,Количество экспериментов\\n"

    data.hypotheses.forEach((hypothesis: any) => {
      const row = [
        hypothesis.id,
        `"${hypothesis.title.replace(/"/g, '""')}"`,
        `"${(hypothesis.description || "").replace(/"/g, '""')}"`,
        `"${hypothesis.statement.replace(/"/g, '""')}"`,
        hypothesis.status,
        hypothesis.priority,
        hypothesis.confidenceLevel,
        hypothesis.testingMethod || "",
        `"${(hypothesis.successCriteriaText || "").replace(/"/g, '""')}"`,
        hypothesis.idea.title,
        hypothesis.creator.name || "",
        hypothesis.creator.email,
        new Date(hypothesis.createdAt).toLocaleDateString('ru-RU'),
        hypothesis._count.experiments
      ]
      csvContent += row.join(",") + "\\n"
    })
    csvContent += "\\n"
  }

  if (data.experiments && data.experiments.length > 0) {
    csvContent += "=== ЭКСПЕРИМЕНТЫ ===\\n"
    csvContent += "ID,Название,Описание,Тип,Статус,Дата начала,Дата окончания,Методология,Метрики успеха,Связанная гипотеза,Автор,Email автора,Дата создания,Количество результатов\\n"

    data.experiments.forEach((experiment: any) => {
      const row = [
        experiment.id,
        `"${experiment.title.replace(/"/g, '""')}"`,
        `"${experiment.description.replace(/"/g, '""')}"`,
        experiment.type,
        experiment.status,
        experiment.startDate ? new Date(experiment.startDate).toLocaleDateString('ru-RU') : "",
        experiment.endDate ? new Date(experiment.endDate).toLocaleDateString('ru-RU') : "",
        `"${(experiment.methodology || "").replace(/"/g, '""')}"`,
        `"${(experiment.successMetrics || "").replace(/"/g, '""')}"`,
        experiment.hypothesis.title,
        experiment.creator.name || "",
        experiment.creator.email,
        new Date(experiment.createdAt).toLocaleDateString('ru-RU'),
        experiment._count.results
      ]
      csvContent += row.join(",") + "\\n"
    })
  }

  return csvContent
}