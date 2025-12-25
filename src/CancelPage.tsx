import React from 'react';
import './cancel.css';

const CancelPage: React.FC = () => {
  return (
    <div className="cancel-page">
      <div className="cancel-container">
        <div className="cancel-card">
          <div className="cancel-icon">✕</div>
          <h2>Payment cancelled</h2>
          <p>Your payment was not completed. No charges have been made.</p>
          
          <div className="cancel-info">
            <p>You can try again whenever you're ready.</p>
          </div>

          <a href="/" className="back-link">Back to home</a>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;
