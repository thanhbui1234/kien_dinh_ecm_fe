/**
 * Utility to trigger revalidation on Next.js frontend
 */

import { ENV } from '@/config/env';

export const triggerRevalidate = async (tag: string) => {
  const frontendUrl = ENV.FRONTEND_URL;
  const secret = ENV.REVALIDATE_SECRET;

  if (!secret) {
    console.warn('VITE_REVALIDATE_SECRET is missing. Revalidation may fail.');
  }

  try {
    const url = new URL('/api/revalidate', frontendUrl);
    url.searchParams.set('tag', tag);
    if (secret) url.searchParams.set('secret', secret);

    const res = await fetch(url.toString(), {
      method: 'POST',
    });

    if (!res.ok) {
      console.warn(`Failed to revalidate tag: ${tag}. Status: ${res.status}`);
    } else {
      console.log(`Successfully revalidated tag: ${tag}`);
    }
  } catch (error) {
    console.error(`Error triggering revalidation for tag: ${tag}`, error);
  }
};
