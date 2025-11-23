import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import './index.css';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary', className = '' }) => {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  return (
    <button className={`${baseClass} ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

const Header: React.FC = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="header">
      <div className="main-wrapper">
        <div className="header-content">
          <a href="#" className="wordmark">Flux</a>
          <nav className="nav">
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
              Home
            </a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('instructions'); }}>
              Instructions
            </a>
            <button className="download-btn-small" onClick={downloadFlux}>
              Download
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

const downloadFlux = () => {
  const link = document.createElement('a');
  link.href = '/flux.zip';
  link.download = 'flux.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Hero: React.FC = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="main-wrapper">
        <div className="hero-overline">Flux for macOS</div>
        <h1 className="hero-headline">Performance, reimagined for your Mac.</h1>
        <p className="hero-subheadline">
          Flux is a minimal menu-bar performance monitor for CPU, memory, disk, alerts, and brightness — quiet when it can be, loud when it must.
        </p>
        <div className="hero-buttons">
          <Button 
            label="Download for macOS" 
            variant="primary" 
            onClick={downloadFlux}
          />
          <Button 
            label="View Instructions" 
            variant="secondary" 
            onClick={() => scrollToSection('instructions')}
          />
        </div>
        <p className="hero-caption">All performance data is processed locally on your Mac.</p>
        <img src="/flux.png" alt="Flux App UI" className="hero-image" />
      </div>
    </section>
  );
};

const FeatureStrip: React.FC = () => {
  const features = [
    {
      title: "Menu bar first",
      description: "Lives quietly in your menu bar, always accessible but never intrusive."
    },
    {
      title: "Smart alerts",
      description: "Get notified when performance spikes matter, not every minor fluctuation."
    },
    {
      title: "Performance timeline",
      description: "View your Mac's performance over time with detailed historical data."
    }
  ];

  return (
    <section className="feature-strip">
      <div className="main-wrapper">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon"></div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductDetailsSection: React.FC = () => {
  return (
    <section className="product-details">
      <div className="main-wrapper">
        <div className="details-content">
          <h3>At-a-glance rings</h3>
          <p>See CPU, memory, and disk usage as elegant circular indicators that update in real-time without overwhelming your workflow.</p>
          
          <h3>Always-on, never in the way</h3>
          <p>Flux sits quietly in your menu bar, providing instant access to performance data when you need it, invisible when you don't.</p>
          
          <h3>Quiet until it matters</h3>
          <p>Smart notifications alert you to performance issues that actually impact your work, filtering out the noise of normal system fluctuations.</p>
        </div>
        <img src="/performance.png" alt="Performance Metrics" className="details-image" />
      </div>
    </section>
  );
};

type TimeRange = '10m' | '1h' | '24h' | '7d';

const TimelineSection: React.FC = () => {
  const [range, setRange] = useState<TimeRange>('1h');

  const ranges: { key: TimeRange; label: string }[] = [
    { key: '10m', label: '10 min' },
    { key: '1h', label: '1 hr' },
    { key: '24h', label: '24 hrs' },
    { key: '7d', label: '7 days' }
  ];

  const getStatsForRange = (selectedRange: TimeRange) => {
    const stats = {
      '10m': { peak: '89% CPU', average: '34% CPU', events: '2 spikes', wave: 'M20,80 Q40,40 60,80 T100,80 T140,80 T180,80 T220,80 T260,80 T300,80 T340,80 T380,80 T420,80 T460,80' },
      '1h': { peak: '82% CPU', average: '28% CPU', events: '5 spikes', wave: 'M20,70 Q40,30 60,70 T100,70 T140,50 T180,70 T220,40 T260,70 T300,60 T340,70 T380,45 T420,70 T460,55' },
      '24h': { peak: '94% CPU', average: '31% CPU', events: '12 spikes', wave: 'M20,60 Q40,20 60,60 T100,60 T140,35 T180,60 T220,25 T260,60 T300,40 T340,60 T380,30 T420,60 T460,35' },
      '7d': { peak: '96% CPU', average: '29% CPU', events: '47 spikes', wave: 'M20,50 Q40,10 60,50 T100,50 T140,25 T180,50 T220,15 T260,50 T300,30 T340,50 T380,20 T420,50 T460,25' }
    };
    return stats[selectedRange];
  };

  const currentStats = getStatsForRange(range);

  return (
    <section className="timeline-section">
      <div className="main-wrapper">
        <div className="timeline-header">
          <h2 className="timeline-title">See your Mac's day at a glance.</h2>
          <p className="timeline-subtitle">
            Flux lets you view usage over different time periods, with peaks, averages, and notable events clearly visualized.
          </p>
        </div>
        
        <div className="timeline-controls">
          {ranges.map(({ key, label }) => (
            <button
              key={key}
              className={`range-pill ${range === key ? 'active' : ''}`}
              onClick={() => setRange(key)}
            >
              {label}
            </button>
          ))}
        </div>
        
        <div className="timeline-placeholder">
          <div className="timeline-grid"></div>
          <svg className="timeline-wave" viewBox="0 0 480 120" preserveAspectRatio="none">
            <path d={currentStats.wave} fill="none" stroke="url(#waveGradient)" strokeWidth="2" />
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF9500" />
                <stop offset="100%" stopColor="#007AFF" />
              </linearGradient>
            </defs>
          </svg>
          <div className="placeholder-caption" style={{ position: 'absolute', bottom: '8px', right: '12px' }}>
            Timeline Preview - {ranges.find(r => r.key === range)?.label}
          </div>
        </div>
        
        <div className="timeline-stats">
          <div className="stat-card">
            <div className="stat-label">Peak usage</div>
            <div className="stat-value">{currentStats.peak}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Average usage</div>
            <div className="stat-value">{currentStats.average}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Notable events</div>
            <div className="stat-value">{currentStats.events}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const InstructionsSection: React.FC = () => {
  const instructions = [
    "Download Flux and save it to your Downloads folder.",
    "Open Finder and navigate to Applications. Drag the Flux app into your Applications folder.",
    "Open Applications and double-click Flux to launch it for the first time.",
    'macOS will show a security warning saying the app is from an "unidentified developer." This is normal and safe.',
    'Go to System Settings → Privacy & Security, scroll down, and click "Open Anyway" next to Flux. Confirm with your password if prompted.',
    "Flux will now launch. Find the Flux icon in your menu bar and click it to open preferences and customize your settings."
  ];

  return (
    <section id="instructions" className="instructions">
      <div className="main-wrapper">
        <div className="instructions-header">
          <h2 className="instructions-title">Getting started with Flux is simple.</h2>
          <p className="instructions-subtitle">Follow these steps to install Flux and start monitoring your Mac's performance.</p>
        </div>
        
        <div className="instructions-list">
          {instructions.map((instruction, index) => (
            <div key={index} className="instruction-item">
              <div className="instruction-number">{index + 1}</div>
              <div className="instruction-text">{instruction}</div>
            </div>
          ))}
        </div>

        <div className="security-note">
          <h4 className="security-note-title">Why this message appears</h4>
          <p className="security-note-text">
            macOS shows this warning for apps downloaded outside the App Store as a security measure. It's a normal part of how the system protects your Mac. Since Flux is a trusted indie app, you can safely override this warning by following the steps above.
          </p>
        </div>
        
        <div className="download-callout">
          <h4>Ready to get started?</h4>
          <Button 
            label="Download for macOS" 
            variant="primary" 
            onClick={downloadFlux}
          />
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="main-wrapper">
        <div className="footer-text">
          Flux · macOS menu bar performance monitor<br />
          © 2025 Flux
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <Hero />
      <FeatureStrip />
      <ProductDetailsSection />
      <TimelineSection />
      <InstructionsSection />
      <Footer />
      <Analytics />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

export default App;
