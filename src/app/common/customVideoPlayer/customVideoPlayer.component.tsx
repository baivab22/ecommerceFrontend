import React, { useState, useRef, useEffect } from 'react';
import { Play, X } from 'lucide-react';

const CustomVideoPlayer = ({
  videoUrl,
  thumbnailUrl,
  isFromUploader,
  productDetails
}: {
  videoUrl: string;
  thumbnailUrl: string;
  isFromUploader?: boolean;
  productDetails?: {
    name: string;
    description: string;
    price: string;
  };
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Strip HTML tags from description
  const stripHtmlTags = (html: string): string => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const toggleFullScreen = () => {
    setIsFullScreen(true);
    // Ensure video plays when entering fullscreen
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(err => console.log('Play error:', err));
      }
    }, 100);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset to beginning
    }
  };

  // Handle escape key to close fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        closeFullScreen();
      }
    };

    if (isFullScreen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isFullScreen]);

  const cleanDescription = stripHtmlTags(productDetails?.description || '');

  return (
    <>
      <div className="custom-video-player">
        {!isFullScreen ? (
          <div className="thumbnail">
            <div
              className="videos"
              style={{
                height: isFromUploader ? '80px' : '220px',
                width: isFromUploader ? '80px' : '120px'
              }}
            >
              {!videoFailed ? (
                <video 
                  src={videoUrl} 
                  muted 
                  autoPlay 
                  loop 
                  playsInline 
                  onError={() => setVideoFailed(true)}
                />
              ) : (
                <img 
                  src={thumbnailUrl || '/assets/images/defaultProduct.jpeg'} 
                  alt="Video unavailable"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if ((img as any)._fallbackApplied) return;
                    (img as any)._fallbackApplied = true;
                    img.src = '/assets/images/defaultProduct.jpeg';
                  }}
                />
              )}
            </div>

            <div className="play-button" onClick={toggleFullScreen}>
              <Play size={30} color="white" fill="white" />
            </div>
          </div>
        ) : (
          <div className="fullscreen-container">
            {/* Close Button - Top Right */}
            <button 
              className="top-close-button" 
              onClick={closeFullScreen} 
              aria-label="Close video"
              type="button"
            >
              <X size={28} />
            </button>

            {/* Video */}
            <div className="video-container">
              {!videoFailed ? (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="fullscreen-video"
                  controls
                  autoPlay
                  playsInline
                  controlsList="nodownload"
                  onError={() => setVideoFailed(true)}
                />
              ) : (
                <img 
                  src={thumbnailUrl || '/assets/images/defaultProduct.jpeg'} 
                  alt="Video unavailable"
                  className="fullscreen-video"
                  style={{ objectFit: 'contain', backgroundColor: '#000' }}
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if ((img as any)._fallbackApplied) return;
                    (img as any)._fallbackApplied = true;
                    img.src = '/assets/images/defaultProduct.jpeg';
                  }}
                />
              )}
            </div>

            {/* Bottom Footer with Product Info */}
            <div className="product-footer">
              <div className="product-footer-content">
                <div className="product-info-section">
                  <h2 className="product-name">{productDetails?.name || 'Product Name'}</h2>
                  <p className="product-price">{productDetails?.price || '$99.99'}</p>
                  {cleanDescription && (
                    <p className="product-description">{cleanDescription}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style >{`
        * {
          box-sizing: border-box;
        }

        .custom-video-player {
          position: relative;
        }

        /* Thumbnail Styles */
        .thumbnail {
          position: relative;
          border-radius: 10px;
        }

        .play-button {
          position: absolute;
          z-index: 5000003;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 48px;
          color: #fff;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .play-button:hover {
          transform: translate(-50%, -50%) scale(1.1);
        }

        .videos {
          box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
            rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
            rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          z-index: 2000;
        }

        .videos video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
        }

        /* Close Button - Top Right */
        .top-close-button {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 8px;
          background: #fe2c55;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          outline: none;
          transition: all 0.2s ease;
          color: #ffffff;
          z-index: 9999999;
          box-shadow: 0 4px 12px rgba(254, 44, 85, 0.4);
        }

        .top-close-button:hover {
          background: #d91f45;
          transform: scale(1.05);
        }

        .top-close-button:active {
          transform: scale(0.95);
        }

        /* Fullscreen Container */
        .fullscreen-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          background-color: #000000;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Video Container */
        .video-container {
          flex: 1;
          width: 100%;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Video Styles */
        .fullscreen-video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background-color: #000000;
          position: relative;
          z-index: 1;
        }

        /* Product Footer */
        .product-footer {
          flex-shrink: 0;
          background-color: rgba(0, 0, 0, 0.95);
          padding: 16px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 999999;
          width: 100%;
        }

        .product-footer-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          position: relative;
          z-index: 999999;
        }

        .product-info-section {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
        }

        .product-name {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .product-price {
          font-size: 16px;
          font-weight: 700;
          color: #4ade80;
          margin: 0;
          white-space: nowrap;
        }

        .product-description {
          font-size: 14px;
          color: #d1d5db;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }

        /* Mobile Styles - TikTok vibes */
        @media (max-width: 768px) {
          .fullscreen-container {
            padding: 0;
          }

          .video-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100vw;
            height: 100vh;
            height: 100dvh;
            margin: 0;
            padding: 0;
          }

          .fullscreen-video {
            object-fit: cover;
            width: 100vw !important;
            height: 100vh !important;
            height: 100dvh !important;
            position: fixed;
            top: 0;
            left: 0;
            margin: 0;
            padding: 0;
          }

          .product-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100vw;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, transparent 100%);
            padding: 80px 20px 20px 20px;
            border-top: none;
            margin: 0;
          }

          .product-footer-content {
            flex-direction: row;
            align-items: flex-end;
            gap: 12px;
          }

          .product-info-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .product-name {
            font-size: 16px;
            font-weight: 700;
            white-space: normal;
            line-height: 1.3;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
          }

          .product-price {
            font-size: 18px;
            font-weight: 800;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
          }

          .product-description {
            font-size: 14px;
            white-space: normal;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
          }

          .top-close-button {
            position: fixed;
            top: 16px;
            right: 16px;
            width: 48px;
            height: 48px;
            z-index: 99999999;
          }
        }

        /* Small mobile devices */
        @media (max-width: 480px) {
          .product-footer {
            padding: 10px 12px;
          }

          .product-name {
            font-size: 14px;
          }

          .product-price {
            font-size: 14px;
          }

          .product-description {
            font-size: 12px;
          }

          .top-close-button {
            top: 12px;
            right: 12px;
            width: 42px;
            height: 42px;
          }
        }

        /* Desktop - maintain aspect ratio */
        @media (min-width: 769px) {
          .fullscreen-video {
            object-fit: contain;
          }
        }

        /* Landscape orientation on mobile */
        @media (max-width: 768px) and (orientation: landscape) {
          .fullscreen-video {
            object-fit: cover;
          }

          .product-footer {
            padding: 40px 20px 16px 20px;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 70%, transparent 100%);
          }

          .product-footer-content {
            flex-direction: row;
            gap: 16px;
            align-items: flex-end;
          }

          .product-info-section {
            flex-direction: column;
            gap: 6px;
            align-items: flex-start;
          }

          .product-name {
            font-size: 14px;
            font-weight: 700;
          }

          .product-price {
            font-size: 16px;
            font-weight: 800;
          }

          .product-description {
            font-size: 12px;
            -webkit-line-clamp: 1;
          }

          .top-close-button {
            top: 12px;
            right: 12px;
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </>
  );
};

export default CustomVideoPlayer;