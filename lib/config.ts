export const config = {
  packQueryType: process.env.PACK_QUERY_TYPE as 'users' | 'gallery' | 'both',
  tuneType: process.env.NEXT_PUBLIC_TUNE_TYPE as 'packs' | 'tune',
  stripeEnabled: process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === 'true',
} as const;

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
}

