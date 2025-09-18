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
    const priority = searchParams.get("priority")
    const ideaId = searchParams.get("ideaId")

    const where: { status?: string; priority?: string; ideaId?: string } = {}

    if (status) where.status = status
    if (priority) where.priority = priority
    if (ideaId) where.ideaId = ideaId

    const hypotheses = await prisma.hypothesis.findMany({
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
        idea: {
          select: {
            id: true,
            title: true
          }
        },
        experiments: {
          select: {
            id: true,
            title: true,
            status: true
          }
        },
        _count: {
          select: {
            experiments: true,
            comments: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(hypotheses)
  } catch (error) {
    console.error("Error fetching hypotheses:", error)
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
      statement,
      ideaId,
      priority = "MEDIUM",
      confidenceLevel = 70,
      testingMethod,
      successCriteria
    } = body

    if (!title || !statement || !ideaId) {
      return NextResponse.json(
        { error: "Title, statement and ideaId are required" },
        { status: 400 }
      )
    }

    // Проверяем существование идеи
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId }
    })

    if (!idea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      )
    }

    const hypothesis = await prisma.hypothesis.create({
      data: {
        title: title.trim(),
        statement: statement.trim(),
        ideaId,
        priority,
        confidenceLevel,
        testingMethod: testingMethod?.trim() || null,
        successCriteria: successCriteria?.trim() || null,
        status: "DRAFT",
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
        idea: {
          select: {
            id: true,
            title: true
          }
        },
        _count: {
          select: {
            experiments: true,
            comments: true
          }
        }
      }
    })

    return NextResponse.json(hypothesis, { status: 201 })
  } catch (error) {
    console.error("Error creating hypothesis:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}