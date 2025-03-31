export const config = {
  packQueryType: process.env.PACK_QUERY_TYPE as 'users' | 'gallery' | 'both',
  tuneType: process.env.NEXT_PUBLIC_TUNE_TYPE as 'packs' | 'tune',
  stripeEnabled: process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === 'true',
  vercelUrl: process.env.DEPLOYMENT_URL,
} as const;

function isVercelPreviewUrl(url: string): boolean {
  return url.includes('.vercel.app') && 
    (url.includes('-git-') || 
     url.match(/-[a-f0-9]{8,}\.vercel\.app/i) !== null);
}

export function validateConfig() {
  const validPackQueryTypes = ['users', 'gallery', 'both'];
  const validTuneTypes = ['packs', 'tune'];

  if (!validPackQueryTypes.includes(config.packQueryType)) {
    throw new Error(`Invalid PACK_QUERY_TYPE: ${config.packQueryType}`);
  }

  if (!validTuneTypes.includes(config.tuneType)) {
    throw new Error(`Invalid NEXT_PUBLIC_TUNE_TYPE: ${config.tuneType}`);
  }

  if (typeof config.stripeEnabled !== 'boolean') {
    throw new Error('Invalid NEXT_PUBLIC_STRIPE_IS_ENABLED value');
  }

  // Add Vercel URL validation
  if (config.vercelUrl && isVercelPreviewUrl(config.vercelUrl)) {
    throw new Error(
      'Invalid DEPLOYMENT_URL: Preview URLs cannot be used for webhooks.\n' +
      'Please use either:\n' +
      '1. Your production domain (e.g., your-app.com)\n' +
      '2. For local development, use ngrok (e.g., your-tunnel.ngrok.io)'
    );
  }
}


