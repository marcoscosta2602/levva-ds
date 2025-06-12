import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const approvedDir = path.join(process.cwd(), 'approved');
  let files: string[] = [];
  try {
    files = fs.readdirSync(approvedDir);
  } catch {
    // Se a pasta não existir, retorna lista vazia
    return NextResponse.json({ files: [] });
  }
  return NextResponse.json({ files });
} 