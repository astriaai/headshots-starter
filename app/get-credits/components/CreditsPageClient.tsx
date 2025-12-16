'use client'

import { User } from '@supabase/supabase-js';
import { useState } from 'react';
import StripePricingTable from '@/components/stripe/StripeTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
  user: User | null;
}

export default function CreditsPageClient({ user }: Props) {
  const [email, setEmail] = useState('');
  const [isEmailEntered, setIsEmailEntered] = useState(!!user);

  const handleEmailSubmit = () => {
    if (email.trim()) {
      setIsEmailEntered(true);
    }
  };

  // If user is logged in, show pricing directly
  if (user) {
    return <StripePricingTable user={user} />;
  }

  // If not logged in and email not entered yet, show email input
  if (!isEmailEntered) {
    return (
      <div className='flex flex-1 flex-col w-full max-w-md mx-auto py-12'>
        <div className='border rounded-lg p-8 space-y-6'>
          <div>
            <h2 className='text-2xl font-bold mb-2'>Get Credits</h2>
            <p className='text-gray-600'>
              Enter your email to purchase credits and unlock advanced features.
            </p>
          </div>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Email Address</label>
              <Input
                type='email'
                placeholder='your@email.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEmailSubmit()}
                className='w-full'
              />
            </div>

            <Button 
              onClick={handleEmailSubmit}
              size="lg"
              className='w-full'
              disabled={!email.trim()}
            >
              Continue to Payment
            </Button>
          </div>

          <div className='space-y-3 pt-4 border-t'>
            <div className='flex items-center gap-2'>
              <span className='text-2xl'>✨</span>
              <span>Advanced Upscaling (CLIPDROP)</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-2xl'>⚡</span>
              <span>Priority Processing</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-2xl'>📥</span>
              <span>Unlimited Downloads</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Email entered, show pricing table
  return <StripePricingTable user={null} email={email} />;
}
