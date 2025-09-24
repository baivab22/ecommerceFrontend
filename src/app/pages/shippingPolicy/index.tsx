import React from 'react';


const ShippingPolicy = () => {
  return (
    <div className="policy-container">
      <div className="policy-header">
        <i className="fas fa-shipping-fast policy-icon"></i>
        <h1>Shipping Policy</h1>
        <p>Fast and secure delivery for your precious jewelry</p>
      </div>
      
      <div className="policy-content">
        <div className="policy-section">
          <h2><i className="fas fa-rocket"></i> Standard Shipping</h2>
          <ul>
            {/* <li>Free standard shipping on orders over $200</li> */}
            <li>Delivery within 5-7 business days</li>
            <li>Order processing: 1-2 business days</li>
            {/* <li>Fully insured and tracked shipments</li> */}
          </ul>
        </div>
{/* 
        <div className="policy-section">
          <h2><i className="fas fa-bolt"></i> Express Shipping</h2>
          <ul>
            <li>2-3 business day delivery</li>
            <li>$15 flat rate for express shipping</li>
            <li>Priority order processing</li>
            <li>Signature required upon delivery</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2><i className="fas fa-gift"></i> International Shipping</h2>
          <ul>
            <li>Available to 50+ countries worldwide</li>
            <li>7-14 business day delivery</li>
            <li>Customs and import duties may apply</li>
            <li>International tracking included</li>
          </ul>
        </div> */}

        <div className="policy-note">
          <p><strong>Note:</strong> All jewelry is shipped in secure, discreet packaging to ensure your privacy and safety.</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;