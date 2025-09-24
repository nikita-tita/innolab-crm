import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const { reach, impact, confidence, effort, score } = body

    const hypothesis = await prisma.hypothesis.update({
      where: { id },
      data: {
        reach: reach,
        impact: impact,
        confidence: confidence,
        effort: effort,
        riceScore: score,
      },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
        idea: { select: { id: true, title: true } },
        experiments: { select: { id: true, title: true, status: true } },
        successCriteria: { orderBy: { createdAt: 'asc' } },
        _count: { select: { experiments: true, comments: true } },
      },
    })

    return NextResponse.json(hypothesis)
  } catch (error) {
    console.error("Error updating RICE score:", error)
    return NextResponse.json(
      { error: "Failed to update RICE score" },
      { status: 500 }
    )
  }
}