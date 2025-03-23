import { NextRequest, NextResponse } from 'next/server';

// Health check handler
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}

// Main API handler - can be expanded as needed
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'API is operational' });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Process the request body as needed
    
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 400 }
    );
  }
} 