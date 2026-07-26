import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag');
  const secret = request.nextUrl.searchParams.get('secret');

  // Check secret to prevent unauthorized revalidation
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret key' }, { status: 401, headers: corsHeaders });
  }

  if (!tag) {
    return NextResponse.json({ message: 'Missing tag param' }, { status: 400, headers: corsHeaders });
  }

  try {
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, tag, now: Date.now() }, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating tag' }, { status: 500, headers: corsHeaders });
  }
}
