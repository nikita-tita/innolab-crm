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
    const status = searchParams.get("status")
    const hypothesisId = searchParams.get("hypothesisId")

    const where: { status?: string; hypothesisId?: string } = {}

    if (status) where.status = status
    if (hypothesisId) where.hypothesisId = hypothesisId

    const experiments = await prisma.experiment.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        hypothesis: {
          select: {
            id: true,
            title: true,
            statement: true,
            idea: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        mvps: {
          select: {
            id: true,
            title: true,
            status: true
          }
        },
        _count: {
          select: {
            mvps: true,
            comments: true
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(experiments)
  } catch (error) {
    console.error("Error fetching experiments:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      hypothesisId,
      methodology,
      timeline,
      resources,
      successMetrics,
      startDate,
      endDate
    } = body

    if (!title || !description || !hypothesisId) {
      return NextResponse.json(
        { error: "Title, description and hypothesisId are required" },
        { status: 400 }
      )
    }

    // Проверяем существование гипотезы
    const hypothesis = await prisma.hypothesis.findUnique({
      where: { id: hypothesisId }
    })

    if (!hypothesis) {
      return NextResponse.json(
        { error: "Hypothesis not found" },
        { status: 404 }
      )
    }

    const experiment = await prisma.experiment.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        hypothesisId,
        methodology: methodology?.trim() || null,
        timeline: timeline?.trim() || null,
        resources: resources?.trim() || null,
        successMetrics: successMetrics?.trim() || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: "PLANNING",
        createdBy: session.user.id
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        hypothesis: {
          select: {
            id: true,
            title: true,
            statement: true,
            idea: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        _count: {
          select: {
            mvps: true,
            comments: true
          }
        }
      }
    })

    return NextResponse.json(experiment, { status: 201 })
  } catch (error) {
    console.error("Error creating experiment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}