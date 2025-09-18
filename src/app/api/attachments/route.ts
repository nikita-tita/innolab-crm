import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const mvpId = searchParams.get("mvpId")
    if (!mvpId) return NextResponse.json({ error: "mvpId is required" }, { status: 400 })

    const list = await prisma.attachment.findMany({ where: { mvpId }, orderBy: [{ createdAt: "asc" }] })
    return NextResponse.json(list)
  } catch (error) {
    console.error("Error fetching attachments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { mvpId, filename, url, size, mimeType } = body as {
      mvpId: string
      filename: string
      url: string
      size: number
      mimeType: string
    }

    if (!mvpId || !filename || !url || size === undefined || !mimeType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const created = await prisma.attachment.create({
      data: { mvpId, filename, url, size, mimeType }
    })
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("Error creating attachment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


