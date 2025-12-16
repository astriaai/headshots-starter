'use client'
import { User } from '@supabase/supabase-js';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  user: User;
}

declare global {
  interface Window {
    Paddle?: any;
  }
}

const PaddlePricingTable = ({ user }: Props) => {
  const paddleClientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const paddlePriceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID;

  useEffect(() => {
    // Load Paddle script
    const script = document.createElement('script');
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;

    script.onload = () => {
      if (window.Paddle) {
        window.Paddle.Environment.set('sandbox'); // Set to 'production' for live
        window.Paddle.Initialize({
          token: paddleClientToken,
          eventCallback: handlePaddleEvent,
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [paddleClientToken]);

  const handlePaddleEvent = (data: any) => {
    console.log('Paddle event:', data);
  };

  const openPaymentPage = () => {
    if (window.Paddle) {
      window.Paddle.Checkout.open({
        items: [
          {
            priceId: paddlePriceId,
            quantity: 1,
          },
        ],
        customer: {
          email: user.email,
          id: user.id,
        },
        settings: {
          variant: 'embedded',
          displayMode: 'inline',
          frameTarget: 'paddle-container',
          frameInitialHeight: 450,
        },
      });
    }
  };

  return (
    <div className='flex flex-1 flex-col w-full gap-6'>
      <div className='border rounded-lg p-6 space-y-4'>
        <h2 className='text-2xl font-bold'>Premium Credits</h2>
        <p className='text-gray-600'>
          Purchase credits to unlock advanced upscaling features and priority processing.
        </p>
        
        <div className='space-y-3'>
          <div className='flex justify-between items-center p-3 bg-gray-50 rounded-md'>
            <span>✨ Advanced Upscaling (CLIPDROP)</span>
            <span className='font-bold'>5 Credits</span>
          </div>
          <div className='flex justify-between items-center p-3 bg-gray-50 rounded-md'>
            <span>⚡ Priority Processing</span>
            <span className='font-bold'>Included</span>
          </div>
          <div className='flex justify-between items-center p-3 bg-gray-50 rounded-md'>
            <span>📥 Unlimited Downloads</span>
            <span className='font-bold'>Included</span>
          </div>
        </div>

        <Button 
          onClick={openPaymentPage}
          size="lg"
          className='w-full'
        >
          Open Payment Page
        </Button>
      </div>

      {/* Paddle inline checkout container */}
      <div id="paddle-container" className='rounded-lg border'></div>

      <div className='text-sm text-gray-500 space-y-2'>
        <p>💳 <strong>Test Card:</strong> 4242 4242 4242 4242</p>
        <p>📅 <strong>Expiry:</strong> 12/25</p>
        <p>🔒 <strong>CVC:</strong> 123</p>
      </div>
    </div>
  );
}

export default PaddlePricingTable;
