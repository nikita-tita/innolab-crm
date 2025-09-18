import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const experimentId = searchParams.get("experimentId")
    if (!experimentId) return NextResponse.json({ error: "experimentId is required" }, { status: 400 })

    const results = await prisma.experimentResult.findMany({
      where: { experimentId },
      orderBy: [{ createdAt: "asc" }]
    })
    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching experiment results:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { experimentId, metricName, value, unit, notes } = body as {
      experimentId: string
      metricName: string
      value: number
      unit: string
      notes?: string
    }

    if (!experimentId || !metricName || value === undefined || !unit) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const created = await prisma.experimentResult.create({
      data: {
        experimentId,
        metricName: metricName.trim(),
        value,
        unit,
        notes: notes?.trim() || null
      }
    })
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("Error creating experiment result:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


