import React, { useState } from 'react';

export const ContactUs=()=>{
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const styles = {
    section: {
      background: 'linear-gradient(to bottom, #fce4ec, #fff)',
      padding: '60px 20px',
      // fontFamily: 'Arial, sans-serif'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '50px'
    },
    title: {
      fontSize: '2.5rem',
      color: '#c2185b',
      marginBottom: '10px'
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#666'
    },
    contentWrapper: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '40px',
      alignItems: 'flex-start'
    },
    infoSection: {
      flex: '1 1 300px',
      minWidth: '280px'
    },
    formSection: {
      flex: '1 1 500px',
      minWidth: '280px',
      background: '#fff',
      borderRadius: '15px',
      padding: '40px',
      boxShadow: '0 4px 15px rgba(244, 143, 177, 0.15)'
    },
    infoCard: {
      background: '#fff',
      borderRadius: '15px',
      padding: '30px',
      marginBottom: '20px',
      boxShadow: '0 4px 6px rgba(244, 143, 177, 0.1)'
    },
    infoItem: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '25px',
      gap: '15px'
    },
    iconBox: {
      width: '50px',
      height: '50px',
      background: 'linear-gradient(135deg, #f48fb1, #c2185b)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      flexShrink: 0
    },
    infoContent: {
      flex: 1
    },
    infoLabel: {
      fontSize: '0.9rem',
      color: '#f48fb1',
      fontWeight: '600',
      marginBottom: '5px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    infoText: {
      fontSize: '1.1rem',
      color: '#4a4a4a',
      lineHeight: '1.6'
    },
    formTitle: {
      fontSize: '1.8rem',
      color: '#c2185b',
      marginBottom: '25px',
      textAlign: 'center'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '0.95rem',
      color: '#4a4a4a',
      marginBottom: '8px',
      fontWeight: '600'
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      fontSize: '1rem',
      border: '2px solid #fce4ec',
      borderRadius: '8px',
      outline: 'none',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '12px 15px',
      fontSize: '1rem',
      border: '2px solid #fce4ec',
      borderRadius: '8px',
      outline: 'none',
      minHeight: '120px',
      resize: 'vertical',
      // fontFamily: 'Arial, sans-serif',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      background: 'linear-gradient(135deg, #f48fb1, #c2185b)',
      color: '#fff',
      padding: '15px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(244, 143, 177, 0.3)',
      transition: 'transform 0.2s ease'
    },
    mapContainer: {
      marginTop: '20px',
      borderRadius: '15px',
      overflow: 'hidden',
      height: '250px',
      boxShadow: '0 4px 6px rgba(244, 143, 177, 0.1)'
    }
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Contact Us</h1>
          <p style={styles.subtitle}>We'd love to hear from you. Get in touch with Abhushan Gallery</p>
        </div>

        <div style={styles.contentWrapper}>
          {/* Contact Information */}
          <div style={styles.infoSection}>
            <div style={styles.infoCard}>
              <div style={styles.infoItem}>
                <div style={styles.iconBox}>📍</div>
                <div style={styles.infoContent}>
                  <div style={styles.infoLabel}>Address</div>
                  <div style={styles.infoText}>
                    Kalimati, Kathmandu<br />
                    Nepal - 44600
                  </div>
                </div>
              </div>

              <div style={styles.infoItem}>
                <div style={styles.iconBox}>📞</div>
                <div style={styles.infoContent}>
                  <div style={styles.infoLabel}>Phone</div>
                  <div style={styles.infoText}>
                    +977 986-1394245
                  </div>
                </div>
              </div>

              <div style={styles.infoItem}>
                <div style={styles.iconBox}>🏪</div>
                <div style={styles.infoContent}>
                  <div style={styles.infoLabel}>Store Name</div>
                  <div style={styles.infoText}>
                    Abhushan Gallery
                  </div>
                </div>
              </div>

              <div style={styles.infoItem}>
                <div style={styles.iconBox}>⏰</div>
                <div style={styles.infoContent}>
                  <div style={styles.infoLabel}>Business Hours</div>
                  <div style={styles.infoText}>
                    Sun - Fri: 10:00 AM - 7:00 PM<br />
                    Saturday: Closed
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div style={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.3097!2d85.2799!3d27.6957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQxJzQ0LjUiTiA4NcKwMTYnNDcuNiJF!5e0!3m2!1sen!2snp!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Abhushan Gallery Location"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          {/* <div style={styles.formSection}>
            <h2 style={styles.formTitle}>Send Us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="name">Full Name *</label>
                <input
                  style={styles.input}
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  onFocus={(e) => e.target.style.borderColor = '#f48fb1'}
                  onBlur={(e) => e.target.style.borderColor = '#fce4ec'}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="email">Email Address *</label>
                <input
                  style={styles.input}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  onFocus={(e) => e.target.style.borderColor = '#f48fb1'}
                  onBlur={(e) => e.target.style.borderColor = '#fce4ec'}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="phone">Phone Number</label>
                <input
                  style={styles.input}
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={(e) => e.target.style.borderColor = '#f48fb1'}
                  onBlur={(e) => e.target.style.borderColor = '#fce4ec'}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="message">Message *</label>
                <textarea
                  style={styles.textarea}
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  onFocus={(e) => e.target.style.borderColor = '#f48fb1'}
                  onBlur={(e) => e.target.style.borderColor = '#fce4ec'}
                />
              </div>

              <button
                style={styles.button}
                type="submit"
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Send Message
              </button>
            </form>
          </div> */}
        </div>
      </div>
    </section>
  );
}