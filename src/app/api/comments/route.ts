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
    const ideaId = searchParams.get("ideaId")
    const hypothesisId = searchParams.get("hypothesisId")
    const experimentId = searchParams.get("experimentId")
    const mvpId = searchParams.get("mvpId")

    const where: {
      ideaId?: string
      hypothesisId?: string
      experimentId?: string
      mvpId?: string
    } = {}

    if (ideaId) where.ideaId = ideaId
    if (hypothesisId) where.hypothesisId = hypothesisId
    if (experimentId) where.experimentId = experimentId
    if (mvpId) where.mvpId = mvpId

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
      mvpId
    }: {
      content: string
      ideaId?: string
      hypothesisId?: string
      experimentId?: string
      mvpId?: string
    } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    if (!ideaId && !hypothesisId && !experimentId && !mvpId) {
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
        mvpId: mvpId || null
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true }
        }
      }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


