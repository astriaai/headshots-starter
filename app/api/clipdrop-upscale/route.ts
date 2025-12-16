import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const CLIPDROP_API_KEY = process.env.CLIPDROP_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// CLIPDROP API documentation: https://clipdrop.co/api
const CLIPDROP_API_URL = 'https://clipdrop-api.co/upscale/v1/upscale';

export async function POST(request: NextRequest) {
  try {
    const { imageData, filename, userId } = await request.json();

    if (!imageData || !filename) {
      return NextResponse.json(
        { error: 'Image data and filename are required' },
        { status: 400 }
      );
    }

    if (!CLIPDROP_API_KEY) {
      return NextResponse.json(
        { error: 'CLIPDROP_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Initialize Supabase client for storing images
    let supabase = null;
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    }

    console.log('Upscaling image with CLIPDROP...', { filename, userId });

    // Convert base64 to buffer if needed
    let imageBuffer: Buffer;
    
    if (imageData.startsWith('data:image')) {
      // Handle data URL format
      const base64Data = imageData.split(',')[1];
      imageBuffer = Buffer.from(base64Data, 'base64');
    } else if (imageData.startsWith('/')) {
      // Handle URL format - fetch the image
      const response = await fetch(imageData);
      imageBuffer = Buffer.from(await response.arrayBuffer());
    } else {
      // Handle raw base64
      imageBuffer = Buffer.from(imageData, 'base64');
    }

    // Create FormData for CLIPDROP API
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
    formData.append('image_file', blob, filename);

    // Call CLIPDROP API
    const clipdropResponse = await fetch(CLIPDROP_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': CLIPDROP_API_KEY,
      },
      body: formData,
    });

    if (!clipdropResponse.ok) {
      const errorText = await clipdropResponse.text();
      console.error('CLIPDROP API error:', {
        status: clipdropResponse.status,
        statusText: clipdropResponse.statusText,
        error: errorText,
      });

      return NextResponse.json(
        {
          error: 'CLIPDROP API request failed',
          details: `${clipdropResponse.status}: ${clipdropResponse.statusText}`,
        },
        { status: clipdropResponse.status }
      );
    }

    // Get the upscaled image as buffer
    const upscaledBuffer = await clipdropResponse.arrayBuffer();
    
    // Convert to base64 for storage
    const upscaledBase64 = Buffer.from(upscaledBuffer).toString('base64');
    const upscaledUrl = `data:image/png;base64,${upscaledBase64}`;

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
            job_id: `clipdrop-${Date.now()}`,
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

    console.log('CLIPDROP upscale completed successfully');

    return NextResponse.json({
      success: true,
      upscaledUrl: upscaledUrl,
      originalUrl: imageData,
      jobId: `clipdrop-${Date.now()}`,
      recordId: upscaleRecordId,
      provider: 'clipdrop',
    });

  } catch (error) {
    console.error('CLIPDROP upscale error:', error);
    return NextResponse.json(
      { error: 'Failed to upscale image with CLIPDROP', details: (error as Error).message },
      { status: 500 }
    );
  }
}
