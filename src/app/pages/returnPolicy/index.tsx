import React from 'react';
// import './PolicyPages.css';

const ReturnPolicy = () => {
  return (
    <div className="policy-container">
      <div className="policy-header">
        <i className="fas fa-undo-alt policy-icon"></i>
        <h1>Return Policy</h1>
        <p>Hassle-free returns for your complete satisfaction</p>
      </div>
      
      <div className="policy-content">
        <div className="policy-section">
          <h2><i className="fas fa-calendar-check"></i> 30-Day Return Window</h2>
          <p>We offer 30-day returns from the date of delivery for unworn items in original condition.</p>
        </div>

        <div className="policy-section">
          <h2><i className="fas fa-exchange-alt"></i> Return Process</h2>
          <ol>
            <li>Contact our customer service team</li>
            <li>Receive your return authorization</li>
            <li>Ship items back with provided label</li>
            <li>Receive refund within 5-7 business days</li>
          </ol>
        </div>

        <div className="policy-section">
          <h2><i className="fas fa-exclamation-circle"></i> Non-Returnable Items</h2>
          <ul>
            <li>Custom or personalized jewelry</li>
            <li>Earrings for hygiene reasons</li>
            <li>Items without original packaging</li>
            <li>Damaged or altered products</li>
          </ul>
        </div>

        <div className="policy-section highlight">
          <h2><i className="fas fa-star"></i> Easy Exchange</h2>
          <p>Prefer a different size or style? We offer free exchanges within 30 days of purchase.</p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;