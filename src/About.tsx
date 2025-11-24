import React, { useEffect, useState } from 'react';
import './about.css';

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

const AnimatedReveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
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

const PlaceholderFrame: React.FC<{ label: string; height?: string }> = ({ label, height = '280px' }) => {
  return (
    <div className="placeholder-frame" style={{ height }}>
      <div className="placeholder-glow"></div>
      <div className="placeholder-content">
        <svg className="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 3v18" />
        </svg>
        <span className="placeholder-label">{label}</span>
      </div>
    </div>
  );
};

const PillarCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="pillar-card">
      <div className="pillar-icon">{icon}</div>
      <h3 className="pillar-title">{title}</h3>
      <p className="pillar-description">{description}</p>
    </div>
  );
};

const HeadlineBlock: React.FC<{ overline?: string; headline: string; subheadline?: string }> = ({
  overline,
  headline,
  subheadline,
}) => {
  return (
    <div className="headline-block">
      {overline && <div className="overline">{overline}</div>}
      <h2 className="main-headline">{headline}</h2>
      {subheadline && <p className="subheadline">{subheadline}</p>}
    </div>
  );
};

const Section: React.FC<{ id?: string; children: React.ReactNode; className?: string }> = ({
  id,
  children,
  className = '',
}) => {
  return (
    <section id={id} className={`about-section ${className}`}>
      <div className="main-wrapper">{children}</div>
    </section>
  );
};

const About: React.FC<{ onNavigate?: (section: string) => void; scrollToSection?: (id: string) => void }> = ({ onNavigate, scrollToSection: parentScrollToSection }) => {
  const scrollToSection = (id: string) => {
    if (parentScrollToSection) {
      parentScrollToSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    if (onNavigate) {
      onNavigate(id);
    }
  };


  return (
    <div className="about-page">
      {/* Hero Statement Section */}
      <Section id="about" className="hero-statement">
        <AnimatedReveal>
          <HeadlineBlock
            overline="About Flux"
            headline="Built for people who want clarity, not clutter."
            subheadline="Flux was designed to help you understand your Mac at a glance — without noise, distractions, or overwhelm."
          />
        </AnimatedReveal>
      </Section>

      {/* Origin Story Section */}
      <Section className="origin-story">
        <div className="origin-grid">
          <AnimatedReveal className="origin-text">
            <h3 className="section-title">Why Flux Exists</h3>
            <p className="origin-paragraph">
              macOS performance tools were loud, cluttered, and designed for system administrators—not for the people who actually use their Macs to create, build, and think.
            </p>
            <p className="origin-paragraph">
              We built Flux to be the simplest way to understand your Mac. No charts screaming at you. No overwhelming dashboards. Just clarity, when you need it.
            </p>
            <p className="origin-paragraph">
              Flux is designed for creators, developers, students, and power users who care about their tools being intentional, minimal, and respectful of their attention.
            </p>
          </AnimatedReveal>
          <AnimatedReveal className="origin-visual">
            <img src="/perf.png" alt="Flux Performance Monitor" className="origin-image" />
          </AnimatedReveal>
        </div>
      </Section>

      {/* What Makes Flux Different Section */}
      <Section className="pillars-section">
        <AnimatedReveal>
          <HeadlineBlock
            headline="What Makes Flux Different"
            subheadline="Three principles that guide every design decision."
          />
        </AnimatedReveal>

        <div className="pillars-grid">
          <AnimatedReveal>
            <PillarCard
              title="Minimal by Design"
              description="No charts screaming at you. No cluttered UI. Just clarity. Flux shows you what matters and gets out of the way."
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              }
            />
          </AnimatedReveal>

          <AnimatedReveal>
            <PillarCard
              title="Instant Understanding"
              description="Rings and timeline view give you insight within seconds—not minutes. See your Mac's state at a glance."
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              }
            />
          </AnimatedReveal>

          <AnimatedReveal>
            <PillarCard
              title="Built for macOS"
              description="Designed for performance, efficiency, and never getting in your way. Flux respects your Mac and your workflow."
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5z" />
                  <path d="M9 17h6" />
                </svg>
              }
            />
          </AnimatedReveal>
        </div>
      </Section>

      {/* Designed for Real People Section */}
      <Section className="real-people-section">
        <AnimatedReveal>
          <HeadlineBlock
            headline="Designed for Real People"
            subheadline="Flux works for anyone who cares about their Mac's performance."
          />
        </AnimatedReveal>

        <div className="people-grid">
          <AnimatedReveal className="people-card">
            <h4 className="people-title">Creators</h4>
            <p className="people-description">Keep your Mac cool during video edits, renders, and creative sessions. Know when your system is under stress.</p>
          </AnimatedReveal>

          <AnimatedReveal className="people-card">
            <h4 className="people-title">Developers</h4>
            <p className="people-description">Monitor builds, processes, and resource usage. Understand what's consuming your system during development.</p>
          </AnimatedReveal>

          <AnimatedReveal className="people-card">
            <h4 className="people-title">Students</h4>
            <p className="people-description">Keep apps under control during work sessions. Ensure your Mac stays responsive when you need it most.</p>
          </AnimatedReveal>
        </div>

        <AnimatedReveal className="people-visual">
          <img src="/performance.png" alt="Usage Insights" className="people-image" />
        </AnimatedReveal>
      </Section>

      {/* Product Philosophy Section */}
      <Section className="philosophy-section">
        <AnimatedReveal>
          <div className="philosophy-content">
            <h2 className="philosophy-headline">Software should get out of the way.</h2>
            <div className="philosophy-grid">
              <div className="philosophy-point">
                <h4>Quiet when everything is fine</h4>
                <p>Flux doesn't demand your attention. It sits in your menu bar, watching silently, only speaking up when it matters.</p>
              </div>
              <div className="philosophy-point">
                <h4>Loud when it matters</h4>
                <p>When your Mac needs you, Flux alerts you with clarity and urgency. No missed warnings, no false alarms.</p>
              </div>
              <div className="philosophy-point">
                <h4>Treats attention as valuable</h4>
                <p>Your focus is precious. Flux respects that. Every notification, every feature, every design decision is intentional.</p>
              </div>
            </div>
          </div>
        </AnimatedReveal>
      </Section>

      {/* Mission / Guarantee Section */}
      <Section className="guarantee-section">
        <AnimatedReveal>
          <div className="guarantee-content">
            <h2 className="guarantee-headline">Here's our promise.</h2>
            <div className="guarantee-badge">
              <svg className="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <ul className="guarantee-list">
              <li>Local processing only — your data never leaves your Mac</li>
              <li>No data collection — we don't track you</li>
              <li>No ads — ever</li>
              <li>No tracking — period</li>
              <li>Simple updates — when we improve, you benefit</li>
              <li>Built with intention — every detail matters</li>
            </ul>
          </div>
        </AnimatedReveal>
      </Section>

      {/* Final CTA Section */}
      <Section className="final-cta">
        <AnimatedReveal>
          <HeadlineBlock
            headline="Start understanding your Mac in seconds."
            subheadline="Flux is intentionally simple. Install it once — it works quietly forever."
          />
        </AnimatedReveal>

        <div className="cta-buttons">
          <Button label="Download for macOS" variant="primary" onClick={() => scrollToSection('download')} />
          <Button
            label="View Instructions"
            variant="secondary"
            onClick={() => scrollToSection('instructions')}
          />
        </div>
      </Section>
    </div>
  );
};

export default About;
