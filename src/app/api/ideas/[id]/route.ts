import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { IdeaStatus } from "@prisma/client"
import { checkPermission, PermissionError } from "@/lib/permissions-server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const idea = await prisma.idea.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
        _count: { select: { hypotheses: true, comments: true } }
      }
    })

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 })
    }

    return NextResponse.json(idea)
  } catch (error) {
    console.error("Error fetching idea:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body as { status?: IdeaStatus }

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      )
    }

    // Check if idea exists and user has permission to edit
    const existingIdea = await prisma.idea.findUnique({
      where: { id },
      select: { createdBy: true }
    })

    if (!existingIdea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 })
    }

    try {
      checkPermission(
        { id: session.user.id, role: session.user.role as string },
        'edit',
        { createdBy: existingIdea.createdBy }
      )
    } catch (error) {
      if (error instanceof PermissionError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        )
      }
      throw error
    }

    const updated = await prisma.idea.update({
      where: { id },
      data: { status: status as IdeaStatus },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
        _count: { select: { hypotheses: true, comments: true } }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating idea:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, description, category, context, priority, status, reach, impact, confidence, effort } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    // Check if idea exists and user has permission to edit
    const existingIdea = await prisma.idea.findUnique({
      where: { id },
      select: { createdBy: true }
    })

    if (!existingIdea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 })
    }

    try {
      checkPermission(
        { id: session.user.id, role: session.user.role as string },
        'edit',
        { createdBy: existingIdea.createdBy }
      )
    } catch (error) {
      if (error instanceof PermissionError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        )
      }
      throw error
    }

    // Calculate RICE score if all values are provided
    let riceScore = null
    if (reach && impact && confidence && effort) {
      riceScore = (reach * impact * confidence / 100) / effort
    }

    const updated = await prisma.idea.update({
      where: { id },
      data: {
        title,
        description,
        category: category || null,
        context: context || null,
        priority: priority || null,
        status: status || null,
        reach: reach || null,
        impact: impact || null,
        confidence: confidence || null,
        effort: effort || null,
        riceScore: riceScore,
      },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
        _count: { select: { hypotheses: true, comments: true } }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating idea:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check if idea exists and user has permission to delete
    const existingIdea = await prisma.idea.findUnique({
      where: { id },
      select: { createdBy: true, title: true }
    })

    if (!existingIdea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 })
    }

    try {
      checkPermission(
        { id: session.user.id, role: session.user.role as string },
        'delete',
        { createdBy: existingIdea.createdBy }
      )
    } catch (error) {
      if (error instanceof PermissionError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        )
      }
      throw error
    }

    // Delete the idea
    await prisma.idea.delete({
      where: { id }
    })

    return NextResponse.json({
      message: "Idea deleted successfully",
      deletedIdea: { id, title: existingIdea.title }
    })
  } catch (error) {
    console.error("Error deleting idea:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
