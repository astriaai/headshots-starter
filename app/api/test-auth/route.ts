import { NextRequest, NextResponse } from 'next/server';

const UPSCALE_API_KEY = process.env.UPSCALE_API_KEY;

export async function GET() {
  try {
    console.log('Testing API key:', UPSCALE_API_KEY ? 'Key exists' : 'No key');
    
    if (!UPSCALE_API_KEY) {
      return NextResponse.json({ error: 'No API key configured' }, { status: 500 });
    }

    // Test authentication with Replicate API
    const testResponse = await fetch('https://api.replicate.com/v1/account', {
      headers: {
        'Authorization': `Token ${UPSCALE_API_KEY}`,
      },
    });

    const responseData = await testResponse.text();
    console.log('Auth test response:', testResponse.status, responseData);

    return NextResponse.json({
      status: testResponse.status,
      authenticated: testResponse.ok,
      response: responseData,
      keyFormat: UPSCALE_API_KEY.substring(0, 10) + '...',
    });

  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
}