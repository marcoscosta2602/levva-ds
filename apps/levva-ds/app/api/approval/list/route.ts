import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const pendingDir = path.join(process.cwd(), 'pending');
  let files: string[] = [];
  try {
    files = fs.readdirSync(pendingDir);
  } catch {
    // Se a pasta não existir, retorna lista vazia
    return NextResponse.json({ files: [] });
  }
  return NextResponse.json({ files });
} 