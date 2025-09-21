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