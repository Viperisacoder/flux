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
  const handleDownload = () => {
    window.location.href = '/flux.zip';
  };

  const freeFeatures = [
    'CPU, Disk, and Memory rings',
    'Performance Timeline (10 min, 1 hr, 24 hrs, 7 days)',
    'Smart alerts for unusual spikes',
    'External display brightness control',
    'Local-only processing — no data leaves your Mac',
    'Menu bar integration',
  ];

  const proFeatures = [
    'Advanced alert customization',
    'Extended timeline history',
    'Theme customization',
    'Priority support',
    'Future features',
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

        <div className="pricing-grid">
          <AnimatedReveal className="pricing-card-wrapper">
            <PricingCard
              tier="free"
              title="Flux for macOS"
              description="Everything you need to understand your Mac at a glance."
              features={freeFeatures}
              badge="Current version"
              buttonLabel="Download for macOS"
              onDownload={handleDownload}
            />
          </AnimatedReveal>

          <AnimatedReveal className="pricing-card-wrapper">
            <PricingCard
              tier="pro"
              title="Flux Pro"
              description="Advanced monitoring and customization for power users."
              features={proFeatures}
              badge="Coming soon"
              buttonLabel="Coming soon"
              buttonDisabled={true}
            />
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
