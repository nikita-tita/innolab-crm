import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logActivity, getActivityDescription } from "@/lib/activity"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const experimentId = params.id

    const results = await prisma.experimentResult.findMany({
      where: { experimentId },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching experiment results:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const experimentId = params.id
    const body = await request.json()
    const { metricName, value, unit, notes } = body

    if (!metricName || value === undefined || !unit) {
      return NextResponse.json(
        { error: "MetricName, value, and unit are required" },
        { status: 400 }
      )
    }

    // Verify experiment exists and user has access
    const experiment = await prisma.experiment.findUnique({
      where: { id: experimentId },
      select: { id: true, title: true, status: true }
    })

    if (!experiment) {
      return NextResponse.json(
        { error: "Experiment not found" },
        { status: 404 }
      )
    }

    const result = await prisma.experimentResult.create({
      data: {
        metricName: metricName.trim(),
        value: parseFloat(value),
        unit: unit.trim(),
        notes: notes?.trim() || null,
        experimentId
      }
    })

    // Log activity
    await logActivity({
      type: "UPDATED",
      description: `${session.user.email} добавил(а) результат "${metricName}: ${value} ${unit}" к эксперименту "${experiment.title}"`,
      entityType: "experiment",
      entityId: experimentId,
      userId: session.user.id,
      metadata: {
        metricName,
        value,
        unit,
        resultId: result.id
      }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error creating experiment result:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const resultId = searchParams.get("resultId")

    if (!resultId) {
      return NextResponse.json(
        { error: "Result ID is required" },
        { status: 400 }
      )
    }

    // Verify result exists and belongs to the experiment
    const result = await prisma.experimentResult.findFirst({
      where: {
        id: resultId,
        experimentId: params.id
      },
      include: {
        experiment: {
          select: { title: true }
        }
      }
    })

    if (!result) {
      return NextResponse.json(
        { error: "Result not found" },
        { status: 404 }
      )
    }

    await prisma.experimentResult.delete({
      where: { id: resultId }
    })

    // Log activity
    await logActivity({
      type: "DELETED",
      description: `${session.user.email} удалил(а) результат "${result.metricName}" из эксперимента "${result.experiment.title}"`,
      entityType: "experiment",
      entityId: params.id,
      userId: session.user.id,
      metadata: {
        deletedMetric: result.metricName,
        deletedValue: result.value,
        deletedUnit: result.unit
      }
    })

    return NextResponse.json({ message: "Result deleted successfully" })
  } catch (error) {
    console.error("Error deleting experiment result:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}