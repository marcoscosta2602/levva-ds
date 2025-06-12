import { NextRequest } from "next/server"
import { unlink } from "fs/promises"
import { join } from "path"

export async function POST(req: NextRequest) {
  const { file } = await req.json()
  if (!file) {
    return new Response(JSON.stringify({ error: "File is required" }), { status: 400 })
  }
  const filePath = join(process.cwd(), "pending", file)
  try {
    await unlink(filePath)
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to reject file", details: String(err) }), { status: 500 })
  }
} 