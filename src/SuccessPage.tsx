import React, { useEffect, useState } from 'react';
import './success.css';

const SuccessPage: React.FC = () => {
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [autoDownloadTriggered, setAutoDownloadTriggered] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (!sessionId) {
      setError('No session found. Please try again.');
      setLoading(false);
      return;
    }

    const fetchDownload = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
        const response = await fetch(`${apiUrl}/api/download?session_id=${sessionId}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to retrieve download link');
          setLoading(false);
          return;
        }

        if (data.downloadUrl) {
          setDownloadUrl(data.downloadUrl);
          setLoading(false);
          
          // Auto-download after a brief delay to show success state first
          setTimeout(() => {
            triggerDownload(data.downloadUrl);
          }, 800);
        } else {
          setError('Download service not configured');
          setLoading(false);
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
        setLoading(false);
      }
    };

    fetchDownload();
  }, []);

  const triggerDownload = (url: string) => {
    setAutoDownloadTriggered(true);
    // Use fetch to download in background without navigating away
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        // Create a blob URL and trigger download
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'Flux.dmg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Clean up the blob URL
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(err => {
        console.error('Download failed:', err);
        // Fallback to direct download if fetch fails
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Flux.dmg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  const handleDownload = () => {
    if (downloadUrl) {
      triggerDownload(downloadUrl);
    }
  };

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-card">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Preparing your download...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <h2>Something went wrong</h2>
              <p>{error}</p>
              <a href="/" className="back-link">Back to home</a>
            </div>
          ) : (
            <div className="success-state">
              <div className="success-icon">✓</div>
              <h2>Payment successful!</h2>
              <p>Thank you for purchasing Flux for macOS.</p>
              
              <div className="download-info">
                <h3>Your download is ready</h3>
                {autoDownloadTriggered ? (
                  <p className="download-status">📥 Your download has started. Check your Downloads folder.</p>
                ) : (
                  <p>You can download Flux up to 3 times within 7 days of purchase.</p>
                )}
                
                <button className="download-button" onClick={handleDownload}>
                  {autoDownloadTriggered ? 'Download again' : 'Download Flux for macOS'}
                </button>
              </div>

              <div className="next-steps">
                <h4>Next steps:</h4>
                <ol>
                  <li>Save the file to your Downloads folder</li>
                  <li>Open Finder and drag Flux to Applications</li>
                  <li>Launch Flux from Applications</li>
                  <li>Allow the app in System Settings → Privacy & Security</li>
                </ol>
              </div>

              <a href="/" className="back-link">Back to home</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
