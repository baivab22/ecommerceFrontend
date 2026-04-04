// import React from 'react';
// import { useLocation } from 'react-router-dom';

// const ReturnPolicy = () => {
//   // Use useLocation from react-router-dom for robust SPA routing (supports hash and browser history modes)
//   const location = useLocation();
//   // For hash-based routing, location.pathname may be '/' and location.hash will contain the route
//   // e.g., location.hash === '#/shipping-policy'
//   const path = location.pathname === '/' && location.hash ? location.hash.replace(/^#/, '') : location.pathname;
//   const isShipping = path === '/shipping-policy';
//   // Debug log
//   console.log('ReturnPolicy - path:', path, 'isShipping:', isShipping);
//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: '#fff',
//       padding: '2rem 1rem',
//     }}>
//       <div style={{
//         maxWidth: '56rem',
//         margin: '0 auto',
//       }}>
//         <div style={{
//           textAlign: 'center',
//           marginBottom: '3rem',
//         }}>
//           {/* <div style={{
//             display: 'inline-flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: '4rem',
//             height: '4rem',
//             background: 'linear-gradient(to bottom right, #ec4899, #f43f5e)',
//             borderRadius: '9999px',
//             marginBottom: '1rem',
//             boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
//           }}>
//             <svg style={{
//               width: '2rem',
//               height: '2rem',
//               color: 'white',
//             }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//             </svg>
//           </div> */}
//           <h1 style={{
//             fontSize: '2.25rem',
//             fontWeight: 'bold',
//             color: '#111827',
//             marginBottom: '0.5rem',
//           }}>{isShipping ? 'Shipping Policy' : 'Return & Exchange Policy'}</h1>
//           <p style={{
//             color: '#4b5563',
//             fontSize: '1rem',
//           }}>{isShipping ? 'Fast and secure delivery for your precious jewelry' : 'Your satisfaction is our priority'}</p>
//         </div>

//         {/* Exchange / Refund Section */}
//         <div style={{
//           backgroundColor: 'white',
//           borderRadius: '1rem',
//           boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
//           padding: '2rem',
//           marginBottom: '1.5rem',
//           border: '1px solid #fbcfe8',
//         }}>
//           <div style={{
//             display: 'flex',
//             alignItems: 'flex-start',
//             gap: '0.75rem',
//             marginBottom: '1rem',
//           }}>
//             <div style={{
//               flexShrink: 0,
//               width: '2.5rem',
//               height: '2.5rem',
//               background: 'linear-gradient(to bottom right, #ec4899, #f43f5e)',
//               borderRadius: '0.5rem',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}>
//               <svg style={{
//                 width: '1.5rem',
//                 height: '1.5rem',
//                 color: 'white',
//               }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//               </svg>
//             </div>
//             <h2 style={{
//               fontSize: '1.5rem',
//               fontWeight: 'bold',
//               color: '#111827',
//               margin: 0,
//             }}>Exchange / Refund</h2>
//           </div>
//           <div>
//             <p style={{
//               color: '#374151',
//               lineHeight: '1.75',
//               marginBottom: '1rem',
//             }}>
//               If you receive a <span style={{fontWeight: '600', color: '#111827'}}>damaged or incorrect product</span>, we will provide a <span style={{fontWeight: '600', color: '#ec4899'}}>full exchange</span> or a <span style={{fontWeight: '600', color: '#ec4899'}}>refund</span> if the same product is unavailable.
//             </p>
            
//             <div style={{
//               backgroundColor: '#fdf2f8',
//               borderLeft: '4px solid #ec4899',
//               padding: '1rem',
//               borderRadius: '0 0.5rem 0.5rem 0',
//               marginBottom: '1rem',
//             }}>
//               <div style={{
//                 display: 'flex',
//                 alignItems: 'flex-start',
//                 gap: '0.75rem',
//               }}>
//                 <svg style={{
//                   width: '1.5rem',
//                   height: '1.5rem',
//                   color: '#ec4899',
//                   flexShrink: 0,
//                   marginTop: '0.125rem',
//                 }} fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                 </svg>
//                 <div>
//                   <p style={{fontWeight: '600', color: '#831843', marginBottom: '0.25rem'}}>📸 Important:</p>
//                   <p style={{color: '#831843'}}>An <span style={{fontWeight: '600'}}>unboxing video</span> (from the moment you open the parcel) is <span style={{fontWeight: '600'}}>mandatory</span> for all claims.</p>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <p style={{fontWeight: '600', color: '#111827', marginBottom: '0.75rem'}}>Please report the issue within <span style={{color: '#dc2626'}}>24 hours of delivery</span> via:</p>
//               <div style={{
//                 marginLeft: '1rem',
//                 marginTop: '0.75rem',
//               }}>
//                 <div style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '0.75rem',
//                   marginBottom: '0.75rem',
//                 }}>
//                   <svg style={{
//                     width: '1.25rem',
//                     height: '1.25rem',
//                     color: '#ec4899'
//                   }} fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                     <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                   </svg>
//                   <span style={{color: '#374151', lineHeight: '1.75'}}><span style={{fontWeight: '600'}}>Email:</span> <a href="mailto:abhushangallery2023@gmail.com" style={{color: '#ec4899', textDecoration: 'none'}}>abhushangallery2023@gmail.com</a></span>
//                 </div>
//                 <div style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '0.75rem',
//                   marginBottom: '0.75rem',
//                 }}>
//                   <svg style={{
//                     width: '1.25rem',
//                     height: '1.25rem',
//                     color: '#22c55e'
//                   }} fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
//                   </svg>
//                   <span style={{color: '#374151', lineHeight: '1.75'}}><span style={{fontWeight: '600'}}>WhatsApp:</span> <a href="https://wa.me/9779861698400" style={{color: '#22c55e', textDecoration: 'none'}}>+977 9861698400</a></span>
//                 </div>
//               </div>
//             </div>

//             <p style={{
//               color: '#374151',
//               lineHeight: '1.75',
//               marginBottom: '1rem',
//             }}>Once authorized, we will process your <span style={{fontWeight: '600', color: '#111827'}}>exchange or refund</span> according to your preference.</p>
//           </div>
//         </div>

//         {/* How to Return Section */}
//         <div style={{
//           backgroundColor: 'white',
//           borderRadius: '1rem',
//           boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
//           padding: '2rem',
//           marginBottom: '1.5rem',
//           border: '1px solid #fbcfe8',
//         }}>
//           <div style={{
//             display: 'flex',
//             alignItems: 'flex-start',
//             gap: '0.75rem',
//             marginBottom: '1rem',
//           }}>
//             <div style={{
//               flexShrink: 0,
//               width: '2.5rem',
//               height: '2.5rem',
//               background: 'linear-gradient(to bottom right, #f43f5e, #ec4899)',
//               borderRadius: '0.5rem',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}>
//               <svg style={{
//                 width: '1.5rem',
//                 height: '1.5rem',
//                 color: 'white',
//               }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//               </svg>
//             </div>
//             <h2 style={{
//               fontSize: '1.5rem',
//               fontWeight: 'bold',
//               color: '#111827',
//               margin: 0,
//             }}>How to Return</h2>
//           </div>
//           <ul style={{listStyle: 'none', padding: 0}}>
//             <li style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem'}}>
//               <span style={{flexShrink: 0, width: '1.5rem', height: '1.5rem', backgroundColor: '#fce7f3', color: '#be185d', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '600'}}>1</span>
//               <span style={{color: '#374151', lineHeight: '1.75'}}>Return the product via a <span style={{fontWeight: '600', color: '#111827'}}>reputed courier or airmail</span> within <span style={{fontWeight: '600', color: '#dc2626'}}>2 business days</span> of reporting the defect.</span>
//             </li>
//             <li style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem'}}>
//               <span style={{flexShrink: 0, width: '1.5rem', height: '1.5rem', backgroundColor: '#fce7f3', color: '#be185d', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '600'}}>2</span>
//               <span style={{color: '#374151', lineHeight: '1.75'}}>Returns received <span style={{fontWeight: '600', color: '#dc2626'}}>after 2 business days</span> will <span style={{fontWeight: '600', color: '#dc2626'}}>NOT</span> be eligible for exchange or refund.</span>
//             </li>
//             <li style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem'}}>
//               <span style={{flexShrink: 0, width: '1.5rem', height: '1.5rem', backgroundColor: '#fce7f3', color: '#be185d', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '600'}}>3</span>
//               <span style={{color: '#374151', lineHeight: '1.75'}}>For assistance, contact us at <a href="tel:+9779861698400" style={{fontWeight: '600', color: '#f43f5e', textDecoration: 'none'}}>+977 9861698400</a>.</span>
//             </li>
//           </ul>
//         </div>

//         {/* Refund Process Section */}
//         <div style={{
//           backgroundColor: 'white',
//           borderRadius: '1rem',
//           boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
//           padding: '2rem',
//           marginBottom: '1.5rem',
//           border: '1px solid #fbcfe8',
//         }}>
//           <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem'}}>
//             <div style={{flexShrink: 0, width: '2.5rem', height: '2.5rem', background: 'linear-gradient(to bottom right, #c026d3, #ec4899)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
//               <svg style={{width: '1.5rem', height: '1.5rem', color: 'white'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0}}>Refund Process</h2>
//           </div>
//           <ul style={{listStyle: 'none', padding: 0}}>
//             <li style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem'}}>
//               <span style={{flexShrink: 0, width: '1.5rem', height: '1.5rem', backgroundColor: '#fae8ff', color: '#a21caf', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '600'}}>1</span>
//               <span style={{color: '#374151', lineHeight: '1.75'}}>After we receive and inspect your returned item, we will notify you of the <span style={{fontWeight: '600', color: '#111827'}}>approval or rejection</span> of your refund.</span>
//             </li>
//             <li style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem'}}>
//               <span style={{flexShrink: 0, width: '1.5rem', height: '1.5rem', backgroundColor: '#fae8ff', color: '#a21caf', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '600'}}>2</span>
//               <span style={{color: '#374151', lineHeight: '1.75'}}>If approved, the refund will be processed within <span style={{fontWeight: '600', color: '#c026d3'}}>7-10 working days</span> through your original payment method.</span>
//             </li>
//           </ul>
//         </div>

//         {/* Non-Returnable Items */}
//         <div style={{backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '1.5rem', border: '1px solid #fecaca'}}>
//           <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem'}}>
//             <div style={{flexShrink: 0, width: '2.5rem', height: '2.5rem', background: 'linear-gradient(to bottom right, #ef4444, #f43f5e)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
//               <svg style={{width: '1.5rem', height: '1.5rem', color: 'white'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
//               </svg>
//             </div>
//             <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0}}>Non-Returnable / Non-Exchangeable Items</h2>
//           </div>
//           <p style={{color: '#374151', lineHeight: '1.75', marginBottom: '1rem'}}>We <span style={{fontWeight: '600', color: '#dc2626'}}>cannot accept returns or exchanges</span> for the following reasons:</p>
//           <ul style={{listStyle: 'none', padding: 0}}>
//             {['Minor color variations between the product images and the actual item (due to photography or screen differences).', 'Products that do not match personal preference in look or feel.', 'Jewelry that feels heavy, looks bigger, or is not the expected size.', 'Items purchased at a sale or discounted price.', 'Bent earring stems (sometimes done intentionally to avoid breakage).', 'Minor loss of beads or stones that can be easily fixed with adhesive.'].map((item, i) => (
//               <li key={i} style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem'}}>
//                 <svg style={{width: '1.25rem', height: '1.25rem', color: '#ef4444', flexShrink: 0, marginTop: '0.125rem'}} fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//                 <span style={{color: '#374151', lineHeight: '1.75'}}>{item}</span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Important Note */}
//         <div style={{backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '1.5rem', background: 'linear-gradient(to bottom right, #ec4899, #f43f5e)', color: 'white'}}>
//           <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem'}}>
//             <div style={{flexShrink: 0, width: '2.5rem', height: '2.5rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
//               <svg style={{width: '1.5rem', height: '1.5rem', color: 'white'}} fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0}}>Important Note</h2>
//           </div>
//           <div>
//             <p style={{color: 'white', lineHeight: '1.75', marginBottom: '1rem'}}>Please <span style={{fontWeight: '600'}}>review all product details carefully</span> before placing an order.</p>
//             <p style={{color: 'white', lineHeight: '1.75', marginBottom: 0}}>For clarifications or more information, contact us at <a href="tel:+9779861698400" style={{fontWeight: '600', color: 'white', textDecoration: 'underline'}}>+977 9861698400</a>.</p>
//           </div>
//         </div>

//         {/* Contact Footer */}
//         <div style={{marginTop: '2rem', textAlign: 'center'}}>
//           <p style={{color: '#4b5563', fontSize: '0.875rem', marginBottom: '1rem'}}>Have questions? We're here to help!</p>
//           <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem'}}>
//             <a href="mailto:abhushangallery2023@gmail.com" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'white', borderRadius: '9999px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: '#374151', textDecoration: 'none'}}>
//               <svg style={{width: '1.25rem', height: '1.25rem'}} fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                 <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//               </svg>
//               Email Us
//             </a>
//             <a href="https://wa.me/9779861698400" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#22c55e', color: 'white', borderRadius: '9999px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', textDecoration: 'none'}}>
//               <svg style={{width: '1.25rem', height: '1.25rem'}} fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
//               </svg>
//               WhatsApp
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReturnPolicy;


import React from 'react';
import { useLocation } from 'react-router-dom';

const ReturnPolicy = () => {
  // Use useLocation from react-router-dom for robust SPA routing (supports hash and browser history modes)
  const location = useLocation();
  // For hash-based routing, location.pathname may be '/' and location.hash will contain the route
  // e.g., location.hash === '#/shipping-policy'
  const path = location.pathname === '/' && location.hash ? location.hash.replace(/^#/, '') : location.pathname;
  const isShipping = path === '/shipping-policy';
  // Debug log
  console.log('ReturnPolicy - path:', path, 'isShipping:', isShipping);
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef2f2 0%, #fdf2f8 50%, #fff1f2 100%)',
      padding: '3rem 1rem',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    }}>
      <div style={{
        maxWidth: '64rem',
        margin: '0 auto',
      }}>
        {/* Animated Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem',
          animation: 'fadeInUp 0.6s ease-out',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '5rem',
            height: '5rem',
            background: 'linear-gradient(135deg, #ec4899, #f43f5e, #e11d48)',
            borderRadius: '2rem',
            marginBottom: '1.5rem',
            boxShadow: '0 20px 40px -12px rgba(236, 72, 153, 0.4)',
            transform: 'rotate(3deg)',
            transition: 'transform 0.3s ease',
          }}>
            <svg style={{
              width: '2.5rem',
              height: '2.5rem',
              color: 'white',
            }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #111827 0%, #4b5563 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: '1rem',
            letterSpacing: '-0.025em',
          }}>{isShipping ? 'Shipping Policy' : 'Return & Exchange Policy'}</h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1.125rem',
            maxWidth: '36rem',
            margin: '0 auto',
            lineHeight: '1.6',
          }}>{isShipping ? 'Fast and secure delivery for your precious jewelry' : 'Your satisfaction is our priority'}</p>
        </div>

        {/* Exchange / Refund Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid rgba(236, 72, 153, 0.2)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{
              flexShrink: 0,
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(236, 72, 153, 0.3)',
            }}>
              <svg style={{
                width: '1.5rem',
                height: '1.5rem',
                color: 'white',
              }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#111827',
              margin: 0,
              letterSpacing: '-0.025em',
            }}>Exchange / Refund</h2>
          </div>
          <div>
            <p style={{
              color: '#374151',
              lineHeight: '1.75',
              marginBottom: '1.5rem',
              fontSize: '1rem',
            }}>
              If you receive a <span style={{fontWeight: '700', color: '#111827'}}>damaged or incorrect product</span>, we will provide a <span style={{fontWeight: '700', color: '#ec4899'}}>full exchange</span> or a <span style={{fontWeight: '700', color: '#ec4899'}}>refund</span> if the same product is unavailable.
            </p>
            
            <div style={{
              background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
              borderLeft: '4px solid #ec4899',
              padding: '1.25rem',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}>
                <svg style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  color: '#ec4899',
                  flexShrink: 0,
                  marginTop: '0.125rem',
                }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p style={{fontWeight: '700', color: '#831843', marginBottom: '0.25rem'}}>📸 Important:</p>
                  <p style={{color: '#831843'}}>An <span style={{fontWeight: '700'}}>unboxing video</span> (from the moment you open the parcel) is <span style={{fontWeight: '700'}}>mandatory</span> for all claims.</p>
                </div>
              </div>
            </div>

            <div>
              <p style={{fontWeight: '700', color: '#111827', marginBottom: '1rem'}}>Please report the issue within <span style={{color: '#dc2626'}}>24 hours of delivery</span> via:</p>
              <div style={{
                marginLeft: '1rem',
                marginTop: '0.75rem',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                }}>
                  <svg style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    color: '#ec4899'
                  }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span style={{color: '#374151', lineHeight: '1.75'}}><span style={{fontWeight: '700'}}>Email:</span> <a href="mailto:abhushangallery2023@gmail.com" style={{color: '#ec4899', textDecoration: 'none', fontWeight: '500'}}>abhushangallery2023@gmail.com</a></span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                }}>
                  <svg style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    color: '#22c55e'
                  }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span style={{color: '#374151', lineHeight: '1.75'}}><span style={{fontWeight: '700'}}>WhatsApp:</span> <a href="https://wa.me/9779861698400" style={{color: '#22c55e', textDecoration: 'none', fontWeight: '500'}}>+977 9861698400</a></span>
                </div>
              </div>
            </div>

            <p style={{
              color: '#374151',
              lineHeight: '1.75',
              marginTop: '1rem',
              marginBottom: '1rem',
            }}>Once authorized, we will process your <span style={{fontWeight: '700', color: '#111827'}}>exchange or refund</span> according to your preference.</p>
          </div>
        </div>

        {/* How to Return Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid rgba(236, 72, 153, 0.2)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{
              flexShrink: 0,
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(244, 63, 94, 0.3)',
            }}>
              <svg style={{
                width: '1.5rem',
                height: '1.5rem',
                color: 'white',
              }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#111827',
              margin: 0,
              letterSpacing: '-0.025em',
            }}>How to Return</h2>
          </div>
          <ul style={{listStyle: 'none', padding: 0}}>
            {[
              'Return the product via a <strong>reputed courier or airmail</strong> within <strong class="text-red">2 business days</strong> of reporting the defect.',
              'Returns received <strong class="text-red">after 2 business days</strong> will <strong class="text-red">NOT</strong> be eligible for exchange or refund.',
              'For assistance, contact us at <a href="tel:+9779861698400" class="contact-link">+977 9861698400</a>.'
            ].map((item, i) => (
              <li key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                marginBottom: '1rem',
                padding: '0.5rem',
                borderRadius: '0.75rem',
                transition: 'background 0.2s ease',
              }}>
                <div style={{
                  flexShrink: 0,
                  width: '2rem',
                  height: '2rem',
                  background: 'linear-gradient(135deg, #fce7f3, #fdf2f8)',
                  color: '#be185d',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}>{i + 1}</div>
                <span style={{color: '#374151', lineHeight: '1.75'}} dangerouslySetInnerHTML={{ __html: item.replace(/<strong>/g, '<strong style="font-weight: 700; color: #111827">').replace(/<strong class="text-red">/g, '<strong style="font-weight: 700; color: #dc2626">').replace(/<a href=/g, '<a style="font-weight: 700; color: #f43f5e; text-decoration: none" href=') }} />
              </li>
            ))}
          </ul>
        </div>

        {/* Refund Process Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid rgba(192, 38, 211, 0.2)',
        }}>
          <div style={{display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem'}}>
            <div style={{
              flexShrink: 0,
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(135deg, #c026d3, #ec4899)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(192, 38, 211, 0.3)',
            }}>
              <svg style={{width: '1.5rem', height: '1.5rem', color: 'white'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 style={{fontSize: '1.75rem', fontWeight: '700', color: '#111827', margin: 0, letterSpacing: '-0.025em'}}>Refund Process</h2>
          </div>
          <ul style={{listStyle: 'none', padding: 0}}>
            {[
              'After we receive and inspect your returned item, we will notify you of the <strong>approval or rejection</strong> of your refund.',
              'If approved, the refund will be processed within <strong class="text-purple">7-10 working days</strong> through your original payment method.'
            ].map((item, i) => (
              <li key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                marginBottom: '1rem',
                padding: '0.5rem',
                borderRadius: '0.75rem',
              }}>
                <div style={{
                  flexShrink: 0,
                  width: '2rem',
                  height: '2rem',
                  background: 'linear-gradient(135deg, #fae8ff, #fdf4ff)',
                  color: '#a21caf',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}>{i + 1}</div>
                <span style={{color: '#374151', lineHeight: '1.75'}} dangerouslySetInnerHTML={{ __html: item.replace(/<strong>/g, '<strong style="font-weight: 700; color: #111827">').replace(/<strong class="text-purple">/g, '<strong style="font-weight: 700; color: #c026d3">') }} />
              </li>
            ))}
          </ul>
        </div>

        {/* Non-Returnable Items */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        }}>
          <div style={{display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem'}}>
            <div style={{
              flexShrink: 0,
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(135deg, #ef4444, #f43f5e)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)',
            }}>
              <svg style={{width: '1.5rem', height: '1.5rem', color: 'white'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 style={{fontSize: '1.75rem', fontWeight: '700', color: '#111827', margin: 0, letterSpacing: '-0.025em'}}>Non-Returnable / Non-Exchangeable Items</h2>
          </div>
          <p style={{color: '#374151', lineHeight: '1.75', marginBottom: '1.5rem'}}>We <span style={{fontWeight: '700', color: '#dc2626'}}>cannot accept returns or exchanges</span> for the following reasons:</p>
          <ul style={{listStyle: 'none', padding: 0}}>
            {[
              'Minor color variations between the product images and the actual item (due to photography or screen differences).',
              'Products that do not match personal preference in look or feel.',
              'Jewelry that feels heavy, looks bigger, or is not the expected size.',
              'Items purchased at a sale or discounted price.',
              'Bent earring stems (sometimes done intentionally to avoid breakage).',
              'Minor loss of beads or stones that can be easily fixed with adhesive.'
            ].map((item, i) => (
              <li key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                marginBottom: '0.75rem',
                padding: '0.25rem',
              }}>
                <svg style={{width: '1.25rem', height: '1.25rem', color: '#ef4444', flexShrink: 0, marginTop: '0.125rem'}} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span style={{color: '#374151', lineHeight: '1.6'}}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Important Note */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
          padding: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #ec4899, #f43f5e, #e11d48)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{position: 'absolute', top: '-20%', right: '-10%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', pointerEvents: 'none'}} />
          <div style={{position: 'absolute', bottom: '-30%', left: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none'}} />
          <div style={{display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1}}>
            <div style={{
              flexShrink: 0,
              width: '3rem',
              height: '3rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg style={{width: '1.5rem', height: '1.5rem', color: 'white'}} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 style={{fontSize: '1.75rem', fontWeight: '700', color: 'white', margin: 0, letterSpacing: '-0.025em'}}>Important Note</h2>
          </div>
          <div style={{position: 'relative', zIndex: 1}}>
            <p style={{color: 'white', lineHeight: '1.75', marginBottom: '1rem', fontSize: '1rem'}}>
              Please <span style={{fontWeight: '700'}}>review all product details carefully</span> before placing an order.
            </p>
            <p style={{color: 'white', lineHeight: '1.75', marginBottom: 0}}>
              For clarifications or more information, contact us at <a href="tel:+9779861698400" style={{fontWeight: '700', color: 'white', textDecoration: 'underline', textUnderlineOffset: '4px'}}>+977 9861698400</a>.
            </p>
          </div>
        </div>

        {/* Contact Footer */}
        <div style={{marginTop: '3rem', textAlign: 'center'}}>
          <p style={{color: '#4b5563', fontSize: '1rem', marginBottom: '1.5rem', fontWeight: '500'}}>✨ Have questions? We're here to help! ✨</p>
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem'}}>
            <a href="mailto:abhushangallery2023@gmail.com" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 2rem',
              backgroundColor: 'white',
              borderRadius: '9999px',
              boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.1)',
              color: '#374151',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}>
              <svg style={{width: '1.25rem', height: '1.25rem', color: '#ec4899'}} fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Email Us
            </a>
            <a href="https://wa.me/9779861698400" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 2rem',
              backgroundColor: '#22c55e',
              color: 'white',
              borderRadius: '9999px',
              boxShadow: '0 10px 20px -5px rgba(34, 197, 94, 0.4)',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}>
              <svg style={{width: '1.25rem', height: '1.25rem'}} fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
      
      {/* Add keyframe animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        a, button {
          transition: all 0.2s ease;
        }
        
        a:hover, button:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
        }
        
        div[style*="borderRadius: 1.5rem"]:hover {
          transform: translateY(-4px);
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default ReturnPolicy;