import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Handle webhook from upscaling service
    const { job_id, status, upscaled_url, error } = payload;

    if (status === 'completed' && upscaled_url) {
      // Store the upscaled image result
      // You can implement WebSocket here to notify the client
      console.log(`Upscaling completed for job ${job_id}: ${upscaled_url}`);
      
      return NextResponse.json({ success: true });
    } else if (status === 'failed') {
      console.error(`Upscaling failed for job ${job_id}:`, error);
      return NextResponse.json({ error: 'Upscaling failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}