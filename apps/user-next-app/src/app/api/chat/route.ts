import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const clientSecret = process.env.APP_CLIENT_SECRET || '';

    const response = await fetch(`${backendUrl}/api/v1/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-client-key': clientSecret,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Error in AI Chat Route Proxy:', error);
    return NextResponse.json(
      { success: false, message: 'Không thể kết nối tới máy chủ AI.' },
      { status: 500 },
    );
  }
}
