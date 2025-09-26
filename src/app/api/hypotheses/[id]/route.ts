import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { HypothesisStatus } from "@prisma/client"
import { checkPermission, PermissionError } from "@/lib/permissions-server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const hypothesis = await prisma.hypothesis.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
        idea: { select: { id: true, title: true } },
        experiments: { select: { id: true, title: true, status: true } },
        successCriteria: { orderBy: { createdAt: 'asc' } },
        _count: { select: { experiments: true, comments: true } },
      },
    })

    if (!hypothesis) {
      return NextResponse.json({ error: "Hypothesis not found" }, { status: 404 })
    }

    return NextResponse.json(hypothesis)
  } catch (error) {
    console.error("Error fetching hypothesis:", error)
    return NextResponse.json(
      { error: "Failed to fetch hypothesis" },
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
    const { status } = body as { status?: HypothesisStatus }

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      )
    }

    const updated = await prisma.hypothesis.update({
      where: { id },
      data: { status: status as HypothesisStatus },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
        idea: { select: { id: true, title: true } },
        _count: { select: { experiments: true, comments: true } }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating hypothesis:", error)
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
    const {
      title,
      description,
      statement,
      status,
      priority,
      confidenceLevel,
      testingMethod,
      successCriteriaText,
      level,
      reach,
      impact,
      confidence,
      effort
    } = body

    if (!title || !statement) {
      return NextResponse.json(
        { error: "Title and statement are required" },
        { status: 400 }
      )
    }

    // Check if hypothesis exists and user has permission to edit
    const existingHypothesis = await prisma.hypothesis.findUnique({
      where: { id },
      select: { createdBy: true }
    })

    if (!existingHypothesis) {
      return NextResponse.json({ error: "Hypothesis not found" }, { status: 404 })
    }

    try {
      checkPermission(
        { id: session.user.id, role: session.user.role as string },
        'edit',
        { createdBy: existingHypothesis.createdBy }
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

    const updated = await prisma.hypothesis.update({
      where: { id },
      data: {
        title,
        description: description || null,
        statement,
        status: status || null,
        priority: priority || null,
        confidenceLevel: confidenceLevel || null,
        testingMethod: testingMethod || null,
        successCriteriaText: successCriteriaText || null,
        level: level || null,
        reach: reach || null,
        impact: impact || null,
        confidence: confidence || null,
        effort: effort || null,
        riceScore: riceScore,
      },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
        idea: { select: { id: true, title: true } },
        _count: { select: { experiments: true, comments: true } }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating hypothesis:", error)
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

    // Check if hypothesis exists and user has permission to delete
    const existingHypothesis = await prisma.hypothesis.findUnique({
      where: { id },
      select: { createdBy: true, title: true }
    })

    if (!existingHypothesis) {
      return NextResponse.json({ error: "Hypothesis not found" }, { status: 404 })
    }

    try {
      checkPermission(
        { id: session.user.id, role: session.user.role as string },
        'delete',
        { createdBy: existingHypothesis.createdBy }
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

    // Delete the hypothesis
    await prisma.hypothesis.delete({
      where: { id }
    })

    return NextResponse.json({
      message: "Hypothesis deleted successfully",
      deletedHypothesis: { id, title: existingHypothesis.title }
    })
  } catch (error) {
    console.error("Error deleting hypothesis:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

