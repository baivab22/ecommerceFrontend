import React from 'react';

const TermsAndConditions = () => {
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f5f5;
        }

        .terms-wrapper {
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .terms-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .terms-header {
          text-align: center;
          padding: 60px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 20px;
          margin-bottom: 40px;
          box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
        }

        .terms-icon {
          font-size: 64px;
          margin-bottom: 20px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .terms-header h1 {
          font-size: 3rem;
          margin: 20px 0;
          font-weight: 700;
          letter-spacing: -1px;
        }

        .last-updated {
          font-size: 1rem;
          opacity: 0.95;
          margin: 15px 0;
          font-weight: 300;
        }

        .intro-text {
          font-size: 1.1rem;
          margin-top: 25px;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.8;
          font-weight: 300;
        }

        .terms-content {
          background: white;
          padding: 50px;
          border-radius: 20px;
          box-shadow: 0 5px 30px rgba(0,0,0,0.1);
        }

        .terms-section {
          margin-bottom: 45px;
          padding-bottom: 35px;
          border-bottom: 2px solid #f0f0f0;
        }

        .terms-section:last-of-type {
          border-bottom: none;
          margin-bottom: 0;
        }

        .terms-section h2 {
          color: #667eea;
          font-size: 1.75rem;
          margin-bottom: 20px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .terms-section h2 i {
          font-size: 1.5rem;
          min-width: 30px;
        }

        .terms-section h3 {
          color: #333;
          font-size: 1.3rem;
          margin: 20px 0 15px 0;
          font-weight: 600;
        }

        .terms-section p {
          margin: 15px 0;
          line-height: 1.9;
          color: #444;
          font-size: 1.05rem;
        }

        .terms-section ul {
          margin: 20px 0;
          padding-left: 30px;
        }

        .terms-section li {
          margin: 12px 0;
          line-height: 1.8;
          color: #444;
          font-size: 1.05rem;
          position: relative;
          padding-left: 10px;
        }

        .terms-section li::marker {
          color: #667eea;
          font-weight: bold;
        }

        .terms-section strong {
          color: #333;
          font-weight: 600;
        }

        .highlight-box {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          padding: 20px 25px;
          border-radius: 12px;
          margin: 20px 0;
          border-left: 5px solid #c7365f;
        }

        .highlight-box p {
          color: white;
          margin: 8px 0;
        }

        .highlight-box strong {
          color: white;
        }

        .info-box {
          background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
          padding: 20px 25px;
          border-radius: 12px;
          margin: 20px 0;
          border-left: 5px solid #79d4cf;
        }

        .info-box p {
          color: #333;
          margin: 8px 0;
        }

        .contact-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px;
          border-radius: 20px;
          margin-top: 50px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
        }

        .contact-section h3 {
          font-size: 2rem;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          color: white;
        }

        .contact-section p {
          margin: 12px 0;
          line-height: 1.8;
          font-size: 1.1rem;
          color: white;
        }

        .contact-details {
          margin-top: 25px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 1.1rem;
        }

        .contact-item i {
          font-size: 1.3rem;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .terms-wrapper {
            padding: 10px;
          }

          .terms-header {
            padding: 40px 20px;
            margin-bottom: 25px;
            border-radius: 15px;
          }

          .terms-icon {
            font-size: 48px;
          }

          .terms-header h1 {
            font-size: 2rem;
          }

          .last-updated {
            font-size: 0.9rem;
          }

          .intro-text {
            font-size: 0.95rem;
            padding: 0 10px;
            line-height: 1.7;
          }

          .terms-content {
            padding: 30px 20px;
            border-radius: 15px;
          }

          .terms-section {
            margin-bottom: 35px;
            padding-bottom: 25px;
          }

          .terms-section h2 {
            font-size: 1.4rem;
            flex-wrap: wrap;
            gap: 10px;
          }

          .terms-section h2 i {
            font-size: 1.3rem;
          }

          .terms-section h3 {
            font-size: 1.15rem;
          }

          .terms-section p {
            font-size: 0.95rem;
            line-height: 1.7;
          }

          .terms-section ul {
            padding-left: 25px;
          }

          .terms-section li {
            font-size: 0.95rem;
            line-height: 1.7;
            padding-left: 5px;
          }

          .highlight-box,
          .info-box {
            padding: 15px 20px;
            margin: 15px 0;
          }

          .contact-section {
            padding: 30px 20px;
            margin-top: 30px;
            border-radius: 15px;
          }

          .contact-section h3 {
            font-size: 1.5rem;
            flex-direction: column;
            gap: 10px;
          }

          .contact-section p {
            font-size: 0.95rem;
          }

          .contact-item {
            font-size: 0.95rem;
            flex-wrap: wrap;
          }

          .contact-item i {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 480px) {
          .terms-header {
            padding: 30px 15px;
          }

          .terms-icon {
            font-size: 40px;
          }

          .terms-header h1 {
            font-size: 1.6rem;
          }

          .intro-text {
            font-size: 0.9rem;
          }

          .terms-content {
            padding: 20px 15px;
          }

          .terms-section h2 {
            font-size: 1.2rem;
          }

          .terms-section h3 {
            font-size: 1.05rem;
          }

          .terms-section p,
          .terms-section li {
            font-size: 0.9rem;
          }

          .terms-section ul {
            padding-left: 20px;
          }

          .highlight-box,
          .info-box {
            padding: 12px 15px;
          }

          .contact-section {
            padding: 25px 15px;
          }

          .contact-section h3 {
            font-size: 1.3rem;
          }

          .contact-section p,
          .contact-item {
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="terms-wrapper">
        <div className="terms-container">
          <div className="terms-header">
            <div className="terms-icon">📜</div>
            <h1>Terms & Conditions</h1>
            <p className="last-updated" style={{color:'white'}}>Last updated: October 2025</p>
            <p className="intro-text">
              Welcome to Abhushan Gallery. By accessing or using our website and placing orders with us, 
              you agree to these Terms & Conditions. If you do not agree, please do not use our Website or purchase from us.
            </p>
          </div>
          
          <div className="terms-content">
            {/* Section 1: Definitions */}
            <div className="terms-section">
              <h2><i className="fas fa-book"></i> 1. Definitions</h2>
              <ul>
                <li>
                  <strong>Abhushan Gallery</strong>, "we", "us", "our" refers to the owner/operator 
                  of the website and business, located in Nepal.
                </li>
                <li>
                  <strong>Customer</strong>, "you", "your" means anyone visiting, browsing or 
                  placing an order on the Website.
                </li>
                <li>
                  <strong>Products</strong> means imitation jewellery items and accessories offered 
                  for sale by Abhushan Gallery.
                </li>
              </ul>
            </div>

            {/* Section 2: Business Registration */}
            <div className="terms-section">
              <h2><i className="fas fa-certificate"></i> 2. Business Registration & Legal Compliance</h2>
              <ul>
                <li>
                  Abhushan Gallery is registered with the appropriate business registration 
                  authority in Nepal.
                </li>
                <li>
                  We comply with the <strong>E-Commerce Act, 2025</strong> (or the relevant 
                  Electronic Business / E-Commerce law) in Nepal, which requires all online 
                  sellers to be registered with the Department of Commerce, Supplies, and 
                  Consumer Protection.
                </li>
                <li>
                  We maintain accurate information about our business, our products, delivery 
                  terms, prices, etc., as mandated by law.
                </li>
              </ul>
            </div>

            {/* Section 3: Website Use */}
            <div className="terms-section">
              <h2><i className="fas fa-desktop"></i> 3. Website Use</h2>
              <ul>
                <li>
                  You must be at least 18 years old (or of legal age) to purchase from us.
                </li>
                <li>
                  You agree to use the Website lawfully and not engage in prohibited behaviour, 
                  including but not limited to fraud, infringing intellectual property, spamming, 
                  or uploading malicious content.
                </li>
              </ul>
            </div>

            {/* Section 4: Orders & Acceptance */}
            <div className="terms-section">
              <h2><i className="fas fa-shopping-cart"></i> 4. Orders & Acceptance</h2>
              <ul>
                <li>
                  Placing an order on our Website constitutes an offer to purchase. We reserve 
                  the right to accept or reject any order for any reason (e.g. product out of 
                  stock, pricing error).
                </li>
                <li>
                  Once we accept your order, we will confirm by sending an order confirmation 
                  (by email or otherwise), making the contract binding.
                </li>
              </ul>
            </div>

            {/* Section 5: Prices & Payment */}
            <div className="terms-section">
              <h2><i className="fas fa-money-bill-wave"></i> 5. Prices & Payment</h2>
              <ul>
                <li>
                  All prices are in Nepalese Rupees (NPR) (unless otherwise stated).
                </li>
                <li>
                  Prices shown include all taxes required under Nepal law (e.g. VAT) unless 
                  otherwise specified.
                </li>
                <li>
                  Payment methods accepted will be listed at checkout (e.g. bank transfer, 
                  online payment gateway, cash on delivery if applicable).
                </li>
                <li>
                  If you use COD or deferred payment, you may incur additional charges 
                  (delivery or handling).
                </li>
              </ul>
            </div>

            {/* Section 6: Product Information */}
            <div className="terms-section">
              <h2><i className="fas fa-gem"></i> 6. Product Information & Availability</h2>
              <ul>
                <li>
                  We try to ensure that the product images, descriptions, specifications 
                  (size, weight, materials) are accurate. However, because jewellery is made 
                  by hand (if applicable), there may be slight variations.
                </li>
                <li>
                  We reserve the right to limit quantities, discontinue items, or modify 
                  product details without prior notice.
                </li>
              </ul>
            </div>

            {/* Section 7: Delivery/Shipping */}
            <div className="terms-section">
              <h2><i className="fas fa-shipping-fast"></i> 7. Delivery / Shipping</h2>
              <ul>
                <li>
                  We deliver within Nepal and internationally. For more info on international 
                  shipping, please connect with us via WhatsApp or email.
                </li>
                <li>
                  For Nepal, delivery charges, timelines, and policies will be clearly stated 
                  during checkout.
                </li>
                <li>
                  We strive to dispatch orders within a specified number of business days after 
                  payment is confirmed. Any estimated delivery date is a best estimate—delays 
                  can occur due to courier service, customs, or other factors beyond our control.
                </li>
                <li>
                  If your product does not arrive within a reasonable time, please contact us.
                </li>
              </ul>
            </div>

            {/* Section 8: Returns, Exchange & Refunds */}
            <div className="terms-section">
              <h2><i className="fas fa-undo-alt"></i> 8. Returns, Exchange & Refunds</h2>
              <div className="info-box">
                <p>
                  We have provided detailed information regarding our return, exchange, and 
                  refund policies in a separate section. We kindly request you to review that.
                </p>
              </div>
              <p>
                <strong>Cancellation:</strong> You may cancel your order before it is shipped. 
                After dispatch, cancellations may be possible under mutual agreement, subject 
                to any shipping or restocking fees.
              </p>
            </div>

            {/* Section 9: Consumer Complaints */}
            <div className="terms-section">
              <h2><i className="fas fa-headset"></i> 9. Consumer Complaints & Dispute Resolution</h2>
              <p>
                We maintain a grievance / complaint handling mechanism. You may contact us 
                with any issue. We will respond within 7 business days.
              </p>
              <div className="highlight-box">
                <p><strong>Contact Information:</strong></p>
                <p>📧 Email: Abhushangallery2023@gmail.com</p>
                <p>📱 Phone: +977 9861698400</p>
                <p>⏱️ Response Time: Within 7 business days</p>
              </div>
            </div>

            {/* Section 10: Intellectual Property */}
            <div className="terms-section">
              <h2><i className="fas fa-copyright"></i> 10. Intellectual Property Rights</h2>
              <ul>
                <li>
                  All content on the Website—images, text, logos, trademarks—is owned by 
                  Abhushan Gallery or used with appropriate permission. You agree not to copy, 
                  reproduce, distribute, or use our content without our express consent.
                </li>
                <li>
                  Customers are permitted to view and order products for personal use; resale 
                  without authorization is prohibited.
                </li>
              </ul>
            </div>

            {/* Section 11: Privacy & Data Protection */}
            <div className="terms-section">
              <h2><i className="fas fa-shield-alt"></i> 11. Privacy & Data Protection</h2>
              <ul>
                <li>
                  We collect customer data (name, address, email, phone, payment info) necessary 
                  to process orders and deliver products.
                </li>
                <li>
                  We will use your data only for the purposes disclosed (order fulfillment, 
                  customer service, marketing if consented, etc.).
                </li>
                <li>
                  We take reasonable security measures to protect your data.
                </li>
                <li>
                  We will not share your personal data with third parties except for those 
                  necessary to fulfil your order (e.g. courier service), legal obligations, 
                  or with your consent.
                </li>
              </ul>
            </div>

            {/* Section 12: Liability & Indemnification */}
            <div className="terms-section">
              <h2><i className="fas fa-balance-scale"></i> 12. Liability & Indemnification</h2>
              <ul>
                <li>
                  We are not liable for any indirect, incidental, consequential or punitive 
                  damages arising from your use of the Website or purchase of products beyond 
                  what is legally permitted.
                </li>
                <li>
                  Our liability for defective or non-compliant goods is limited to replacement, 
                  repair, or refund as per these Terms.
                </li>
                <li>
                  You agree to indemnify us against any loss, liability, claim or demand caused 
                  by your breach of these Terms or misuse of the Website.
                </li>
              </ul>
            </div>

            {/* Section 13: Applicable Law */}
            <div className="terms-section">
              <h2><i className="fas fa-gavel"></i> 13. Applicable Law & Jurisdiction</h2>
              <p>
                These Terms are governed by and construed in accordance with the laws of Nepal, 
                including:
              </p>
              <ul>
                <li>E-Commerce Act, 2025</li>
                <li>Consumer Protection Act</li>
                <li>Electronic Transactions Act</li>
                <li>Other relevant statutes</li>
              </ul>
            </div>

            {/* Section 14: Changes to Terms */}
            <div className="terms-section">
              <h2><i className="fas fa-edit"></i> 14. Changes to Terms</h2>
              <ul>
                <li>
                  We may modify these Terms at any time. Changes become effective when posted 
                  on this Website (date updated at top).
                </li>
                <li>
                  If you continue using the Website after changes are posted, that constitutes 
                  acceptance of the updated Terms.
                </li>
              </ul>
            </div>

            {/* Section 15: Severability */}
            <div className="terms-section">
              <h2><i className="fas fa-cut"></i> 15. Severability</h2>
              <p>
                If any provision of these Terms is found invalid or unenforceable under 
                applicable law, that provision shall be severed, and the remaining provisions 
                shall continue in full force.
              </p>
            </div>

            {/* Contact Section */}
            <div className="contact-section">
              <h3><i className="fas fa-envelope"></i> Questions?</h3>
              <p>If you have any questions about these Terms, please contact us:</p>
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-store"></i>
                  <strong>Abhushan Gallery</strong>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>Abhushangallery2023@gmail.com</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>+977 9861698400</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;