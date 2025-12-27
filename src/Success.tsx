import React from 'react';
import './success.css';

interface SuccessProps {
  onNavigate: (page: string) => void;
}

const Success: React.FC<SuccessProps> = ({ onNavigate }) => {
  const instructions = [
    "Download Flux and save it to your Downloads folder.",
    "Open Finder and navigate to Applications. Drag the Flux app into your Applications folder.",
    "Open Applications and double-click Flux to launch it for the first time.",
    'macOS will show a security warning saying the app is from an "unidentified developer." This is normal and safe.',
    'Go to System Settings → Privacy & Security, scroll down, and click "Open Anyway" next to Flux. Confirm with your password if prompted.',
    "Flux will now launch. Find the Flux icon in your menu bar and click it to open preferences and customize your settings."
  ];

  return (
    <div className="success-container">
      <div className="success-content">
        <div className="success-header">
          <h1 className="success-title">Success! Enjoy Flux</h1>
          <p className="success-subtitle">Your download has started. Follow the instructions below to get up and running.</p>
        </div>

        <div className="success-instructions">
          <h2 className="instructions-heading">Installation Instructions</h2>
          <div className="instructions-list">
            {instructions.map((instruction, index) => (
              <div key={index} className="instruction-item">
                <div className="instruction-number">{index + 1}</div>
                <div className="instruction-text">{instruction}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="success-footer">
          <button 
            className="back-button"
            onClick={() => onNavigate('home')}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;
