import React from 'react';
// import './PolicyPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="policy-container">
      <div className="policy-header">
        <i className="fas fa-shield-alt policy-icon"></i>
        <h1>Privacy Policy</h1>
        <p>Your privacy is our priority</p>
      </div>
      
      <div className="policy-content">
        <div className="policy-section">
          <h2><i className="fas fa-info-circle"></i> Information We Collect</h2>
          <ul>
            <li>Personal details (name, email, address)</li>
            <li>Payment information (processed securely)</li>
            <li>Browsing behavior and preferences</li>
            <li>Communication history</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2><i className="fas fa-lock"></i> How We Use Your Information</h2>
          <p>We use your information to process orders, improve our services, and provide personalized shopping experiences.</p>
        </div>

        <div className="policy-section">
          <h2><i className="fas fa-share-alt"></i> Data Sharing</h2>
          <p>We never sell your personal data. We only share information with trusted partners for order fulfillment and payment processing.</p>
        </div>

        <div className="policy-section">
          <h2><i className="fas fa-cookie"></i> Cookies & Tracking</h2>
          <p>We use cookies to enhance your shopping experience. You can control cookie preferences through your browser settings.</p>
        </div>

        <div className="policy-note highlight">
          <p><strong>Your Rights:</strong> You can access, correct, or delete your personal information at any time by contacting us.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;