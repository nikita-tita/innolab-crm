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
    const experimentId = searchParams.get("experimentId")

    const where: { status?: string; experimentId?: string } = {}

    if (status) where.status = status
    if (experimentId) where.experimentId = experimentId

    const mvps = await prisma.mVP.findMany({
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
        experiment: {
          select: {
            id: true,
            title: true,
            hypothesis: {
              select: {
                id: true,
                title: true,
                idea: {
                  select: {
                    id: true,
                    title: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(mvps)
  } catch (error) {
    console.error("Error fetching MVPs:", error)
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
      experimentId,
      type,
      features,
      technicalSpecs,
      resources,
      timeline,
      successCriteria
    } = body

    if (!title || !description || !experimentId) {
      return NextResponse.json(
        { error: "Title, description and experimentId are required" },
        { status: 400 }
      )
    }

    // Проверяем существование эксперимента
    const experiment = await prisma.experiment.findUnique({
      where: { id: experimentId }
    })

    if (!experiment) {
      return NextResponse.json(
        { error: "Experiment not found" },
        { status: 404 }
      )
    }

    const mvp = await prisma.mVP.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        experimentId,
        type: type || "PROTOTYPE",
        features: features?.trim() || null,
        technicalSpecs: technicalSpecs?.trim() || null,
        resources: resources?.trim() || null,
        timeline: timeline?.trim() || null,
        successCriteria: successCriteria?.trim() || null,
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
        experiment: {
          select: {
            id: true,
            title: true,
            hypothesis: {
              select: {
                id: true,
                title: true,
                idea: {
                  select: {
                    id: true,
                    title: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    return NextResponse.json(mvp, { status: 201 })
  } catch (error) {
    console.error("Error creating MVP:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}