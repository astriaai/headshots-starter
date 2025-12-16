import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const FAL_KEY = process.env.FAL_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Configure fal.ai client
if (FAL_KEY) {
  fal.config({
    credentials: FAL_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { imageData, filename, userId } = await request.json();

    if (!imageData || !filename) {
      return NextResponse.json(
        { error: 'Image data and filename are required' },
        { status: 400 }
      );
    }

    if (!FAL_KEY) {
      return NextResponse.json(
        { error: 'FAL_KEY not configured' },
        { status: 500 }
      );
    }

    // Initialize Supabase client for storing images
    let supabase = null;
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    }

    console.log('Upscaling image with fal.ai...', { filename, userId });

    // Call fal.ai upscale API
    const result = await fal.subscribe('fal-ai/recraft/upscale/crisp', {
      input: {
        image_url: imageData, // Can be base64 or URL
      },
      logs: true,
    });

    console.log('Upscale completed:', { requestId: result.requestId });

    const upscaledUrl = result.data?.image?.url || imageData;
    let upscaleRecordId = null;

    // Store in Supabase if available
    if (supabase && userId) {
      try {
        const { data, error } = await supabase
          .from('upscale_history')
          .insert({
            user_id: userId,
            original_image: imageData,
            upscaled_image: upscaledUrl,
            filename: filename,
            job_id: result.requestId || 'fal-job',
            status: 'completed',
          })
          .select('id')
          .single();

        if (error) {
          console.error('Supabase insert error:', error);
          // Don't fail the request if Supabase insert fails
        } else if (data) {
          upscaleRecordId = data.id;
          console.log('Upscale record saved to Supabase:', upscaleRecordId);
        }
      } catch (error) {
        console.error('Error saving to Supabase:', error);
        // Don't fail the request if Supabase fails
      }
    }
    
    return NextResponse.json({
      success: true,
      upscaledUrl: upscaledUrl,
      originalUrl: imageData,
      jobId: result.requestId || 'fal-job',
      recordId: upscaleRecordId,
    });

  } catch (error) {
    console.error('Upscale error:', error);
    return NextResponse.json(
      { error: 'Failed to upscale image', details: (error as Error).message },
      { status: 500 }
    );
  }
}