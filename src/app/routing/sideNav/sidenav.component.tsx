import React, { useState, useEffect } from 'react'
import {useAuth} from '../hooks'
import {useSpring, animated} from '@react-spring/web'
import {NavLink} from 'react-router-dom'
import {useCanAccessRoute} from '../routes/ProtectedRoutes.app'
import { useNavigate } from 'react-router-dom'
import {
  MdInventory,
  MdCategory,
  MdAccountTree,
  MdLayers,
  MdNewReleases,
  MdTrendingUp,
  MdViewCarousel,
  MdRateReview,
  MdAttachMoney,
  MdShoppingCart,
  MdEventBusy,
  MdShare,
  MdMenu,
  MdClose,
  MdInsights,
  MdLocalShipping,
  MdEmail,
  MdWhatshot,
  MdSettings
} from 'react-icons/md'
import { BASE_URL } from 'src/config'

import {Box, ToolTip} from 'src/app/common'
import { useMedia } from 'src/hooks'



export const SideNav = React.memo(() => {
  const {auth} = useAuth()
  return auth.isLoggedin ? <SideNavComponent /> : null
})

const SideNavComponent = React.memo(() => {
  const {auth, sidenavExpand} = useAuth()
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && mobileMenuOpen && !e.target.closest('.sidenav-container') && !e.target.closest('.mobile-menu-toggles')) {
        setMobileMenuOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobile, mobileMenuOpen])

  const props = useSpring({
    width: isMobile ? (mobileMenuOpen ? 280 : 0) : (sidenavExpand ? 280 : 90),
    opacity: isMobile ? (mobileMenuOpen ? 1 : 0) : 1
  })

  const headerStyle = useSpring({width: sidenavExpand ? 60 : 80})

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev)
  }

  const media = useMedia()

 

      const navigate = useNavigate()

  return auth.isLoggedin ? (
    <>
      {/* Mobile Menu Toggle Button */}
      {isMobile && (
        <button  
          className="mobile-menu-toggles"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
      )}

      {/* Backdrop for mobile */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="sidenav-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`sidenav-container ${isMobile ? 'mobile' : ''} ${mobileMenuOpen ? 'open' : ''}`}
      >
        <animated.div
          style={{
            height: '100%',
            ...props,
            background:'white',
            paddingLeft:media.md?'20px':'0px',
            overflow:'hidden'
          }}
        >
          <div className="sidenav-header">
            <animated.div
              className="sidenav-header-logo1"
              style={{
                ...headerStyle,
                cursor: 'pointer'
              }}
              onClick={() =>   navigate('/')}
            >
              <img src={BASE_URL + '/logo'} alt="TMO" onError={e => { e.currentTarget.src = '/assets/images/logosss.png'; }} />
            </animated.div>
          </div>
          <Box style={{height: 'calc(100vh - 150px)', overflowY: 'auto'}} pt={20}>
            {getNav('Products', '/dash-product', () => (
              <MdInventory size={20} />
            ), isMobile, () => setMobileMenuOpen(false))}

            {getNav('Category', '/dash-category', () => (
              <MdCategory size={20} />
            ), isMobile, () => setMobileMenuOpen(false))}

            {getNav('SubCategory', '/dash-subCategory', () => (
              <MdAccountTree size={20} />
            ), isMobile, () => setMobileMenuOpen(false))}

            {getNav('Nested SubCategory', '/dash-subCategorynested', () => (
              <MdLayers size={20} />
            ), isMobile, () => setMobileMenuOpen(false))}

            {getNav('New Arrivals', '/dash-new-arrivals', () => (
              <MdNewReleases size={20} />
            ), isMobile, () => setMobileMenuOpen(false))}

            {getNav('Best Sellings', '/dash-best-selling', () => (
              <MdTrendingUp size={20} />
            ), isMobile, () => setMobileMenuOpen(false))}

            {getNav('Banners', '/dash-banners', () => (
              <MdViewCarousel size={20} />
            ), isMobile, () => setMobileMenuOpen(false))}

            {getNav('Testimonial', '/dash-testimonial', () => (
              <MdRateReview size={20} />
            ), isMobile, () => setMobileMenuOpen(false))}

            {getNav('Shop By Budget', '/dash-shopByBudget', () => (
              <MdAttachMoney size={20} />
            ), isMobile, () => setMobileMenuOpen(false))}

            {getNav('Order List', '/dash-orders', () => (
              <MdShoppingCart size={20} />
            ), isMobile, () => setMobileMenuOpen(false))}

            {getNav('Holiday Mode', '/dash-holiday-mode', () => (
              <MdEventBusy size={20} />
            ), isMobile, () => setMobileMenuOpen(false))}
          
            {getNav('Social Links', '/dash-social-links', () => (
              <MdShare size={20} />
            ), isMobile, () => setMobileMenuOpen(false))}

           {getNav('Selling analysis', '/dash-selling-analysis', () => (
              <MdInsights size={20} />
            ), isMobile, () => setMobileMenuOpen(false))} 

                     {/* Site Config menu item */}
            {/* {getNav('Site Config', '/dash-config', () => (
              <MdSettings size={20} />
            ), isMobile, () => setMobileMenuOpen(false))} */}

            {getNav('Mark shipped', '/dash-mark-shipped', () => (
              <MdLocalShipping size={20} />
            ), isMobile, () => setMobileMenuOpen(false))}

            {getNav('Email Marketing', '/dash-emailMarketing', () => (
              <MdEmail size={20} />
            ), isMobile, () => setMobileMenuOpen(false))}

            {getNav('Hot Selling', '/dash-hot-selling', () => (
              <MdWhatshot size={20} />
            ), isMobile, () => setMobileMenuOpen(false))}

   
          </Box>
        </animated.div>
      </div>
    </>
  ) : null
})

const getNav = (route: string, url: string, icon: () => React.ReactNode, isMobile: boolean, closeMenu: () => void) => {
  console.log(route, 'route value')
  if (!route) return null
  const canAccess = useCanAccessRoute(url)
  const {sidenavExpand} = useAuth()
  const props = useSpring({opacity: (sidenavExpand || isMobile) ? 1 : 0})

  return (
    canAccess.length > 0 && (
      <div className={`sidenav${(sidenavExpand || isMobile) ? '' : '-small'}`}>
        <NavLink
          to={url}
          onClick={isMobile ? closeMenu : undefined}
          style={({isActive}) => ({
            textDecoration: 'none'
          })}
          className={({isActive}) =>
            isActive
              ? 'sidenav-title-container active '
              : 'sidenav-title-container'
          }
        >
          <div className="sidenav-title">
            <ToolTip text={route}>
              <div className="sidenav-title-icon">
                {icon()}
              </div>
            </ToolTip>
            {(sidenavExpand || isMobile) && (
              <animated.div
                className="sidenav-title-text"
                style={{
                  ...props
                }}
              >
                {route}
              </animated.div>
            )}
          </div>
        </NavLink>
      </div>
    )
  )
}
