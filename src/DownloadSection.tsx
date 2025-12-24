import React, { useEffect, useState } from 'react';
import './download.css';

interface PricingCardProps {
  tier: 'free' | 'pro';
  title: string;
  description: string;
  features: string[];
  badge?: string;
  buttonLabel: string;
  buttonDisabled?: boolean;
  onDownload?: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  tier,
  title,
  description,
  features,
  badge,
  buttonLabel,
  buttonDisabled = false,
  onDownload,
}) => {
  return (
    <div className={`pricing-card pricing-card-${tier} ${buttonDisabled ? 'disabled' : ''}`}>
      <div className="card-header">
        <div className="tier-label">{tier === 'free' ? 'Free' : 'Pro'}</div>
        {badge && <div className="tier-badge">{badge}</div>}
      </div>

      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>

      <ul className="features-list">
        {features.map((feature, index) => (
          <li key={index} className="feature-item">
            <span className="feature-check">✓</span>
            <span className="feature-text">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={`download-button ${buttonDisabled ? 'disabled' : ''}`}
        onClick={onDownload}
        disabled={buttonDisabled}
      >
        {buttonLabel}
      </button>

      {tier === 'free' && (
        <p className="system-requirements">
          Requires macOS Ventura or later · Apple silicon & Intel supported
        </p>
      )}
    </div>
  );
};

const AnimatedReveal: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`animated-reveal ${isVisible ? 'visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

const DownloadSection: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create checkout session');
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const features = [
    'Live Menu Bar Performance',
    'Weekly Performance Updates',
    'Performance notifications',
    'Brightness Slider',
    'CPU, MEM, RAM rings',
    'Ram and PC cleaner',
  ];

  return (
    <section id="download" className="download-section">
      <div className="main-wrapper">
        <AnimatedReveal className="download-header">
          <div className="overline">Download</div>
          <h2 className="download-headline">Start understanding your Mac in seconds.</h2>
          <p className="download-subheadline">
            Flux is intentionally simple. Install it once — it works quietly forever. All your performance data stays on your Mac.
          </p>
        </AnimatedReveal>

        <div className="pricing-grid single-plan">
          <AnimatedReveal className="pricing-card-wrapper">
            <div className="pricing-card pricing-card-single">
              <div className="card-header">
                <div className="tier-label">$2</div>
                <div className="tier-badge">One-time</div>
              </div>

              <h3 className="card-title">Flux for macOS</h3>
              <p className="card-description">Everything you need to understand your Mac at a glance.</p>

              <ul className="features-list">
                {features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <span className="feature-check">✓</span>
                    <span className="feature-text">{feature}</span>
                  </li>
                ))}
              </ul>

              {error && <div className="error-message">{error}</div>}

              <button
                className="download-button"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Buy & Download'}
              </button>

              <p className="system-requirements">
                Secure payment powered by Stripe. Download up to 3 times within 7 days.
              </p>
            </div>
          </AnimatedReveal>
        </div>

        <AnimatedReveal className="download-footer">
          <p className="footer-text">
            Flux respects your privacy. All metrics are processed locally on your Mac. No data collection, no tracking, no ads.
          </p>
        </AnimatedReveal>
      </div>
    </section>
  );
};

export default DownloadSection;
