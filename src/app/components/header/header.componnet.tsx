import {
  FaCartArrowDown,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaUserAlt
} from 'react-icons/fa'
import { SearchField, VStack, HStack } from 'src/app/common'
import { useDebounceValue, useMedia } from 'src/hooks'
import { Sidebar } from '../headerDrawer/headerDrawer.component'
import { useDispatch, useSelector } from 'src/store'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getCookie, removeCookie } from 'src/helpers'
import { getCartlistAction } from 'src/app/pages/web/cart/cart.slice'
import { getCategoryListAction } from 'src/app/pages/category/category.slice'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'src/app/routing'
import Cookies from 'universal-cookie'
import { getSocialLinksAction } from 'src/app/pages/socialLinks/socialLinks.slice'
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import './_header.scss'

export const DesktopHeader = () => {
  const { categoryData }: any = useSelector((state: any) => state.category)
  const [openDesktopMenus, setOpenDesktopMenus] = useState<Record<string, boolean>>({})
  const closeTimeoutRef = useRef<Record<string, any>>({})
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(
      getCategoryListAction({
        onSuccess: () => {}
      })
    )
  }, [dispatch])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(closeTimeoutRef.current).forEach(timeout => clearTimeout(timeout))
    }
  }, [])

  const handleDesktopMouseEnter = (id: string) => {
    // Clear any pending close timeout for this menu
    if (closeTimeoutRef.current[id]) {
      clearTimeout(closeTimeoutRef.current[id])
      delete closeTimeoutRef.current[id]
    }
    
    setOpenDesktopMenus(prev => ({
      ...prev,
      [id]: true
    }))
  }

  const handleDesktopMouseLeave = (id: string) => {
    // Add a small delay before closing to allow moving to submenu
    closeTimeoutRef.current[id] = setTimeout(() => {
      setOpenDesktopMenus(prev => ({
        ...prev,
        [id]: false
      }))
      delete closeTimeoutRef.current[id]
    }, 150) // 150ms delay
  }

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    navigate(`/products?categoryId=${categoryId}&categoryname=${categoryName}`)
  }

  const handleSubCategoryClick = (subCategoryId: string, subCategoryName?: string) => {
    navigate(`/products?subCategoryId=${subCategoryId}${subCategoryName ? `&subCategoryName=${subCategoryName}` : ''}`)
  }

  const handleNestedSubCategoryClick = (nestedSubCategoryId: string, nestedSubCategoryName?: string) => {
    navigate(`/products?nestedSubCategoryId=${nestedSubCategoryId}${nestedSubCategoryName ? `&nestedSubCategoryName=${nestedSubCategoryName}` : ''}`)
  }

  const renderDesktopSubMenu = (subCategories: any[], level = 0) => {
    return (
      <ul className={`desktop-submenu level-${level}`}>
        {subCategories.map((subCat) => (
          <li
            key={subCat.id}
            className="desktop-submenu-item"
            onMouseEnter={() => {
              if (subCat.subCategories?.length > 0) {
                handleDesktopMouseEnter(subCat.id)
              }
            }}
            onMouseLeave={() => {
              if (subCat.subCategories?.length > 0) {
                handleDesktopMouseLeave(subCat.id)
              }
            }}
          >
            <button
              className="desktop-submenu-link"
              onClick={() => {
                if (level === 0) {
                  handleSubCategoryClick(subCat.id, subCat.name)
                } else {
                  handleNestedSubCategoryClick(subCat.id, subCat.name)
                }
              }}
            >
              <span>{subCat.name}</span>
              {subCat.subCategories && subCat.subCategories.length > 0 && (
                <ChevronRight size={16} className="submenu-arrow" />
              )}
            </button>
            {subCat.subCategories && 
             subCat.subCategories.length > 0 && 
             openDesktopMenus[subCat.id] && (
              <div className="nested-submenu-wrapper">
                {renderDesktopSubMenu(subCat.subCategories, level + 1)}
              </div>
            )}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="navmenuList">
      <div className="navmenuContainer">
        <nav className="desktop-nav">
          <ul className="desktop-menu">
            {categoryData?.map((category: any) => (
              <li
                key={category.id}
                className="desktop-menu-item"
                onMouseEnter={() => {
                  if (category.subCategories?.length > 0) {
                    handleDesktopMouseEnter(category.id)
                  }
                }}
                onMouseLeave={() => {
                  if (category.subCategories?.length > 0) {
                    handleDesktopMouseLeave(category.id)
                  }
                }}
              >
                <button
                  className="desktop-menu-link"
                  onClick={() => handleCategoryClick(category.id, category.name)}
                >
                  <span>{category.name}</span>
                  {category.subCategories && category.subCategories.length > 0 && (
                    <ChevronDown size={16} className="chevron" />
                  )}
                </button>
                {category.subCategories && 
                 category.subCategories.length > 0 && 
                 openDesktopMenus[category.id] && (
                  renderDesktopSubMenu(category.subCategories)
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export const MobileNavigation = ({ onClose }: { onClose?: () => void }) => {
  const { categoryData }: any = useSelector((state: any) => state.category)
  const [openMobileMenus, setOpenMobileMenus] = useState<Record<string, boolean>>({})
  const navigate = useNavigate()

  const toggleMobileSubmenu = (id: string) => {
    setOpenMobileMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    navigate(`/products?categoryId=${categoryId}&categoryname=${categoryName}`)
    onClose?.()
  }

  const handleSubCategoryClick = (subCategoryId: string, subCategoryName?: string) => {
    navigate(`/products?subCategoryId=${subCategoryId}${subCategoryName ? `&subCategoryName=${subCategoryName}` : ''}`)
    onClose?.()
  }

  const handleNestedSubCategoryClick = (nestedSubCategoryId: string, nestedSubCategoryName?: string) => {
    navigate(`/products?nestedSubCategoryId=${nestedSubCategoryId}${nestedSubCategoryName ? `&nestedSubCategoryName=${nestedSubCategoryName}` : ''}`)
    onClose?.()
  }

  const renderMobileSubMenu = (subCategories: any[], level = 0) => {
    return (
      <ul className={`mobile-submenu level-${level}`}>
        {subCategories.map((subCat) => (
          <li key={subCat.id} className="mobile-submenu-item">
            {subCat.subCategories && subCat.subCategories.length > 0 ? (
              <>
                <button
                  className="mobile-submenu-toggle"
                  onClick={() => toggleMobileSubmenu(subCat.id)}
                >
                  <span>{subCat.name}</span>
                  <ChevronRight
                    className={`chevron ${openMobileMenus[subCat.id] ? 'rotated' : ''}`}
                    size={18}
                  />
                </button>
                {openMobileMenus[subCat.id] && renderMobileSubMenu(subCat.subCategories, level + 1)}
              </>
            ) : (
              <button
                className="mobile-submenu-link"
                onClick={() => {
                  if (level === 0) {
                    handleSubCategoryClick(subCat.id, subCat.name)
                  } else {
                    handleNestedSubCategoryClick(subCat.id, subCat.name)
                  }
                }}
              >
                {subCat.name}
              </button>
            )}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="mobile-menu-list">
      {categoryData?.map((category: any) => (
        <div key={category.id} className="mobile-menu-item">
          {category.subCategories && category.subCategories.length > 0 ? (
            <>
              <button
                className="mobile-menu-toggle"
                onClick={() => toggleMobileSubmenu(category.id)}
              >
                <span>{category.name}</span>
                <ChevronRight
                  className={`chevron ${openMobileMenus[category.id] ? 'rotated' : ''}`}
                  size={20}
                />
              </button>
              {openMobileMenus[category.id] && renderMobileSubMenu(category.subCategories)}
            </>
          ) : (
            <button
              className="mobile-menu-toggle"
              onClick={() => handleCategoryClick(category.id, category.name)}
            >
              <span>{category.name}</span>
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export const TopHeader = () => {
  const dispatch = useDispatch()
  const cookies = new Cookies()
  const navigate = useNavigate()
  const { setAuth, auth } = useAuth()
  
  const datas: any = useSelector((state: any) => state.cart)
  const { socialLinks }: any = useSelector((state: any) => state.socialLinks)
  
  const [sortVisible, setSortVisible] = useState(false)
  const sortRefs = useRef<HTMLDivElement | null>(null)
  const [searchValue, setSearchValue] = useState<string>('')
  const debouncedSearchvalue = useDebounceValue(searchValue)

  useEffect(() => {
    const userId = getCookie('userId')
    userId && dispatch(getCartlistAction({ userId: userId }))
  }, [dispatch])

  useEffect(() => {
    dispatch(
      getSocialLinksAction({
        onSuccess: () => console.log('Social links fetched successfully')
      })
    )
  }, [dispatch])

  const onSearchHandler = useCallback((searchedData: string) => {
    if (searchedData.trim()) {
      navigate(`/products?search=${searchedData}`)
    }
  }, [navigate])

  const handleOutSideClick = (event: any) => {
    const target = document?.getElementById('openModalButtons')
    const children = target?.getElementsByTagName('svg')

    if (
      sortRefs.current &&
      !sortRefs.current.contains(event.target) &&
      event.target !== Array.from(Array.from(children || [])[0]?.children || [])[0]
    ) {
      setSortVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleOutSideClick)
    return () => {
      document.removeEventListener('click', handleOutSideClick)
    }
  }, [])

  const handleLogoutAndRedirect = () => {
    setSortVisible(false)
    removeCookie('userId')
    removeCookie('userRoles')
    cookies.remove('userRoles')
    cookies.remove('userId')
    
    setAuth({
      isLoggedin: false,
      role: 'USER'
    })
    
    navigate('/login', { replace: true })
  }

  return (
    <>
      <div className="header-top">
        <div className="container" style={{ paddingBottom: '0px' }}>
          <ul className="header-social-container">
            <li>
              <a href={socialLinks?.[0]?.socialLinks?.facebook} className="social-link">
                <FaFacebook />
              </a>
            </li>
            <li>
              <a href={socialLinks?.[0]?.socialLinks?.tiktok} className="social-link">
                <FaTiktok />
              </a>
            </li>
            <li>
              <a href={socialLinks?.[0]?.socialLinks?.instagram} className="social-link">
                <FaInstagram />
              </a>
            </li>
          </ul>

          <div className="header-alert-news">
            <p>{socialLinks?.[0]?.offerText}</p>
          </div>

          <div className="header-top-actions">
            {socialLinks?.[0]?.specialSlogan}
          </div>
        </div>
      </div>

      <div className="topHeader-container">
        <div className="topHeader">
          <div className="topHeader-logo" onClick={() => navigate('/home')}>
            <img
              src="/assets/images/logosss.png"
              alt="logo"
              className="topHeader-logo-image"
            />
          </div>

          <div></div>

          <div className="topHeader-search">
            <SearchField
              placeholder="Search Your Product"
              onChange={(e) => {
                onSearchHandler(e.target.value)
              }}
            />
          </div>

          <div className="topHeader-cartProfile">
            <div
              className="topHeader-cartProfile-cart"
              onClick={() => navigate('/cart')}
            >
              {datas?.cartData?.[0]?.products?.length > 0 && auth.isLoggedin && (
                <HStack
                  justify="center"
                  align="center"
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: '50%',
                    background: 'red',
                    color: 'white',
                    position: 'absolute',
                    top: -10,
                    right: -6,
                    backgroundColor: 'hsl(0, 82.48%, 57.45%)'
                  }}
                >
                  {datas?.cartData?.[0]?.products?.length}
                </HStack>
              )}
              <FaCartArrowDown size={24} />
            </div>

            <div 
              className="topHeader-cartProfile-profile" 
              onClick={() => setSortVisible((prev) => !prev)}
              style={{ padding: '10px' }}
            >
              <VStack className="sortMainContainer">
                <HStack id="openModalButtons" style={{ cursor: 'pointer' }}>
                  <FaUserAlt size={24} />
                </HStack>

                <div
                  className="sortModalContainer"
                  style={{ 
                    scale: sortVisible ? '1' : '0', 
                    minWidth: '120px',
                    transformOrigin: 'top right'
                  }}
                  ref={sortRefs}
                >
                  <VStack>
                    <HStack 
                      align="center" 
                      gap="$3" 
                      className="filterItem"
                      onClick={() => {
                        setSortVisible(false)
                        navigate('/my-profile')
                      }}
                    >
                      <p>My Profile</p>
                    </HStack>

                    {auth.isLoggedin ? (
                      <HStack
                        align="center"
                        gap="$3"
                        className="filterItem"
                        onClick={handleLogoutAndRedirect}
                      >
                        <p>Logout</p>
                      </HStack>
                    ) : (
                      <HStack
                        align="center"
                        gap="$3"
                        className="filterItem"
                        onClick={() => {
                          navigate('/register')
                          setSortVisible(false)
                        }}
                      >
                        <p>Register</p>
                      </HStack>
                    )}
                  </VStack>
                </div>
              </VStack>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const Header = () => {
  const media = useMedia()

  const handleSideNav = useCallback(() => {
    // This callback is passed to Sidebar but handled internally by Sidebar
  }, [])

  return (
    <>
      {media.md ? (
        <DesktopHeader />
      ) : (
        <Sidebar handleClose={handleSideNav}>
          <MobileNavigation />
        </Sidebar>
      )}
    </>
  )
}