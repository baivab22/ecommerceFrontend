import {
  FaCartArrowDown,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaUserAlt
} from 'react-icons/fa'
import { SearchField, VStack, HStack } from 'src/app/common'
import { useState, useRef, useEffect, useCallback } from 'react'
import { SearchDropdown } from '../search/SearchDropdown'
import { useDebounceValue, useMedia } from 'src/hooks'
import { Sidebar } from '../headerDrawer/headerDrawer.component'
import { useDispatch, useSelector } from 'src/store'
import { getProductListAction } from 'src/app/pages/products/product.slice'

import { getCookie, removeCookie } from 'src/helpers'
import { getCartlistAction } from 'src/app/pages/web/cart/cart.slice'
import { getCategoryListAction } from 'src/app/pages/category/category.slice'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'src/app/routing'
import Cookies from 'universal-cookie'
import { getSocialLinksAction } from 'src/app/pages/socialLinks/socialLinks.slice'
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import './_header.scss'
import { BASE_URL } from 'src/config'

// Desktop Navigation Skeleton
const DesktopNavigationSkeleton = () => {
  const skeletonStyle: React.CSSProperties = {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px'
  }

  const menuItemStyle: React.CSSProperties = {
    height: '20px',
    width: '80px',
    ...skeletonStyle
  }

  return (
    <div className="navmenuList">
      <div className="navmenuContainer">
        <nav className="desktop-nav">
          <ul className="desktop-menu" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {Array.from({ length: 7 }).map((_, index) => (
              <li key={index} className="desktop-menu-item">
                <div style={{...menuItemStyle, width: `${70 + Math.random() * 40}px`}}></div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  )
}

// Mobile Navigation Skeleton
const MobileNavigationSkeleton = () => {
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

  return (
    <div className="mobile-menu-list">
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} style={menuItemStyle}></div>
      ))}
    </div>
  )
}

// Top Header Skeleton
const TopHeaderSkeleton = () => {
  const skeletonStyle: React.CSSProperties = {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px'
  }

  return (
    <>
      <div className="header-top">
        <div className="container" style={{ paddingTop:'10px' }}>
          <ul className="header-social-container" style={{ display: 'flex', gap: '8px' }}>
            {Array.from({ length: 3 }).map((_, index) => (
              <li key={index}>
                <div style={{ width: '24px', height: '24px', ...skeletonStyle, borderRadius: '50%' }}></div>
              </li>
            ))}
          </ul>

          <div className="header-alert-news">
            <div style={{ width: '200px', height: '16px', ...skeletonStyle }}></div>
          </div>

          <div className="header-top-actions">
            <div style={{ width: '120px', height: '16px', ...skeletonStyle }}></div>
          </div>
        </div>
      </div>

      <div className="topHeader-container">
        <div className="topHeader">
          <div className="topHeader-logo">
            <div style={{ width: '120px', height: '60px', ...skeletonStyle }}></div>
          </div>

          <div></div>

          <div className="topHeader-search">
            <div style={{ width: '100%', height: '40px', ...skeletonStyle }}></div>
          </div>

          <div className="topHeader-cartProfile">
            <div className="topHeader-cartProfile-cart">
              <div style={{ width: '24px', height: '24px', ...skeletonStyle }}></div>
            </div>

            <div className="topHeader-cartProfile-profile" style={{ padding: '10px' }}>
              <div style={{ width: '24px', height: '24px', ...skeletonStyle }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const DesktopHeader = () => {
  const { categoryData, loading }: any = useSelector((state: any) => state.category)
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

  useEffect(() => {
    return () => {
      Object.values(closeTimeoutRef.current).forEach(timeout => clearTimeout(timeout))
    }
  }, [])

  const handleDesktopMouseEnter = (id: string) => {
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
    closeTimeoutRef.current[id] = setTimeout(() => {
      setOpenDesktopMenus(prev => ({
        ...prev,
        [id]: false
      }))
      delete closeTimeoutRef.current[id]
    }, 150)
  }

  const handleAllProductsClick = () => {
    navigate('/products')
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

  if (loading || !categoryData) {
    return <DesktopNavigationSkeleton />
  }

  return (
    <div className="navmenuList">
      <div className="navmenuContainer">
        <nav className="desktop-nav">
          <ul className="desktop-menu">
            <li className="desktop-menu-item">
              <button
                className="desktop-menu-link"
                onClick={handleAllProductsClick}
              >
                <span>All</span>
              </button>
            </li>

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
  const { categoryData, loading }: any = useSelector((state: any) => state.category)
  const [openMobileMenus, setOpenMobileMenus] = useState<Record<string, boolean>>({})
  const navigate = useNavigate()

  const toggleMobileSubmenu = (id: string) => {
    setOpenMobileMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleAllProductsClick = () => {
    navigate('/products')
    onClose?.()
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

  if (loading || !categoryData) {
    return <MobileNavigationSkeleton />
  }

  return (
    <div className="mobile-menu-list">
      <div className="mobile-menu-item">
        <button
          className="mobile-menu-toggle"
          onClick={handleAllProductsClick}
        >
          <span>All</span>
        </button>
      </div>

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
  const { socialLinks, loading: socialLinksLoading }: any = useSelector((state: any) => state.socialLinks)
  
  const [sortVisible, setSortVisible] = useState(false)
  const [searchDropdownVisible, setSearchDropdownVisible] = useState(false)
  const searchInputRef = useRef<HTMLDivElement | null>(null)
  const sortRefs = useRef<HTMLDivElement | null>(null)
  const [searchValue, setSearchValue] = useState<string>('')
  const debouncedSearchValue = useDebounceValue(searchValue, 500)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const isAdminLoggedIn = auth.isLoggedin && String(auth.role).toUpperCase() === 'ADMIN'

  // Fetch cart on mount if user is logged in
  useEffect(() => {
    const userId = getCookie('userId')
    if (userId) {
      dispatch(getCartlistAction({ userId: userId }))
    }
  }, [dispatch])

  // Fetch social links on mount
  useEffect(() => {
    dispatch(
      getSocialLinksAction({
        onSuccess: () => console.log('Social links fetched successfully')
      })
    )
  }, [dispatch])

  // Search products from API whenever debounced search value changes
  useEffect(() => {
    if (!debouncedSearchValue.trim()) {
      setSearchResults([])
      setIsSearchLoading(false)
      return
    }

    const searchProducts = async () => {
      setIsSearchLoading(true)
      
      const queryParams = {
        search: debouncedSearchValue.trim(),
        limit: 50,
        page: 1,
        sort: 'createdAt',
        order: 'desc'
      }

      try {
        const result = await dispatch(
          getProductListAction({
            query: queryParams,
            onSuccess: () => {}
          })
        ).unwrap()
        
        const products = result?.data || result?.products || result || []
        setSearchResults(Array.isArray(products) ? products : [])
      } catch (error) {
        console.error('Search failed:', error)
        setSearchResults([])
      } finally {
        setIsSearchLoading(false)
      }
    }

    searchProducts()
  }, [debouncedSearchValue, dispatch])

  // Helper: Levenshtein distance
  const levenshtein = useCallback((a: string, b: string): number => {
    const an = a ? a.length : 0;
    const bn = b ? b.length : 0;
    if (an === 0) return bn;
    if (bn === 0) return an;
    const matrix = Array.from({ length: bn + 1 }, (_, i) => [i]);
    for (let j = 0; j <= an; j++) matrix[0][j] = j;
    for (let i = 1; i <= bn; i++) {
      for (let j = 1; j <= an; j++) {
        if (b[i - 1] === a[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[bn][an];
  }, []);

  // Search handler for Enter key
  const onSearchHandler = useCallback((searchedData: string) => {
    if (!searchedData.trim()) return;
    
    const lowerSearch = searchedData.trim().toLowerCase();
    
    // Try to find exact match from search results
    const exactMatch = searchResults.find((p: any) => 
      p.name?.trim().toLowerCase() === lowerSearch
    );
    
    if (exactMatch) {
      navigate(`/products/view/${exactMatch.id}`);
      setSearchDropdownVisible(false);
      setSearchValue('');
      return;
    }
    
    // Try to find close match using Levenshtein distance
    const closeMatch = searchResults.find((p: any) => {
      const name = p.name?.trim().toLowerCase() || '';
      return levenshtein(name, lowerSearch) <= 2;
    });
    
    if (closeMatch) {
      navigate(`/products/view/${closeMatch.id}`);
      setSearchDropdownVisible(false);
      setSearchValue('');
      return;
    }
    
    // Navigate to search results page
    navigate(`/products?search=${encodeURIComponent(searchedData.trim())}`);
    setSearchDropdownVisible(false);
    setSearchValue('');
  }, [searchResults, navigate, levenshtein]);

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

  if (socialLinksLoading) {
    return <TopHeaderSkeleton />
  }

  // Handle product click from dropdown
  const handleProductClick = (product: any) => {
    navigate(`/products/view/${product.id}`)
    setSearchDropdownVisible(false)
    setSearchValue('')
  }

  return (
    <>
      <div className="header-top">
        <div className="container" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
          <ul className="header-social-container">
            <li>
              <a href={socialLinks?.[0]?.socialLinks?.facebook} className="social-link" target="_blank" rel="noopener noreferrer">
                <FaFacebook style={{ color: '#1877F3' }} size={16}/>
              </a>
            </li>
            <li>
              <a href={socialLinks?.[0]?.socialLinks?.tiktok} className="social-link" target="_blank" rel="noopener noreferrer">
                <FaTiktok style={{ color: '#010101' }} size={16} />
              </a>
            </li>
            <li>
              <a href={socialLinks?.[0]?.socialLinks?.instagram} className="social-link" target="_blank" rel="noopener noreferrer">
                <FaInstagram style={{ color: '#E4405F' }} size={16} />
              </a>
            </li>
          </ul>

          <div className="header-alert-news" style={{ fontSize: '14px' }}>
            <p>{socialLinks?.[0]?.offerText}</p>
          </div>

          <div className="header-top-actions">
            {socialLinks?.[0]?.specialSlogan}
          </div>
        </div>
      </div>

      <div className="topHeader-container">
        <div className="topHeader">
          <div className="topHeader-logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
            <img
              src={BASE_URL + '/logo'}
              alt="logo"
              className="topHeader-logo-image"
              onError={e => { e.currentTarget.src = '/assets/images/logosss.png'; }}
            />
          </div>

          <div></div>

          <div className="topHeader-search" style={{ position: 'relative' }} ref={searchInputRef}>
            <SearchField
              placeholder="Search Your Product"
              value={searchValue}
              onChange={e => {
                const value = e.target.value;
                setSearchValue(value);
                if (!value.trim()) {
                  setSearchResults([]);
                  setSearchDropdownVisible(false);
                } else {
                  setSearchDropdownVisible(true);
                }
              }}
              onFocus={() => {
                if (searchValue.trim()) {
                  setSearchDropdownVisible(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => setSearchDropdownVisible(false), 200);
              }}
              style={{ width: '100%' }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onSearchHandler(searchValue);
                }
              }}
            />
            {searchDropdownVisible && (
              <div style={{ width: '100%', position: 'absolute', top: '100%', left: 0, zIndex: 1000 }}>
                <SearchDropdown
                  onClose={() => setSearchDropdownVisible(false)}
                  suggestedProducts={searchResults}
                  searchValue={searchValue}
                  onProductClick={handleProductClick}
                  isLoading={isSearchLoading}
                />
              </div>
            )}
          </div>

          <div className="topHeader-cartProfile">
            <div
              className="topHeader-cartProfile-cart"
              onClick={() => navigate('/cart')}
              style={{ position: 'relative', cursor: 'pointer' }}
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
              onClick={(e) => {
                e.stopPropagation()
                setSortVisible((prev) => !prev)}}
              style={{ padding: '10px', cursor: 'pointer' }}
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
                    transformOrigin: 'top right',
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    zIndex: 1000,
                    transition: 'scale 0.2s ease',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                  ref={sortRefs}
                >
                  <VStack style={{ padding: '8px 0' }}>
                    {isAdminLoggedIn && (
                      <HStack
                        align="center"
                        gap="$3"
                        className="filterItem"
                        onClick={() => {
                          setSortVisible(false)
                          navigate('/dash-product')
                        }}
                        style={{ padding: '8px 16px', cursor: 'pointer', width: '100%', transition: 'background-color 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                      >
                        <p>Go to Dashboard</p>
                      </HStack>
                    )}

                    {auth.isLoggedin && (
                      <HStack 
                        align="center" 
                        gap="$3" 
                        className="filterItem"
                        onClick={() => {
                          setSortVisible(false)
                          navigate('/my-profile')
                        }}
                        style={{ padding: '8px 16px', cursor: 'pointer', width: '100%', transition: 'background-color 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                      >
                        <p>My Profile</p>
                      </HStack>
                    )}

                    {auth.isLoggedin ? (
                      <HStack
                        align="center"
                        gap="$3"
                        className="filterItem"
                        onClick={handleLogoutAndRedirect}
                        style={{ padding: '8px 16px', cursor: 'pointer', width: '100%', transition: 'background-color 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
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
                        style={{ padding: '8px 16px', cursor: 'pointer', width: '100%', transition: 'background-color 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
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
       <>
      {/* <TopHeader /> */}
      {media.md && <DesktopHeader />}
      {!media.md && (
        <Sidebar handleClose={handleSideNav}>
          <MobileNavigation />
        </Sidebar>
      )}
    </>
 
    </>
  )
}