import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const hypothesisId = searchParams.get("hypothesisId")
    if (!hypothesisId) return NextResponse.json({ error: "hypothesisId is required" }, { status: 400 })

    const criteria = await prisma.successCriteria.findMany({
      where: { hypothesisId },
      orderBy: [{ createdAt: "asc" }]
    })
    return NextResponse.json(criteria)
  } catch (error) {
    console.error("Error fetching success criteria:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { hypothesisId, name, description, targetValue, unit } = body as {
      hypothesisId: string
      name: string
      description?: string
      targetValue: number
      unit: string
    }

    if (!hypothesisId || !name || targetValue === undefined || !unit) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const created = await prisma.successCriteria.create({
      data: {
        hypothesisId,
        name: name.trim(),
        description: description?.trim() || null,
        targetValue,
        unit
      }
    })
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("Error creating success criteria:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


