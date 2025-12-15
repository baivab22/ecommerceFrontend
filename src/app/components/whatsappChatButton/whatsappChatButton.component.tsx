// import React, { useState } from 'react';
// import { MessageCircle } from 'lucide-react';

// const WhatsAppButton = ({ phoneNumber = '1234567890', message = 'Hello! I have a question.' }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   const handleClick = () => {
//     const encodedMessage = encodeURIComponent(message);
//     const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
//     window.open(whatsappUrl, '_blank');
//   };

//   const buttonStyle = {
//     position: 'fixed',
//     bottom: '24px',
//     right: '24px',
//     zIndex: 9999,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '56px',
//     height: '56px',
//     backgroundColor: isHovered ? '#16a34a' : '#22c55e',
//     color: 'white',
//     border: 'none',
//     borderRadius: '50%',
//     cursor: 'pointer',
//     boxShadow: isHovered 
//       ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
//       : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//     transform: isHovered ? 'scale(1.1)' : 'scale(1)',
//     transition: 'all 0.3s ease',
//     outline: 'none'
//   };

//   const tooltipStyle = {
//     position: 'absolute',
//     right: '100%',
//     marginRight: '12px',
//     padding: '8px 12px',
//     backgroundColor: '#1f2937',
//     color: 'white',
//     fontSize: '14px',
//     borderRadius: '8px',
//     whiteSpace: 'nowrap',
//     pointerEvents: 'none',
//     opacity: isHovered ? 1 : 0,
//     transition: 'opacity 0.2s ease',
//     top: '50%',
//     transform: 'translateY(-50%)'
//   };

//   const pulseStyle = {
//     position: 'absolute',
//     inset: '0',
//     borderRadius: '50%',
//     backgroundColor: '#22c55e',
//     opacity: 0.75,
//     animation: 'pulse 2s cubic-bezier(0, 0, 0.2, 1) infinite'
//   };

//   return (
//     <>
//       <style>
//         {`
//           @keyframes pulse {
//             0%, 100% {
//               opacity: 0.75;
//               transform: scale(1);
//             }
//             50% {
//               opacity: 0;
//               transform: scale(1.5);
//             }
//           }
//         `}
//       </style>
//       <button
//         onClick={handleClick}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         style={buttonStyle}
//         aria-label="Chat on WhatsApp"
//       >
//         <MessageCircle style={{ width: '28px', height: '28px', position: 'relative', zIndex: 1 }} />
        
//         {/* Tooltip */}
//         <span style={tooltipStyle}>
//           Chat on WhatsApp
//         </span>
        
//         {/* Pulse animation */}
//         <span style={pulseStyle}></span>
//       </button>
//     </>
//   );
// };

// export default WhatsAppButton;


import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const SocialChatButtons = ({ 
  whatsappNumber = '1234567890', 
  whatsappMessage = 'Hello! I have a question.',
  facebookPageId = 'your-page-id' // Facebook Page ID or username
}) => {
  const [whatsappHovered, setWhatsappHovered] = useState(false);
  const [facebookHovered, setFacebookHovered] = useState(false);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFacebookClick = () => {
    // Opens Facebook Messenger
    const messengerUrl = `https://m.me/${facebookPageId}`;
    window.open(messengerUrl, '_blank');
  };

  const buttonBaseStyle = {
    position: 'fixed',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none'
  };

  const whatsappButtonStyle = {
    ...buttonBaseStyle,
    bottom: '24px',
    right: '24px',
    backgroundColor: whatsappHovered ? '#16a34a' : '#22c55e',
    boxShadow: whatsappHovered 
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    transform: whatsappHovered ? 'scale(1.1)' : 'scale(1)'
  };

  const facebookButtonStyle = {
    ...buttonBaseStyle,
    bottom: '92px', // 24px + 56px (button height) + 12px gap
    right: '24px',
    backgroundColor: facebookHovered ? '#0866FF' : '#1877F2',
    boxShadow: facebookHovered 
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    transform: facebookHovered ? 'scale(1.1)' : 'scale(1)'
  };

  const tooltipStyle = (isHovered) => ({
    position: 'absolute',
    right: '100%',
    marginRight: '12px',
    padding: '8px 12px',
    backgroundColor: '#1f2937',
    color: 'white',
    fontSize: '14px',
    borderRadius: '8px',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.2s ease',
    top: '50%',
    transform: 'translateY(-50%)'
  });

  const pulseStyle = (color) => ({
    position: 'absolute',
    inset: '0',
    borderRadius: '50%',
    backgroundColor: color,
    opacity: 0.75,
    animation: 'pulse 2s cubic-bezier(0, 0, 0.2, 1) infinite'
  });

  const facebookIconStyle = {
    width: '28px',
    height: '28px',
    position: 'relative',
    zIndex: 1
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 0.75;
              transform: scale(1);
            }
            50% {
              opacity: 0;
              transform: scale(1.5);
            }
          }
        `}
      </style>

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setWhatsappHovered(true)}
        onMouseLeave={() => setWhatsappHovered(false)}
        style={whatsappButtonStyle}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle style={{ width: '28px', height: '28px', position: 'relative', zIndex: 1 }} />
        
        <span style={tooltipStyle(whatsappHovered)}>
          Chat on WhatsApp
        </span>
        
        <span style={pulseStyle('#22c55e')}></span>
      </button>

      {/* Facebook Messenger Button */}
      <button
        onClick={handleFacebookClick}
        onMouseEnter={() => setFacebookHovered(true)}
        onMouseLeave={() => setFacebookHovered(false)}
        style={facebookButtonStyle}
        aria-label="Chat on Facebook Messenger"
      >
        {/* Facebook Messenger Icon (SVG) */}
        <svg 
          style={facebookIconStyle}
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.912 1.448 5.51 3.712 7.21V22l3.397-1.867c.906.251 1.87.384 2.891.384 5.523 0 10-4.145 10-9.243C22 6.145 17.523 2 12 2zm.993 12.416l-2.556-2.73-4.99 2.73 5.49-5.833 2.617 2.73 4.929-2.73-5.49 5.833z"/>
        </svg>
        
        <span style={tooltipStyle(facebookHovered)}>
          Chat on Facebook
        </span>
        
        <span style={pulseStyle('#1877F2')}></span>
      </button>
    </>
  );
};

export default SocialChatButtons;


