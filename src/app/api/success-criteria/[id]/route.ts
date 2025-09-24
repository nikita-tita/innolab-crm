import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const { name, description, targetValue, actualValue, unit, achieved } = body as {
      name?: string
      description?: string
      targetValue?: number
      actualValue?: number | null
      unit?: string
      achieved?: boolean
    }

    const updated = await prisma.successCriteria.update({
      where: { id },
      data: {
        name,
        description: description === undefined ? undefined : (description?.trim() || null),
        targetValue,
        actualValue: actualValue === undefined ? undefined : actualValue,
        unit,
        achieved
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating success criteria:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params

    await prisma.successCriteria.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting success criteria:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


