import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize Redis client using environment variables from Vercel
    const redis = Redis.fromEnv();
    
    // Get the current download count
    const downloads = await redis.get('flux_downloads');
    
    return res.status(200).json({
      downloads: downloads || 0
    });
  } catch (error) {
    console.error('Failed to get download count:', error);
    
    // Return 0 if Redis fails
    return res.status(200).json({
      downloads: 0
    });
  }
}
