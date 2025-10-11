import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './_headerDrawer.scss'

interface SidebarProps {
  handleClose: () => void
  children?: React.ReactNode
  loading?: boolean
}

// Mobile Menu Content Skeleton
const MobileMenuSkeleton = () => {
  const skeletonStyle: React.CSSProperties = {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px'
  }

  const menuItemStyle: React.CSSProperties = {
    height: '48px',
    marginBottom: '8px',
    ...skeletonStyle
  }

  const subMenuItemStyle: React.CSSProperties = {
    height: '40px',
    marginBottom: '6px',
    marginLeft: '16px',
    ...skeletonStyle
  }

  return (
    <div style={{ padding: '16px' }}>
      {/* Main menu items */}
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={`main-${index}`}>
          <div style={menuItemStyle}></div>
          {/* Randomly show some submenu items for variety */}
          {index % 2 === 0 && (
            <>
              <div style={subMenuItemStyle}></div>
              <div style={subMenuItemStyle}></div>
            </>
          )}
        </div>
      ))}

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}
      </style>
    </div>
  )
}

// Mobile Header Skeleton
const MobileHeaderSkeleton = () => {
  const skeletonStyle: React.CSSProperties = {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px'
  }

  const logoSkeletonStyle: React.CSSProperties = {
    height: '24px',
    width: '150px',
    ...skeletonStyle
  }

  const iconSkeletonStyle: React.CSSProperties = {
    height: '24px',
    width: '24px',
    borderRadius: '4px',
    ...skeletonStyle
  }

  return (
    <nav className="mobile-nav">
      <div className="mobile-header">
        <div className="mobile-logo">
          <div style={logoSkeletonStyle}></div>
        </div>
        <div style={iconSkeletonStyle}></div>
      </div>
    </nav>
  )
}

export const Sidebar: React.FC<SidebarProps> = ({ handleClose, children, loading = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // Show header skeleton while loading
  if (loading) {
    return (
      <>
        <MobileHeaderSkeleton />
      </>
    )
  }

  return (
    <>
      {/* Mobile Navigation Header */}
      <nav className="mobile-nav">
        <div className="mobile-header">
          <div 
            className="mobile-logo"
            onClick={() => {
              navigate('/home')
              closeMobileMenu()
            }}
          >
           Aabhushan Gallery
          </div>
          <button
            className="hamburger-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu size={24} color='black'/>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Fades in/out */}
      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
        aria-hidden={!isMobileMenuOpen}
      />

      {/* Mobile Menu Panel - Slides from left */}
      <div 
        className={`mobile-menu-panel ${isMobileMenuOpen ? 'open' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mobile-menu-header">
          <h3 className="mobile-menu-title">Categories</h3>
          <button
            className="close-btn"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <X size={20} color='black'/>
          </button>
        </div>
        
        {/* Render children or skeleton */}
        <div className="mobile-menu-content">
          {loading ? (
            <MobileMenuSkeleton />
          ) : (
            React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                // Pass closeMobileMenu to children if they accept onClose prop
                return React.cloneElement(child as React.ReactElement<any>, {
                  onClose: closeMobileMenu
                })
              }
              return child
            })
          )}
        </div>
      </div>
    </>
  )
}

export default Sidebar