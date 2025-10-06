import { useNavigate } from 'react-router-dom'
import { Mail, MessageSquare, Bell, Facebook, Instagram, Twitter, MapPin, Phone, Clock } from 'lucide-react'
import { FaTiktok } from 'react-icons/fa'
// import './Footer.scss'

export const Footer = () => {
  const navigate = useNavigate()

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          
          {/* Care Section */}
          <div className="footer__section">
            <h3 className="footer__title">
              Customer Care
            </h3>
            <ul className="footer__list">
              <li>
                <button 
                  className="footer__link"
                  onClick={() => navigate('/shipping-policy')}
                >
                  Shipping Policy
                </button>
              </li>
              <li>
                <button 
                  className="footer__link"
                  onClick={() => navigate('/terms-and-conditions')}
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button 
                  className="footer__link"
                  onClick={() => {
                    
                    console.log("return policy clicked")
                    navigate('/return-policy')}}
                >
                  Return Policyyyyyy
                </button>
              </li>
              <li>
                <button 
                  className="footer__link"
                  onClick={() => navigate('/privacy-policy')}
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div className="footer__section">
            <h3 className="footer__title">
              Contact Us
            </h3>
            <ul className="footer__list">
              <li>
                <button 
                  className="footer__link"
                  onClick={() => navigate('/contact-us')}
                >
                  <Phone className="footer__icon" />
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  className="footer__link"
                  onClick={() => navigate('/styling-guide')}
                >
                  Styling Guide
                </button>
              </li>
              {/* <li>
                <button 
                  className="footer__link"
                  onClick={() => navigate('/about')}
                >
                  Our Story
                </button>
              </li> */}
            </ul>
            
            {/* Contact Info */}
            <div className="footer__contact-info">
              <div className="footer__contact-item">
                <MapPin className="footer__contact-icon" />
                <span>Kalimati, Kathmandu</span>
              </div>
              <div className="footer__contact-item">
                <Phone className="footer__contact-icon" />
                <span>+977-9861394245</span>
              </div>
              <div className="footer__contact-item">
                <Clock className="footer__contact-icon" />
                <span>Mon-Fri: 9AM-6PM EST</span>
              </div>
            </div>
          </div>

          {/* Social Section */}
          <div className="footer__section">
            <h3 className="footer__title">
              Follow Us
            </h3>
            <div className="footer__social">
              <a 
                href="https://www.facebook.com/PEPPERCOPY" 
                target="_blank" 
                rel="noreferrer" 
                className="footer__social-link"
              >
                <Facebook className="footer__social-icon" />
                <span>Facebook</span>
              </a>
              <a 
                href="https://www.instagram.com/abhushan.gallery/" 
                target="_blank" 
                rel="noreferrer" 
                className="footer__social-link"
              >
                <Instagram className="footer__social-icon" />
                <span>Instagram</span>
              </a>
              <a 
                href="https://www.tiktok.com/@abhushangallery" 
                target="_blank" 
                rel="noreferrer" 
                className="footer__social-link"
              >
                <FaTiktok className="footer__social-icon" />
                <span>Tiktok</span>
              </a>
            </div>
            
            <div className="footer__social-stats">
              <div className="footer__stat">
                <span className="footer__stat-number">100K+</span>
                <span className="footer__stat-label">Followers</span>
              </div>
              <div className="footer__stat">
                <span className="footer__stat-number">1M+</span>
                <span className="footer__stat-label">Likes</span>
              </div>
            </div>
          </div>

          {/* Stay Updated Section */}
          <div className="footer__section">
            <h3 className="footer__title">
              Stay Updated
            </h3>
            <div className="footer__updates">
              <div className="footer__update-options">
                <div className="footer__update-item">
                  <div className="footer__update-header">
                    {/* <Mail className="footer__update-icon" /> */}
                    {/* <h4 className="footer__update-title">Email Newsletter</h4> */}
                  </div>
                  <p className="footer__update-text">Weekly updates & exclusive offers</p>
                </div>
                
                {/* <div className="footer__update-item">
                  <div className="footer__update-header">
                    <MessageSquare className="footer__update-icon" />
                    <h4 className="footer__update-title">SMS Alerts</h4>
                  </div>
                  <p className="footer__update-text">Flash sales & urgent updates</p>
                </div> */}
                
                <div className="footer__update-item">
                  {/* <div className="footer__update-header">
                    <Bell className="footer__update-icon" />
                    <h4 className="footer__update-title">Push Notifications</h4>
                  </div> */}
                  <p className="footer__update-text">Instant product launches</p>
                </div>
              </div>
              
              {/* <div className="footer__newsletter">
                <div className="footer__newsletter-header">
                  <Mail className="footer__newsletter-icon" />
                  <p className="footer__description">
                    Join 10,000+ subscribers for the latest news and exclusive deals.
                  </p>
                </div>
                <form className="footer__form">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="footer__input"
                  />
                  <button
                    type="submit"
                    className="footer__button"
                  >
                    Subscribe Now
                  </button>
                </form>
                <div className="footer__newsletter-benefits">
                  <span className="footer__benefit">✓ No spam, unsubscribe anytime</span>
                  <span className="footer__benefit">✓ Exclusive member discounts</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p className="footer__copyright">
              © {new Date().getFullYear()} Abhushan Gallery. All rights reserved.
            </p>
            {/* <div className="footer__bottom-links">
              <button 
                onClick={() => navigate('/sitemap')}
                className="footer__link footer__link--small"
              >
                Sitemap
              </button>
              <button 
                onClick={() => navigate('/accessibility')}
                className="footer__link footer__link--small"
              >
                Accessibility
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  )
}