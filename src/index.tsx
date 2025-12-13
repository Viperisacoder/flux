import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import About from './About';
import DownloadSection from './DownloadSection';
import { useDownloadStats } from './hooks/useDownloadStats';

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

const Header: React.FC<{ currentPage: string; onNavigate: (page: string) => void; onDownload?: () => void; scrollToSection?: (id: string) => void }> = ({ currentPage, onNavigate, onDownload, scrollToSection }) => {
  const localScrollToSection = (id: string) => {
    if (scrollToSection) {
      scrollToSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header className="header">
      <div className="main-wrapper">
        <div className="header-content">
          <a href="#" className="wordmark" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Flux</a>
          <nav className="nav">
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
              Home
            </a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>
              About
            </a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); localScrollToSection('download'); }}>
              Download
            </a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); localScrollToSection('instructions'); }}>
              Instructions
            </a>
            <button className="download-btn-small" onClick={onDownload || (() => localScrollToSection('download'))}>
              Download
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

interface HeroProps {
  onDownload: () => void;
}

const Hero: React.FC<HeroProps> = ({ onDownload }) => {
  const { stats, loading } = useDownloadStats();
  
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
            onClick={onDownload}
          />
          <Button 
            label="View Instructions" 
            variant="secondary" 
            onClick={() => scrollToSection('instructions')}
          />
        </div>
        <div className="hero-stats">
          {!loading && stats.downloads > 0 && (
            <p className="download-count">{stats.downloads}+ downloads</p>
          )}
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
      '10m': { peak: '89% CPU', average: '34% CPU', events: '2 spikes', wave: 'M0,70 C20,65 30,50 50,55 C70,60 80,75 100,70 C120,65 130,45 150,50 C170,55 180,80 200,75 C220,70 230,55 250,60 C270,65 280,85 300,80 C320,75 330,50 350,55 C370,60 380,75 400,70 C420,65 430,45 450,50 C470,55 480,75 500,70' },
      '1h': { peak: '82% CPU', average: '28% CPU', events: '5 spikes', wave: 'M0,65 C20,60 30,35 50,45 C70,55 80,70 100,65 C120,60 130,30 150,40 C170,50 180,75 200,65 C220,55 230,35 250,45 C270,55 280,80 300,70 C320,60 330,30 350,40 C370,50 380,70 400,60 C420,50 430,30 450,40 C470,50 480,75 500,65' },
      '24h': { peak: '94% CPU', average: '31% CPU', events: '12 spikes', wave: 'M0,60 C20,55 30,20 50,35 C70,50 80,65 100,60 C120,55 130,20 150,30 C170,40 180,70 200,60 C220,50 230,20 250,35 C270,50 280,75 300,65 C320,55 330,20 350,30 C370,40 380,65 400,55 C420,45 430,20 450,30 C470,40 480,70 500,60' },
      '7d': { peak: '96% CPU', average: '29% CPU', events: '47 spikes', wave: 'M0,55 C20,50 30,10 50,25 C70,40 80,60 100,55 C120,50 130,10 150,20 C170,30 180,65 200,55 C220,45 230,10 250,25 C270,40 280,70 300,60 C320,50 330,10 350,20 C370,30 380,60 400,50 C420,40 430,10 450,20 C470,30 480,65 500,55' }
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
          <svg className="timeline-wave" viewBox="0 0 500 120" preserveAspectRatio="none">
            <path d={currentStats.wave} fill="none" stroke="url(#waveGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

interface InstructionsSectionProps {
  onDownload: () => void;
}

const InstructionsSection: React.FC<InstructionsSectionProps> = ({ onDownload }) => {
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
            macOS shows this warning for apps downloaded outside the App Store as a security measure. It's a normal part of how the system protects your Mac. Flux is a trusted indie app, and we're actively working on becoming part of Apple's developer team to provide a fully notarized experience. For now, you can safely override this warning by following the steps above.
          </p>
        </div>
        
        <div className="download-callout">
          <h4>Ready to get started?</h4>
          <Button 
            label="Download for macOS" 
            variant="primary" 
            onClick={onDownload}
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
  const [currentPage, setCurrentPage] = useState<'home' | 'about'>('home');

  const handleNavigate = (page: string) => {
    if (page === 'home' || page === 'about') {
      setCurrentPage(page);
      if (page === 'home') {
        setTimeout(() => {
          const homeEl = document.getElementById('home');
          if (homeEl) {
            homeEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 0);
      }
    }
  };

  const scrollToSection = (id: string) => {
    if (id === 'download' || id === 'instructions') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleDownload = () => {
    window.location.href = '/flux.zip';
  };

  return (
    <div className="App">
      <Header currentPage={currentPage} onNavigate={handleNavigate} onDownload={handleDownload} scrollToSection={scrollToSection} />
      {currentPage === 'home' ? (
        <>
          <Hero onDownload={handleDownload} />
          <FeatureStrip />
          <ProductDetailsSection />
          <TimelineSection />
          <DownloadSection />
          <InstructionsSection onDownload={handleDownload} />
        </>
      ) : (
        <About onNavigate={handleNavigate} scrollToSection={scrollToSection} onDownload={handleDownload} />
      )}
      <Footer />
      <Analytics />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

export default App;
