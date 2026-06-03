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
import { OptimizedImage } from 'src/app/common/OptimizedImage/OptimizedImage.component'
import { useDebounceValue, useMedia } from 'src/hooks'
import { Sidebar } from '../headerDrawer/headerDrawer.component'
import { useDispatch, useSelector } from 'src/store'
import { productService } from 'src/app/pages/products/product.service'

import { getCookie, removeCookie } from 'src/helpers'
import { getCartlistAction } from 'src/app/pages/web/cart/cart.slice'
import { getCategoryListAction } from 'src/app/pages/category/category.slice'
import { useRouter } from 'next/router'
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
          <ul className="desktop-menu">
            {Array.from({ length: 7 }).map((_, index) => (
              <li key={index} className="desktop-menu-item">
                <div style={{ ...menuItemStyle, width: `${70 + Math.random() * 40}px` }} />
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
        <div className="container" style={{ paddingTop: '10px' }}>
          <ul className="header-social-container" style={{ display: 'flex', gap: '8px' }}>
            {Array.from({ length: 3 }).map((_, index) => (
              <li key={index}>
                <div style={{ width: '24px', height: '24px', ...skeletonStyle, borderRadius: '50%' }} />
              </li>
            ))}
          </ul>

          <div className="header-alert-news">
            <div style={{ width: '200px', height: '16px', ...skeletonStyle, marginBottom: '8px' }} />
          </div>

          <div className="header-top-actions">
            <div style={{ width: '120px', height: '16px', ...skeletonStyle }} />
          </div>
        </div>
      </div>

      <div className="topHeader-container">
        <div className="topHeader">
          <div className="topHeader-logo">
            <div style={{ width: '120px', height: '60px', ...skeletonStyle }} />
          </div>

          <div />

          <div className="topHeader-search">
            <div style={{ width: '100%', height: '40px', ...skeletonStyle }} />
          </div>

          <div className="topHeader-cartProfile">
            <div className="topHeader-cartProfile-cart">
              <div style={{ width: '24px', height: '24px', ...skeletonStyle }} />
            </div>

            <div className="topHeader-cartProfile-profile" style={{ padding: '10px' }}>
              <div style={{ width: '24px', height: '24px', ...skeletonStyle }} />
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
  const router = useRouter()

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

  // Navigate to all products page
  const handleAllProductsClick = () => {
    router.push('/products')
  }

  // Navigate to category - only pass categoryId
  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    router.push(`/products?categoryId=${categoryId}&categoryname=${categoryName}`)
  }

  // Navigate to subcategory - only pass subCategoryId (backend handles hierarchy)
  const handleSubCategoryClick = (subCategoryId: string, subCategoryName?: string) => {
    router.push(`/products?subCategoryId=${subCategoryId}${subCategoryName ? `&subCategoryName=${subCategoryName}` : ''}`)
  }

  // Navigate to nested subcategory - only pass nestedSubCategoryId (highest priority)
  const handleNestedSubCategoryClick = (nestedSubCategoryId: string, nestedSubCategoryName?: string) => {
    router.push(`/products?nestedSubCategoryId=${nestedSubCategoryId}${nestedSubCategoryName ? `&nestedSubCategoryName=${nestedSubCategoryName}` : ''}`)
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
                  console.log(level,"levellll nested clicked")
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
            {/* All Products Menu Item */}
            <li className="desktop-menu-item">
              <button
                className="desktop-menu-link"
                onClick={handleAllProductsClick}
              >
                <span>All</span>
              </button>
            </li>

            {/* Regular Category Menu Items */}
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
  const router = useRouter()

  const toggleMobileSubmenu = (id: string) => {
    setOpenMobileMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Navigate to all products page
  const handleAllProductsClick = () => {
    router.push('/products')
    onClose?.()
  }

  // Navigate to category - only pass categoryId
  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    router.push(`/products?categoryId=${categoryId}&categoryname=${categoryName}`)
    onClose?.()
  }

  // Navigate to subcategory - only pass subCategoryId (backend handles hierarchy)
  const handleSubCategoryClick = (subCategoryId: string, subCategoryName?: string) => {
    router.push(`/products?subCategoryId=${subCategoryId}${subCategoryName ? `&subCategoryName=${subCategoryName}` : ''}`)
    onClose?.()
  }

  // Navigate to nested subcategory - only pass nestedSubCategoryId (highest priority)
  const handleNestedSubCategoryClick = (nestedSubCategoryId: string, nestedSubCategoryName?: string) => {
    router.push(`/products?nestedSubCategoryId=${nestedSubCategoryId}${nestedSubCategoryName ? `&nestedSubCategoryName=${nestedSubCategoryName}` : ''}`)
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
      {/* All Products Menu Item */}
      <div className="mobile-menu-item">
        <button
          className="mobile-menu-toggle"
          onClick={handleAllProductsClick}
        >
          <span>All</span>
        </button>
      </div>

      {/* Regular Category Menu Items */}
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
  const router = useRouter()
  const { setAuth, auth } = useAuth()
  
  const datas: any = useSelector((state: any) => state.cart)
  const { socialLinks, loading: socialLinksLoading }: any = useSelector((state: any) => state.socialLinks)
  
  const [sortVisible, setSortVisible] = useState(false)
  const [searchDropdownVisible, setSearchDropdownVisible] = useState(false)
  const searchInputRef = useRef<HTMLDivElement | null>(null)
  const sortRefs = useRef<HTMLDivElement | null>(null)
  const [searchValue, setSearchValue] = useState<string>('')
  const debouncedSearchValue = useDebounceValue(searchValue, 300) // Optimized debounce
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([])
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const isAdminLoggedIn = auth.isLoggedin && String(auth.role).toUpperCase() === 'ADMIN'

  useEffect(() => {
    const userId = getCookie('userId')
    if (userId) {
      dispatch(getCartlistAction({ userId }))
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(
      getSocialLinksAction({
        onSuccess: () => console.log('Social links fetched successfully')
      })
    )
  }, [dispatch])

  // Update suggestions on input change
  useEffect(() => {
    if (!debouncedSearchValue.trim()) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      setSuggestedProducts([])
      setIsSearchLoading(false)
      return
    }

    setIsSearchLoading(true)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    productService
      .getProductList({ search: debouncedSearchValue.trim(), limit: 20 })
      .then((response) => {
        if (controller.signal.aborted) return
        setSuggestedProducts(response.data || [])
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        console.error('Search dropdown query failed:', error)
        setSuggestedProducts([])
      })
      .finally(() => {
        if (controller.signal.aborted) return
        setIsSearchLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [debouncedSearchValue])

  // Helper: Levenshtein distance
  function levenshtein(a: string, b: string): number {
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
  }

  // Search handler for Enter key
  const onSearchHandler = useCallback((searchedData: string) => {
    if (!searchedData.trim()) return;

    const lowerSearch = searchedData.trim().toLowerCase();

    // Prefer exact or close match from fetched suggestions
    const almostExact = suggestedProducts.find((p: any) => {
      const name = p.name.trim().toLowerCase();
      return (
        name.startsWith(lowerSearch) ||
        levenshtein(name, lowerSearch) <= 2
      );
    });

    if (almostExact) {
      router.push(`/products/view/${almostExact.id}`)
      setSearchDropdownVisible(false);
      setSearchValue('');
      return;
    }

    // Navigate to search results page
    router.push(`/products?search=${encodeURIComponent(searchedData.trim())}`)
    setSearchDropdownVisible(false);
    setSearchValue('');
  }, [suggestedProducts, router]);

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
    
    router.replace('/login')
  }

  if (socialLinksLoading) {
    return <TopHeaderSkeleton />
  }

  // Handle product click from dropdown
  const handleProductClick = (product: any) => {
    router.push(`/products/view/${product.id}`)
    setSearchDropdownVisible(false)
    setSearchValue('') // Clear search input
  }

  return (
    <>
      <div className="header-top">
        <div className="container" style={{ paddingBottom: '10px',paddingTop:'10px' }}>
          <ul className="header-social-container">
            <li>
              <a href={socialLinks?.[0]?.socialLinks?.facebook} className="social-link" target="_blank" rel="noopener noreferrer">
                <FaFacebook  style={{ color: '#1877F3' }} size={16}/>
              </a>
            </li>
            <li>
              <a href={socialLinks?.[0]?.socialLinks?.tiktok} className="social-link" target="_blank" rel="noopener noreferrer">
                <FaTiktok style={{ color: '#010101' }} size={16} />
              </a>
            </li>
            <li>
              <a href={socialLinks?.[0]?.socialLinks?.instagram} className="social-link" target="_blank" rel="noopener noreferrer">
                <FaInstagram style={{ color: '#E4405F' }}  size={16} />
              </a>
            </li>
          </ul>

          <div className="header-alert-news" style={{fontSize:'14px'}}>
            <p>{socialLinks?.[0]?.offerText}</p>
          </div>

          <div className="header-top-actions">
            {socialLinks?.[0]?.specialSlogan}
          </div>
        </div>
      </div>

      <div className="topHeader-container">
        <div className="topHeader">
          <div className="topHeader-logo" onClick={() => router.push('/home')}>
            <div style={{ position: 'relative', height: '100px',width:'150px' }}>
              <OptimizedImage
                src='/assets/images/logosss.png'
                alt="logo"
                fill
                objectFit="contain"
                className="topHeader-logo-image"
                onError={() => {
                  /* fallback managed by OptimizedImage */
                }}
              />
            </div>
          </div>

          <div></div>

          <div className="topHeader-search" style={{ position: 'relative' }} ref={searchInputRef}>
            <SearchField
              placeholder="Search Your Product"
              value={searchValue}
              onChange={e => {
                const value = e.target.value;
                setSearchValue(value);
                // Show/hide dropdown based on input
                if (!value.trim()) {
                  setSuggestedProducts([]);
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
                // Slight delay to allow click on dropdown items
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
              <div style={{ width: '100%' }}>
                <SearchDropdown
                  onClose={() => setSearchDropdownVisible(false)}
                  suggestedProducts={suggestedProducts}
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
              onClick={() => router.push('/cart')}
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

                    {isAdminLoggedIn && (
                      <HStack
                        align="center"
                        gap="$3"
                        className="filterItem"
                        onClick={() => {
                          setSortVisible(false)
                          router.push('/dash-product')
                        }}
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
                        router.push('/my-profile')
                      }}
                    >
                      <p>My Profile</p>
                    </HStack>)}

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
                          router.push('/register')
                          setSortVisible(false)
                        }}
                      >
                       <p className="text-[16px]">Register</p>
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
  )}