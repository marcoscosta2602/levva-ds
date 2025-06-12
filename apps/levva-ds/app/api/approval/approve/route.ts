import { NextRequest } from "next/server"
import { rename } from "fs/promises"
import { join } from "path"

export async function POST(req: NextRequest) {
  const { file } = await req.json()
  if (!file) {
    return new Response(JSON.stringify({ error: "File is required" }), { status: 400 })
  }
  const src = join(process.cwd(), "apps/levva-ds/pending", file)
  const dest = join(process.cwd(), "apps/levva-ds/ds", file)
  try {
    await rename(src, dest)
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to approve file", details: String(err) }), { status: 500 })
  }
} 