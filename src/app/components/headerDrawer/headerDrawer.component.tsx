import React, { useState, useEffect } from 'react'
import { Menu, X, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'src/store'
import { getCategoryListAction } from 'src/app/pages/category/category.slice'
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
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={`main-${index}`}>
          <div style={menuItemStyle}></div>
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

// Mobile Navigation Component
const MobileNavigation = ({ onClose }: { onClose?: () => void }) => {
  const { categoryData, loading }: any = useSelector((state: any) => state.category)
  const [openMobileMenus, setOpenMobileMenus] = useState<Record<string, boolean>>({})
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!categoryData) {
      dispatch(
        getCategoryListAction({
          onSuccess: () => {}
        })
      )
    }
  }, [dispatch, categoryData])

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
                  className="mobile-submenu-link"
                  onClick={() => {
                    if (level === 0) {
                      handleSubCategoryClick(subCat.id, subCat.name)
                    } else {
                      handleNestedSubCategoryClick(subCat.id, subCat.name)
                    }
                  }}
                >
                  <span>{subCat.name}</span>
                  <ChevronRight
                    className={`chevron ${openMobileMenus[subCat.id] ? 'rotated' : ''}`}
                    size={18}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleMobileSubmenu(subCat.id)
                    }}
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
                <span>{subCat.name}</span>
              </button>
            )}
          </li>
        ))}
      </ul>
    )
  }

  if (loading || !categoryData) {
    return <MobileMenuSkeleton />
  }

  return (
    <div className="mobile-menu-list">
      {categoryData?.map((category: any) => (
        <div key={category.id} className="mobile-menu-item">
          {category.subCategories && category.subCategories.length > 0 ? (
            <>
              <button
                className="mobile-menu-toggle"
                onClick={() => handleCategoryClick(category.id, category.name)}
              >
                <span>{category.name}</span>
                <ChevronRight
                  className={`chevron ${openMobileMenus[category.id] ? 'rotated' : ''}`}
                  size={20}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleMobileSubmenu(category.id)
                  }}
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
        
        {/* Render Mobile Navigation */}
        <div className="mobile-menu-content">
          <MobileNavigation onClose={closeMobileMenu} />
        </div>
      </div>
    </>
  )
}

export default Sidebar