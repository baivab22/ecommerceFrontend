import React, { useState, useEffect } from 'react'
import NextLink from 'next/link'
import {useRouter} from 'next/router'
import useAuth from '../hooks/useAuth'
import {useSpring, animated} from '@react-spring/web'
import {useCanAccessRoute} from '../routes/ProtectedRoutes.app'
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
import { OptimizedImage } from 'src/app/common/OptimizedImage/OptimizedImage.component'

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
    const router = useRouter()

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
                cursor: 'pointer',
              }}
              onClick={() => router.push('/home')}
            >
              <div style={{ position: 'relative', width: '120px', height: '100px' }}>
                <OptimizedImage
                src='/assets/images/logosss.png'
                  alt="TMO"
                  fill
                  objectFit="contain"
                  onError={() => {
                    /* fallback managed by OptimizedImage */
                  }}
                />
              </div>
            </animated.div>
          </div>
          <Box style={{height: 'calc(100vh - 150px)', overflowY: 'auto'}} pt={20}>
            <SideNavItem route='Products' url='/dash-product' icon={() => (
<MdInventory size={20} />
)} isMobile={isMobile} closeMenu={() => setMobileMenuOpen(false)} />

            <SideNavItem route='Category' url='/dash-category' icon={() => (
<MdCategory size={20} />
)} isMobile={isMobile} closeMenu={() => setMobileMenuOpen(false)} />

            <SideNavItem route='SubCategory' url='/dash-subCategory' icon={() => (
<MdAccountTree size={20} />
)} isMobile={isMobile} closeMenu={() => setMobileMenuOpen(false)} />

            <SideNavItem route='Nested SubCategory' url='/dash-subCategorynested' icon={() => (
<MdLayers size={20} />
)} isMobile={isMobile} closeMenu={() => setMobileMenuOpen(false)} />

            <SideNavItem route='New Arrivals' url='/dash-new-arrivals' icon={() => (
<MdNewReleases size={20} />
)} isMobile={isMobile} closeMenu={() => setMobileMenuOpen(false)} />

            <SideNavItem route='Best Sellings' url='/dash-best-selling' icon={() => (
<MdTrendingUp size={20} />
)} isMobile={isMobile} closeMenu={() => setMobileMenuOpen(false)} />

            <SideNavItem route='Banners' url='/dash-banners' icon={() => (
<MdViewCarousel size={20} />
)} isMobile={isMobile} closeMenu={() => setMobileMenuOpen(false)} />

            <SideNavItem route='Testimonial' url='/dash-testimonial' icon={() => (
<MdRateReview size={20} />
)} isMobile={isMobile} closeMenu={() => setMobileMenuOpen(false)} />

            <SideNavItem route='Shop By Budget' url='/dash-shopByBudget' icon={() => (
<MdAttachMoney size={20} />
)} isMobile={isMobile} closeMenu={() => setMobileMenuOpen(false)} />

            <SideNavItem route='Order List' url='/dash-orders' icon={() => (
<MdShoppingCart size={20} />
)} isMobile={isMobile} closeMenu={() => setMobileMenuOpen(false)} />

            <SideNavItem route='Holiday Mode' url='/dash-holiday-mode' icon={() => (
<MdEventBusy size={20} />
)} isMobile={isMobile} closeMenu={() => setMobileMenuOpen(false)} />
          
            <SideNavItem route='Social Links' url='/dash-social-links' icon={() => (
<MdShare size={20} />
)} isMobile={isMobile} closeMenu={() => setMobileMenuOpen(false)} />

           <SideNavItem route='Selling analysis' url='/dash-selling-analysis' icon={() => (
<MdInsights size={20} />
)} isMobile={isMobile} closeMenu={() => setMobileMenuOpen(false)} /> 

                     {/* Site Config menu item */}
            {/* <SideNavItem route='Site Config' url='/dash-config' icon={() => (
<MdSettings size={20} />
)} isMobile={isMobile} closeMenu={() => setMobileMenuOpen(false)} /> */}

            <SideNavItem route='Mark shipped' url='/dash-mark-shipped' icon={() => (
<MdLocalShipping size={20} />
)} isMobile={isMobile} closeMenu={() => setMobileMenuOpen(false)} />

            <SideNavItem route='Email Marketing' url='/dash-emailMarketing' icon={() => (
<MdEmail size={20} />
)} isMobile={isMobile} closeMenu={() => setMobileMenuOpen(false)} />

            <SideNavItem route='Hot Selling' url='/dash-hot-selling' icon={() => (
<MdWhatshot size={20} />
)} isMobile={isMobile} closeMenu={() => setMobileMenuOpen(false)} />

   
          </Box>
        </animated.div>
      </div>
    </>
  ) : null
})

const SideNavItem = ({
  route,
  url,
  icon,
  isMobile,
  closeMenu
}: {
  route: string
  url: string
  icon: () => React.ReactNode
  isMobile: boolean
  closeMenu: () => void
}) => {
  if (!route) return null

  const canAccess = useCanAccessRoute(url)
  const {sidenavExpand} = useAuth()
  const router = useRouter()
  const isActive = router.asPath === url || router.asPath.startsWith(url + '/')
  const props = useSpring({opacity: (sidenavExpand || isMobile) ? 1 : 0})
  const linkClassName = isActive
    ? 'sidenav-title-container active '
    : 'sidenav-title-container'

  if (canAccess.length === 0) {
    return null
  }

  return (
    <div className={`sidenav${(sidenavExpand || isMobile) ? '' : '-small'}`}>
      <NextLink href={url} legacyBehavior>
        <a
          onClick={isMobile ? closeMenu : undefined}
          style={{ textDecoration: 'none' }}
          className={linkClassName}
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
        </a>
      </NextLink>
    </div>
  )
}
