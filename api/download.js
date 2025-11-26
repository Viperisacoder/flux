import { Redis } from '@upstash/redis';

// Download URL pointing to the flux.zip file in the public folder
const FLUX_DOWNLOAD_URL = '/flux.zip';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize Redis client using environment variables from Vercel
    const redis = Redis.fromEnv();
    
    // Increment the download counter
    await redis.incr('flux_downloads');
    
    console.log('Download counter incremented successfully');
  } catch (error) {
    // Log error but don't block the download
    console.error('Failed to increment download counter:', error);
  }

  // Redirect to the actual download URL
  res.redirect(302, FLUX_DOWNLOAD_URL);
}
