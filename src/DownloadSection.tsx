import React, { useEffect, useState } from 'react';
import './download.css';

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
    const link = document.createElement('a');
    link.href = '/flux.zip';
    link.download = 'Flux.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

              <button
                className="download-button"
                onClick={handleDownload}
              >
                Download
              </button>

              <p className="system-requirements">
                Requires macOS Ventura or later · Apple silicon & Intel supported
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
