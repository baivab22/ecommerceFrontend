import {useNavigate} from 'react-router-dom'

export const Footer = () => {
  const navigate = useNavigate()

  return (
    <div className="footer-container">
      <div className="footer">
        <div className="footer-left">
          <div className="footer-left-subTitle">Care</div>
          <div className="footer-left-linkList">
            <p
              className="footer-left-linkList-each"
              onClick={() => {
                navigate('/shipping-policy')
              }}
            >
              Shipping Policy
            </p>
            <p className="footer-left-linkList-each"
                 onClick={() => {
                navigate('/terms-and-conditions')
              }}
            
            >Terms and Condition</p>
            <p
              className="footer-left-linkList-each"
              onClick={() => {
                navigate('/return-policy')
              }}
            >
              Return Policy
            </p>
            <p className="footer-left-linkList-each"
                 onClick={() => {
                navigate('/privacy-policy')
              }}
            
            >Privacy Policy</p>
          </div>
        </div>
        <div className="footer-middle">
          <div className="footer-middle-subTitle">About Us</div>

          <div className="footer-middle-linkList">
            <p className="footer-middle-linkList-each"
                
               onClick={() => navigate('/contact-us')}
            >Contact Us</p>
            <p className="footer-middle-linkList-each"
            
               onClick={() => navigate('/styling-guide')}
            >Styling Guide</p>
          </div>
        </div>

        <div className="footer-right">
          <div className="footer-right-subTitle">About Us</div>

          <div className="footer-right-linkList">
            <p className="footer-right-linkList-each">Contact Us</p>
            <p className="footer-right-linkList-each">Styling Guide</p>
          </div>
        </div>
      </div>
    </div>
  )
}
