import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { ExperimentStatus } from "@prisma/client"
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

    const experiment = await prisma.experiment.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
        hypothesis: { select: { id: true, title: true } },
        _count: { select: { comments: true, successCriteria: true } }
      }
    })

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 })
    }

    return NextResponse.json(experiment)
  } catch (error) {
    console.error("Error fetching experiment:", error)
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
    const { status } = body as { status?: ExperimentStatus }

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      )
    }

    const updated = await prisma.experiment.update({
      where: { id },
      data: { status: status as ExperimentStatus },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
        hypothesis: { select: { id: true, title: true } },
        _count: { select: { comments: true, successCriteria: true } }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating experiment:", error)
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
      type,
      status,
      startDate,
      endDate,
      actualStartDate,
      actualEndDate,
      methodology,
      timeline,
      resources,
      successMetrics
    } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    // Check if experiment exists and user has permission to edit
    const existingExperiment = await prisma.experiment.findUnique({
      where: { id },
      select: { createdBy: true }
    })

    if (!existingExperiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 })
    }

    try {
      checkPermission(
        { id: session.user.id, role: session.user.role as string },
        'edit',
        { createdBy: existingExperiment.createdBy }
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

    const updated = await prisma.experiment.update({
      where: { id },
      data: {
        title,
        description,
        type: type || null,
        status: status || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        actualStartDate: actualStartDate ? new Date(actualStartDate) : null,
        actualEndDate: actualEndDate ? new Date(actualEndDate) : null,
        methodology: methodology || null,
        timeline: timeline || null,
        resources: resources || null,
        successMetrics: successMetrics || null,
      },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
        hypothesis: { select: { id: true, title: true } },
        _count: { select: { comments: true, successCriteria: true } }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating experiment:", error)
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

    // Check if experiment exists and user has permission to delete
    const existingExperiment = await prisma.experiment.findUnique({
      where: { id },
      select: { createdBy: true, title: true }
    })

    if (!existingExperiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 })
    }

    try {
      checkPermission(
        { id: session.user.id, role: session.user.role as string },
        'delete',
        { createdBy: existingExperiment.createdBy }
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

    // Delete the experiment
    await prisma.experiment.delete({
      where: { id }
    })

    return NextResponse.json({
      message: "Experiment deleted successfully",
      deletedExperiment: { id, title: existingExperiment.title }
    })
  } catch (error) {
    console.error("Error deleting experiment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
