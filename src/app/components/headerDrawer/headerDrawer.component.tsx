import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
// import './headerDrawer.scss'
import './_headerDrawer.scss'

interface SidebarProps {
  handleClose: () => void
  children?: React.ReactNode
}

export const Sidebar: React.FC<SidebarProps> = ({ handleClose, children }) => {
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
        
        {/* Render children - this will be the MobileNavigation component */}
        <div className="mobile-menu-content">
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              // Pass closeMobileMenu to children if they accept onClose prop
              return React.cloneElement(child as React.ReactElement<any>, {
                onClose: closeMobileMenu
              })
            }
            return child
          })}
        </div>
      </div>
    </>
  )
}

export default Sidebar