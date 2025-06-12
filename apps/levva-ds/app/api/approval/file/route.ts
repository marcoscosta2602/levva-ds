import { NextRequest } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file");
  if (!file) {
    return new Response("File parameter is required", { status: 400 });
  }
  const filePath = join(process.cwd(), "pending", file);
  try {
    const content = await readFile(filePath, "utf-8");
    return new Response(content, { status: 200, headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response("File not found", { status: 404 });
  }
} 