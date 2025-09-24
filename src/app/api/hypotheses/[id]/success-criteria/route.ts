import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authConfig } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const successCriteria = await prisma.successCriteria.findMany({
      where: {
        hypothesisId: id
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json(successCriteria)
  } catch (error) {
    console.error("Error fetching success criteria:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    const successCriteria = await prisma.successCriteria.create({
      data: {
        name: data.name,
        description: data.description,
        targetValue: data.targetValue,
        actualValue: data.actualValue,
        unit: data.unit,
        hypothesisId: id
      }
    })

    return NextResponse.json(successCriteria)
  } catch (error) {
    console.error("Error creating success criteria:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    // If data is an array, update all criteria
    if (Array.isArray(data)) {
      const results = await Promise.all(
        data.map(async (criteria: any) => {
          if (criteria.id && criteria.id !== 'new') {
            // Update existing
            return prisma.successCriteria.update({
              where: { id: criteria.id },
              data: {
                name: criteria.name,
                description: criteria.description,
                targetValue: criteria.targetValue,
                actualValue: criteria.actualValue,
                unit: criteria.unit,
                achieved: criteria.actualValue !== undefined && criteria.actualValue >= criteria.targetValue
              }
            })
          } else {
            // Create new
            return prisma.successCriteria.create({
              data: {
                name: criteria.name,
                description: criteria.description,
                targetValue: criteria.targetValue,
                actualValue: criteria.actualValue,
                unit: criteria.unit,
                hypothesisId: id
              }
            })
          }
        })
      )
      return NextResponse.json(results)
    }

    return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
  } catch (error) {
    console.error("Error updating success criteria:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}