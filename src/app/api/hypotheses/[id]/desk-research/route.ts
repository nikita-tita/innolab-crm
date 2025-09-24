import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const { notes, sources, risks, opportunities } = body

    const hypothesis = await prisma.hypothesis.update({
      where: { id },
      data: {
        deskResearchNotes: notes,
        deskResearchSources: Array.isArray(sources) ? sources.join('\n') : sources,
        risks: Array.isArray(risks) ? risks.join('\n') : risks,
        opportunities: Array.isArray(opportunities) ? opportunities.join('\n') : opportunities,
        deskResearchDate: new Date(),
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
    console.error("Error updating desk research:", error)
    return NextResponse.json(
      { error: "Failed to update desk research" },
      { status: 500 }
    )
  }
}