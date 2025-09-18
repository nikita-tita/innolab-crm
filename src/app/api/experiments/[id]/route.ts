import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { ExperimentStatus } from "@prisma/client"

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
        _count: { select: { mvps: true, comments: true } }
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


