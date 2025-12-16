import React, { useState } from 'react';

export const ContactUs = () => {
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

  return (
    <section style={{
      background: 'linear-gradient(to bottom, #fce4ec, #fff)',
      padding: '60px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        <div style={{
          textAlign: 'center',
          marginBottom: '50px'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            color: '#c2185b',
            marginBottom: '10px'
          }}>
            Contact Us
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#666'
          }}>
            We'd love to hear from you. Get in touch with Abhushan Gallery
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '40px',
          alignItems: 'flex-start'
        }}>
          {/* Contact Information */}
          <div style={{
            flex: '1 1 300px',
            minWidth: '280px'
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '15px',
              padding: '30px',
              marginBottom: '20px',
              boxShadow: '0 4px 6px rgba(244, 143, 177, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '25px',
                gap: '15px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #f48fb1, #c2185b)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}>
                  📍
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#f48fb1',
                    fontWeight: '600',
                    marginBottom: '5px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Address
                  </div>
                  <div style={{
                    fontSize: '1.1rem',
                    color: '#4a4a4a',
                    lineHeight: '1.6'
                  }}>
                    Kathmandu<br />
                    Nepal - 44600
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '25px',
                gap: '15px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #f48fb1, #c2185b)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}>
                  📞
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#f48fb1',
                    fontWeight: '600',
                    marginBottom: '5px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Phone
                  </div>
                  <div style={{
                    fontSize: '1.1rem',
                    color: '#4a4a4a',
                    lineHeight: '1.6'
                  }}>
                    +977 9861698400
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '25px',
                gap: '15px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #f48fb1, #c2185b)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}>
                  🏪
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#f48fb1',
                    fontWeight: '600',
                    marginBottom: '5px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Store Name
                  </div>
                  <div style={{
                    fontSize: '1.1rem',
                    color: '#4a4a4a',
                    lineHeight: '1.6'
                  }}>
                    Abhushan Gallery
                  </div>
                </div>
              </div>

      
            </div>

            {/* Map */}
            <div style={{
              marginTop: '20px',
              borderRadius: '15px',
              overflow: 'hidden',
              height: '250px',
              boxShadow: '0 4px 6px rgba(244, 143, 177, 0.1)'
            }}>
              {/* <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.3097!2d85.2799!3d27.6957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQxJzQ0LjUiTiA4NcKwMTYnNDcuNiJF!5e0!3m2!1sen!2snp!4v1234567890"
                width="100%"
                height="100%"
                // style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Abhushan Gallery Location"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}