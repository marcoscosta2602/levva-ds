import { NextRequest } from "next/server"
import { rename, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(req: NextRequest) {
  const { file } = await req.json()
  if (!file) {
    return new Response(JSON.stringify({ error: "File is required" }), { status: 400 })
  }
  const src = join(process.cwd(), "pending", file)
  const destDir = join(process.cwd(), "approved")
  const dest = join(destDir, file)
  try {
    await mkdir(destDir, { recursive: true })
    await rename(src, dest)
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to approve file", details: String(err) }), { status: 500 })
  }
} 