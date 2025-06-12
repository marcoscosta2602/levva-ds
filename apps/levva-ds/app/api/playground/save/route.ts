import { NextRequest } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(req: NextRequest) {
  const data = await req.json()
  if (!data || !data.model) {
    return new Response(JSON.stringify({ error: "Model is required" }), { status: 400 })
  }

  const type = data.model.type || "screen"
  const timestamp = Date.now()
  const fileName = `${type}-${timestamp}.json`
  const dir = join(process.cwd(), "pending")
  const filePath = join(dir, fileName)

  try {
    await mkdir(dir, { recursive: true })
    await writeFile(filePath, JSON.stringify(data.model, null, 2), "utf-8")
    return new Response(JSON.stringify({ success: true, file: fileName }), { status: 201 })
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to save file", details: String(err) }), { status: 500 })
  }
} 