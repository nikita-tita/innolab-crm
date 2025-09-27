import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logActivity, getActivityDescription } from "@/lib/activity"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const ideaId = searchParams.get("ideaId")
    const hypothesisId = searchParams.get("hypothesisId")
    const experimentId = searchParams.get("experimentId")

    const where: {
      ideaId?: string
      hypothesisId?: string
      experimentId?: string
    } = {}

    if (ideaId) where.ideaId = ideaId
    if (hypothesisId) where.hypothesisId = hypothesisId
    if (experimentId) where.experimentId = experimentId

    const comments = await prisma.comment.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true }
        }
      },
      orderBy: [{ createdAt: "asc" }]
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
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
      content,
      ideaId,
      hypothesisId,
      experimentId,
    }: {
      content: string
      ideaId?: string
      hypothesisId?: string
      experimentId?: string
    } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    if (!ideaId && !hypothesisId && !experimentId) {
      return NextResponse.json(
        { error: "Target entity id is required" },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        ideaId: ideaId || null,
        hypothesisId: hypothesisId || null,
        experimentId: experimentId || null,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true }
        }
      }
    })

    // Determine entity type and get entity title for activity logging
    let entityType = ""
    let entityTitle = ""

    if (ideaId) {
      entityType = "idea"
      const idea = await prisma.idea.findUnique({ where: { id: ideaId }, select: { title: true } })
      entityTitle = idea?.title || "Unknown"
    } else if (hypothesisId) {
      entityType = "hypothesis"
      const hypothesis = await prisma.hypothesis.findUnique({ where: { id: hypothesisId }, select: { title: true } })
      entityTitle = hypothesis?.title || "Unknown"
    } else if (experimentId) {
      entityType = "experiment"
      const experiment = await prisma.experiment.findUnique({ where: { id: experimentId }, select: { title: true } })
      entityTitle = experiment?.title || "Unknown"
    }

    // Log activity
    if (entityType && entityTitle) {
      await logActivity({
        type: "COMMENT_ADDED",
        description: getActivityDescription("COMMENT_ADDED", entityType, entityTitle, session.user.email || ""),
        entityType,
        entityId: ideaId || hypothesisId || experimentId || "",
        userId: session.user.id
      })
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


