// ContactUs.jsx
import React, { useState } from 'react';

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    orderNumber: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Thank you for your message! We will get back to you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      orderNumber: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>We're here to help with all your jewelry needs</p>
      </div>
      
      <div className="page-content">
        <div className="contact-hero">
          <p>Have questions about our jewelry, need help with an order, or want to discuss a custom piece? Our friendly team of jewelry experts is ready to assist you.</p>
        </div>

        <div className="contact-container">
          {/* Contact Information */}
          <div className="contact-info">
            <h2>Get in Touch</h2>
            
            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">📞</div>
                <div className="method-details">
                  <h3>Phone</h3>
                  <p>(555) 123-4567</p>
                  <p className="method-note">Mon-Fri: 9AM-7PM EST<br />Sat: 10AM-5PM EST</p>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">✉️</div>
                <div className="method-details">
                  <h3>Email</h3>
                  <p>hello@jewelryshop.com</p>
                  <p className="method-note">We respond within 24 hours</p>
                </div>
              </div>

              {/* <div className="contact-method">
                <div className="method-icon">💬</div>
                <div className="method-details">
                  <h3>Live Chat</h3>
                  <p>Available on our website</p>
                  <p className="method-note">Mon-Fri: 9AM-6PM EST</p>
                </div>
              </div> */}
            </div>

            <div className="store-info">
              <h3>Visit Our Showroom</h3>
              <div className="store-details">
                <p><strong>Address:</strong><br />
                123 Jewelry Lane<br />
                Downtown District<br />
                New York, NY 10001</p>
                
                <p><strong>Store Hours:</strong><br />
                Monday - Friday: 10AM - 8PM<br />
                Saturday: 10AM - 6PM<br />
                Sunday: 12PM - 5PM</p>
              </div>
            </div>

            <div className="services-info">
              <h3>Our Services</h3>
              <ul>
                <li>Custom jewelry design</li>
                <li>Jewelry repair and restoration</li>
                <li>Appraisal services</li>
                <li>Ring sizing and engraving</li>
                <li>Cleaning and maintenance</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          {/* <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="">Select a subject</option>
                    <option value="order-inquiry">Order Inquiry</option>
                    <option value="product-question">Product Question</option>
                    <option value="custom-design">Custom Design</option>
                    <option value="repair-service">Repair Service</option>
                    <option value="return-exchange">Return/Exchange</option>
                    <option value="complaint">Complaint</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="orderNumber">Order Number (if applicable)</label>
                <input
                  type="text"
                  id="orderNumber"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  placeholder="e.g., JS-2025-001234"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Please provide details about your inquiry..."
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div> */}
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How long does shipping take?</h3>
              <p>Standard shipping takes 5-7 business days. Express and overnight options are available.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer custom jewelry?</h3>
              <p>No we don't</p>
            </div>
            <div className="faq-item">
              <h3>What is your return policy?</h3>
              <p>We offer 30-day returns on most items in original condition. See our Return Policy for details.</p>
            </div>
            <div className="faq-item">
              <h3>Do you provide certificates?</h3>
              <p>No</p>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="emergency-contact">
          <h3>Need Immediate Assistance?</h3>
          <p>For urgent matters regarding your order or a special occasion, call us directly at <strong>(555) 123-4567</strong> during business hours, or email <strong>urgent@jewelryshop.com</strong> for priority response.</p>
        </div>
      </div>
    </div>
  );
};