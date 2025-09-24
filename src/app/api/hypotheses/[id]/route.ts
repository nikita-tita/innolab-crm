import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { HypothesisStatus } from "@prisma/client"

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


