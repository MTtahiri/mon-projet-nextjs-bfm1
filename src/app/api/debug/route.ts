// src/app/api/debug/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Debug endpoint works!', 
    timestamp: new Date().toISOString() 
  });
}
