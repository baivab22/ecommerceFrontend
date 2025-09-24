import React from 'react';
// import './PolicyPages.css';

const TermsAndConditions = () => {
  return (
    <div className="policy-container">
      <div className="policy-header">
        <i className="fas fa-file-contract policy-icon"></i>
        <h1>Terms & Conditions</h1>
        <p>Understanding your rights and responsibilities</p>
      </div>
      
      <div className="policy-content">
        <div className="policy-section">
          <h2><i className="fas fa-user"></i> Account Registration</h2>
          <p>By creating an account, you agree to provide accurate information and maintain account security.</p>
        </div>

        <div className="policy-section">
          <h2><i className="fas fa-shopping-cart"></i> Orders & Payments</h2>
          <ul>
            <li>All orders are subject to product availability</li>
            <li>Prices are subject to change without notice</li>
            {/* <li>We accept major credit cards and PayPal</li> */}
            <li>Orders are processed within 24 hours</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2><i className="fas fa-gem"></i> Product Information</h2>
          <p>We make every effort to display accurate product images and descriptions. Minor variations may occur.</p>
        </div>

        <div className="policy-section">
          <h2><i className="fas fa-ban"></i> Prohibited Uses</h2>
          <ul>
            <li>Fraudulent activities are strictly prohibited</li>
            <li>Unauthorized commercial use of our website</li>
            <li>Attempting to interfere with website security</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;