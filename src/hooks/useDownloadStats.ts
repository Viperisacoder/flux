import { useState, useEffect } from 'react';

interface DownloadStats {
  downloads: number;
}

export const useDownloadStats = () => {
  const [stats, setStats] = useState<DownloadStats>({ downloads: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch download stats');
        }
        
        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching download stats:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Keep default stats on error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
