'use client'
import { User } from '@supabase/supabase-js';
import React, { useEffect } from 'react';

interface StripePricingTableProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  'pricing-table-id': string;
  'publishable-key': string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': StripePricingTableProps;
    }
  }
}

type Props = {
  user: User | null;
  email?: string;
}

const StripePricingTable = ({ user, email }: Props) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const customerId = user?.id || 'guest';
  const customerEmail = user?.email || email || '';

  return (
    <div className='flex flex-1 flex-col w-full'>
      <stripe-pricing-table
          pricing-table-id="prctbl_1P0TL0C3ic5Sd20TGpWOU2Fi"
          publishable-key="pk_live_51P0SikC3ic5Sd20T9QRaRKIkqy8l951LDgeOxcP24ZRXHnQzjnOFM7tfhsYdWksn1wNBdejJzvaxXGq0yRAxm14A00Py0XreGk"
          client-reference-id={customerId}
          customer-email={customerEmail}
      >
      </stripe-pricing-table>
    </div>
  );
}

export default StripePricingTable;
