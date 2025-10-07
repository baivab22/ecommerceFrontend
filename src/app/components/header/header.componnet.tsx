

import {
  FaCartArrowDown,
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaOpencart,
  FaTiktok,
  FaUserAlt
} from 'react-icons/fa'
import Dropdown from 'react-multilevel-dropdown'
import {HStack, SearchField, VStack} from 'src/app/common'
import {useDebounceValue, useMedia} from 'src/hooks'
import {Sidebar} from '../headerDrawer/headerDrawer.component'
import {AiFillAccountBook, AiOutlineAccountBook} from 'react-icons/ai'
import {RiArrowDropDownLine} from 'react-icons/ri'
import {useDispatch, useSelector} from 'src/store'
import {Children, useCallback, useEffect, useRef, useState} from 'react'
import {getCookie, removeCookie} from 'src/helpers'
import {getCartlistAction} from 'src/app/pages/web/cart/cart.slice'
import {getCategoryListAction} from 'src/app/pages/category/category.slice'
import {HiSearchCircle} from 'react-icons/hi'
import {getProductListAction} from 'src/app/pages/products/product.slice'
import {useNavigate} from 'react-router-dom'
import {SideNav} from 'src/app/routing/sideNav/sidenav.component'
import {useAuth} from 'src/app/routing'
import Cookies from 'universal-cookie'
import {getSocialLinksAction} from 'src/app/pages/socialLinks/socialLinks.slice'

export const DesktopHeader = () => {
  const [category, setCategory] = useState<any>()
  const {categoryData}: any = useSelector((state: any) => state.category)
  const [menyList, setMenuList] = useState<any>()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(
      getCategoryListAction({
        onSuccess: () => {}
      })
    )
  }, [])

  const cookies = new Cookies()

  useEffect(() => {
    const mappedCategoryWeb = categoryData?.map((item: any, index: number) => {
      if (item?.subCategories?.length > 0) {
        return {
          key: index,
          name: item.name,
          link: item.name,
          type: 'page',
          hasChildren: true,
          id: item.id,
          children: item.subCategories?.map((itemSub, indexSub) => {
            return {
              key: indexSub + index,
              name: itemSub.name,
              id: itemSub.id,
              link: item.name / itemSub.name,
              type: 'page',
              hasChildren: itemSub.subCategories.length > 0,
              children: itemSub.subCategories?.map(
                (itemSubSub, indexSubSub) => {
                  return {
                    key: indexSubSub + indexSub + index,
                    name: itemSubSub.name,
                    id: itemSubSub.id
                  }
                }
              )
            }
          })
        }
      } else {
        return {
          name: item.name,
          link: item.name,
          type: 'page'
        }
      }
    })

    setCategory(mappedCategoryWeb)
  }, [categoryData])

  const menus = [
    {
      name: 'NECKLACE',
      link: '/page/necklace',
      type: 'page'
    },
    {
      name: 'BRACELET',
      link: '/page/bracelet',
      type: 'page',
      hasChildren: true,
      children: [
        {
          name: 'Modern Bracelet',
          link: '/pages/bracelet/modern',
          type: 'page',
          hasChildren: true,
          children: [
            {
              name: "Men's",
              link: '/pages/bracelet/modern/men',
              type: 'page',
              hasChildren: true,

              children: [
                {
                  name: '2021',
                  link: '/pages/bracelet/modern/men/2021',
                  type: 'page'
                }
              ]
            },
            {
              name: "Women's",
              link: '/pages/bracelet/modern/women',
              type: 'page',
              hasChildren: true,
              children: [
                {
                  name: 'Original',
                  link: '/pages/bracelet/nepali/original',
                  type: 'page'
                }
              ]
            }
          ]
        },
        {
          name: 'Traditional',
          link: '/pages/bracelet/traditional',
          type: 'page',
          hasChildren: true,
          children: [
            {
              name: 'Chain',
              link: '/pages/bracelet/traditional/chain',
              type: 'page'
            }
          ]
        }
      ]
    },
    {
      name: 'Bangles',
      link: '/page/bangles',
      type: 'page',
      hasChildren: true,
      children: [
        {
          name: 'Gold Bangles',
          link: '/pages/bangles/gold Bangles',
          type: 'page'
        },
        {
          name: 'Silver Bangles',
          link: '/pages/bangles/SilverBangles',
          type: 'page'
        }
      ]
    },
    {
      name: 'Rings',
      link: '/page/rings',
      type: 'page',
      hasChildren: true,
      children: [
        {
          name: 'Gold ring',
          link: '/pages/rings/gold',
          type: 'page'
        },
        {
          name: 'Diamond ring',
          link: '/pages/rings/diamond',
          type: 'page'
        }
      ]
    },
    {
      name: 'EarRings',
      link: '/page/earrings',
      type: 'page',
      hasChildren: true,
      children: [
        {
          name: 'Gold',
          link: '/pages/rings/gold',
          type: 'page'
        },
        {
          name: 'Diamond',
          link: '/pages/rings/diamond',
          type: 'page'
        }
      ]
    },
    {
      name: 'Pendants',
      link: '/page/pendants',
      type: 'page',
      hasChildren: true,
      children: [
        {
          name: 'Gold',
          link: '/pages/pendants/gold',
          type: 'page'
        },
        {
          name: 'Diamond',
          link: '/pages/pendants/diamond',
          type: 'page'
        }
      ]
    }
  ]
  const navigate = useNavigate()
  return (
    <div className="navmenuList">
      <div className="navmenuContainer">
        {category?.map((menu, index) => (
          <Dropdown
          // openOnHover={true}
            key={index}
            title={
              <HStack
                gap="$1"
                align="center"
                onClick={() => {
                  navigate(
                    `/products?categoryId=${menu.id}&categoryname=${menu.name}`
                  )
                  // dispatch(
                  //   getProductListAction({
                  //     onSuccess: () => {},
                  //     query: {
                  //       categoryId: menu.id
                  //     }
                  //   })
                  // )
                }}
              >
                <p className="menuText">{menu.name}</p>

                {menu.hasChildren && <RiArrowDropDownLine size={22} />}
              </HStack>
            }
            // menuclassName="text-14 py-8 px-5 my-0 mx-16 border-b-1 border-solid border-blue hover:border-black flex "
          >
            {menu.children &&
              menu.children?.map((item) => (
                <>
                  <Dropdown.Item
                    key={item.id}
                    onClick={() => {
                      // navigate('/products')
                      navigate(`/products?subCategoryId=${item.id}`)
                    }}
                  >
                    <HStack gap="$3" align="center">
                      <p className="menuText">{item.name}</p>{' '}
                      {item.hasChildren && (
                        <div>
                          <RiArrowDropDownLine size={22} />
                        </div>
                      )}
                    </HStack>

                    {item.children &&
                      item?.children?.map((submenu) => (
                        <Dropdown.Submenu position="right">
                          <Dropdown.Item>{submenu.name}</Dropdown.Item>
                          {item.children &&
                            item?.children?.map((submenu) => (
                              <Dropdown.Submenu position="right">
                                <Dropdown.Item className="menuText">
                                  {submenu.name}
                                </Dropdown.Item>
                              </Dropdown.Submenu>
                            ))}
                        </Dropdown.Submenu>
                      ))}
                  </Dropdown.Item>
                </>
              ))}
          </Dropdown>
        ))}

        {/* <nav className="desktop-navigation-menu">
          <div className="container">
            <ul className="desktop-menu-category-list">
              <li className="menu-category">
                <a href="#" className="menu-title">
                  Home
                </a>
              </li>

              <li className="menu-category">
                <a href="#" className="menu-title">
                  Categories
                </a>

                <div className="dropdown-panel">
                  <ul className="dropdown-panel-list">
                    <li className="menu-title">
                      <a href="#">Electronics</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Desktop</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Laptop</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Camera</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Tablet</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Headphone</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">
                        <img
                          src="./assets/images/electronics-banner-1.jpg"
                          alt="headphone collection"
                          width="250"
                          height="119"
                        />
                      </a>
                    </li>
                  </ul>

                  <ul className="dropdown-panel-list">
                    <li className="menu-title">
                      <a href="#">Men's</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Formal</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Casual</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Sports</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Jacket</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Sunglasses</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">
                        <img
                          src="./assets/images/mens-banner.jpg"
                          alt="men's fashion"
                          width="250"
                          height="119"
                        />
                      </a>
                    </li>
                  </ul>

                  <ul className="dropdown-panel-list">
                    <li className="menu-title">
                      <a href="#">Women's</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Formal</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Casual</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Perfume</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Cosmetics</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Bags</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">
                        <img
                          src="./assets/images/womens-banner.jpg"
                          alt="women's fashion"
                          width="250"
                          height="119"
                        />
                      </a>
                    </li>
                  </ul>

                  <ul className="dropdown-panel-list">
                    <li className="menu-title">
                      <a href="#">Electronics</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Smart Watch</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Smart TV</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Keyboard</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Mouse</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">Microphone</a>
                    </li>

                    <li className="panel-list-item">
                      <a href="#">
                        <img
                          src="./assets/images/electronics-banner-2.jpg"
                          alt="mouse collection"
                          width="250"
                          height="119"
                        />
                      </a>
                    </li>
                  </ul>
                </div>
              </li>

              <li className="menu-category">
                <a href="#" className="menu-title">
                  Men's
                </a>

                <ul className="dropdown-list">
                  <li className="dropdown-item">
                    <a href="#">Shirt</a>
                  </li>

                  <li className="dropdown-item">
                    <a href="#">Shorts & Jeans</a>
                  </li>

                  <li className="dropdown-item">
                    <a href="#">Safety Shoes</a>
                  </li>

                  <li className="dropdown-item">
                    <a href="#">Wallet</a>
                  </li>
                </ul>
              </li>

              <li className="menu-category">
                <a href="#" className="menu-title">
                  Women's
                </a>

                <ul className="dropdown-list">
                  <li className="dropdown-item">
                    <a href="#">Dress & Frock</a>
                  </li>

                  <li className="dropdown-item">
                    <a href="#">Earrings</a>
                  </li>

                  <li className="dropdown-item">
                    <a href="#">Necklace</a>
                  </li>

                  <li className="dropdown-item">
                    <a href="#">Makeup Kit</a>
                  </li>
                </ul>
              </li>

              <li className="menu-category">
                <a href="#" className="menu-title">
                  Jewelry
                </a>

                <ul className="dropdown-list">
                  <li className="dropdown-item">
                    <a href="#">Earrings</a>
                  </li>

                  <li className="dropdown-item">
                    <a href="#">Couple Rings</a>
                  </li>

                  <li className="dropdown-item">
                    <a href="#">Necklace</a>
                  </li>

                  <li className="dropdown-item">
                    <a href="#">Bracelets</a>
                  </li>
                </ul>
              </li>

              <li className="menu-category">
                <a href="#" className="menu-title">
                  Perfume
                </a>

                <ul className="dropdown-list">
                  <li className="dropdown-item">
                    <a href="#">Clothes Perfume</a>
                  </li>

                  <li className="dropdown-item">
                    <a href="#">Deodorant</a>
                  </li>

                  <li className="dropdown-item">
                    <a href="#">Flower Fragrance</a>
                  </li>

                  <li className="dropdown-item">
                    <a href="#">Air Freshener</a>
                  </li>
                </ul>
              </li>

              <li className="menu-category">
                <a href="#" className="menu-title">
                  Blog
                </a>
              </li>

              <li className="menu-category">
                <a href="#" className="menu-title">
                  Hot Offers
                </a>
              </li>
            </ul>
          </div>
        </nav> */}
      </div>

      {/* <Dropdown title="Dropdown title" position="right">
        <Dropdown.Item>Item 1</Dropdown.Item>
        <Dropdown.Item>
          Item 2
          <Dropdown.Submenu position="right">
            <Dropdown.Item>Subitem 1</Dropdown.Item>
            <Dropdown.Item>Subitem 2</Dropdown.Item>
          </Dropdown.Submenu>
        </Dropdown.Item>
        <Dropdown.Item>Item 3</Dropdown.Item>
      </Dropdown> */}
    </div>
  )
}

export const TopHeader = () => {
  const dispatch = useDispatch()

  const cookies = new Cookies()
  useEffect(() => {
    const userId = getCookie('userId')
    userId && dispatch(getCartlistAction({userId: userId}))
  }, [])
  const datas: any = useSelector((state: any) => state.cart)
  const [sortVisible, setSortVisible] = useState(false)
  const sortRefs = useRef<HTMLDivElement | null>(null)
  const [searchValue, setSearchValue] = useState<string>('')
  const debouncedSearchvalue = useDebounceValue(searchValue)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(
      getSocialLinksAction({
        onSuccess: () => console.log('Sub categoryList fetch Successfully')
      })
    )
  }, [])
  // useEffect(() => {
  //   dispatch(
  //     getProductListAction({
  //       onSuccess: () => {
  //         navigate('/products')
  //       },
  //       query: {
  //         search: debouncedSearchvalue
  //       }
  //     })
  //   )
  // }, [debouncedSearchvalue])

  const onSearchHandler = useCallback((searchedData: string) => {
    console.log('onSearch handler called')
    navigate(`/products?search=${searchedData}`)
  }, [])

  const handleOutSideClick = (event) => {
    const target = document?.getElementById('openModalButtons')
    const children = target?.getElementsByTagName('svg')

    if (
      sortRefs.current &&
      !sortRefs.current.contains(event.target) &&
      event.target !== Array.from(Array.from(children)[0].children)[0]
    ) {
      console.log('set false')
      setSortVisible(false)
    } else {
      console.log('set true')
      // !!sortVisible && setSortVisible(false)
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleOutSideClick)

    return () => {
      document.removeEventListener('click', handleOutSideClick)
    }
  }, [])

  useEffect(() => {
    console.log(sortVisible, 'sortVisible')
  }, [sortVisible])

  const {setAuth, auth} = useAuth()

  const {socialLinks}: any = useSelector((state: any) => state.socialLinks)

  console.log(auth.isLoggedin, 'auth logged in value')
  console.log(socialLinks, 'sociallinks value')



  const handleLogoutAndRedirect = () => {
  // Clear all auth data
  setSortVisible(false)
  removeCookie('userId')
  removeCookie('userRoles')
  cookies.remove('userRoles')
  cookies.remove('userId')
  
  // Reset auth state
  setAuth({
    isLoggedin: false,
    role: 'USER'
  })
  
  // Clear any other relevant state
  // setUser(null) // if you have user state
  // localStorage.clear() // if needed
  
  // Navigate with replace to prevent back navigation issues
  navigate('/login', { replace: true })
}



console.log(auth.isLoggedin,auth,"data value final")

  return (
    <>
      <div className="header-top">
        <div className="container"
   style={{
    paddingBottom:'0px'
   }}
        >
          <ul className="header-social-container">
            <li>
              <a
                href={socialLinks[0]?.socialLinks?.facebook}
                className="social-link"
              >
                {/* <ion-icon name="logo-facebook"></ion-icon> */}
                <FaFacebook></FaFacebook>
              </a>
            </li>

            <li>
              <a
                href={socialLinks[0]?.socialLinks?.tiktok}
                className="social-link"
              >
                {/* <ion-icon name="logo-twitter"></ion-icon> */}
                <FaTiktok></FaTiktok>
              </a>
            </li>

            <li>
              <a
                href={socialLinks[0]?.socialLinks?.instagram}
                className="social-link"
              >
                {/* <ion-icon name="logo-instagram"></ion-icon> */}
                <FaInstagram></FaInstagram>
              </a>
            </li>
          </ul>

          <div className="header-alert-news">
            <p>{socialLinks[0]?.offerText}</p>
          </div>

          <div className="header-top-actions">
            {/* <select name="currency">
              <option value="usd">USD &dollar;</option>
              <option value="eur">EUR &euro;</option>
            </select>

            <select name="language">
              <option value="en-US">English</option>
              <option value="es-ES">Espa&ntilde;ol</option>
              <option value="fr">Fran&ccedil;ais</option>
            </select> */}
            {socialLinks[0]?.specialSlogan}
          </div>
        </div>
      </div>

      <div className="topHeader-container">
        <div className="topHeader">
          <div className="topHeader-logo" onClick={() => navigate('/home')}
            
          
            >
            <img
              src="/assets/images/logosss.png"
              alt="logo"
              className="topHeader-logo-image"
            ></img>
          </div>

{
    <>

  <p></p>
      <div className="topHeader-search"
          
         
          >
            <SearchField
              placeholder="Search Your Product"
              
              onChange={(e) => {
                // setSearchValue(e.target.value)

                console.log("on search handler called",e.target.value)
                onSearchHandler(e.target.value)
              }}
            ></SearchField>
          </div>

          <div className="topHeader-cartProfile">
            <div
              className="topHeader-cartProfile-cart"
              onClick={() => {
                navigate('cart')
              }}
            >
              {datas?.cartData?.[0]?.products?.length > 0 && auth.isLoggedin && (
                <HStack
                  justify="center"
                  align="center"
                  style={{
                    // padding: '20px',
                    height: 20,
                    width: 20,
                    borderRadius: '50%',
                    background: 'red',
                    color: 'white',
                    position: 'absolute',
                    top: -10,
                    right: -6,
                    backgroundColor:
                      'hsl(0, 82.48847926267283%, 57.45098039215687%)'
                  }}
                >
                  {datas?.cartData?.[0]?.products?.length}
                </HStack>
              )}

              {/* <p>1</p> */}

              <FaCartArrowDown size={24} />
            </div>

            <div className="topHeader-cartProfile-profile" onClick={() => setSortVisible((prev) => !prev)}
            style={{padding:'10px'}}
           >
              <VStack
                className="sortMainContainer"
          
              >
                <HStack id="openModalButtons" style={{cursor: 'pointer'}}>
                  <FaUserAlt
                    // gap="$3"
                    size={24}
                  />
                </HStack>

                <div
                  className="sortModalContainer"
                  style={{scale: sortVisible ? '1' : '0', minWidth: '120px'}}
                  ref={sortRefs}
                >
                  <VStack>
                    <HStack align="center" gap="$3" className="filterItem"
                    
                    onClick={() => {
                      setSortVisible(false)
                      navigate('/my-profile')
                    }}
                    >
                      <p>My Profile</p>
                    </HStack>

                    {!!auth.isLoggedin && (
                      <HStack
                        align="center"
                        gap="$3"
                        className="filterItem"
                  
                    onClick={handleLogoutAndRedirect}
                      >
                        <p>Logout</p>
                      </HStack>
                     )} 

                    {!!!auth.isLoggedin && (
                      <HStack
                        align="center"
                        gap="$3"
                        className="filterItem"
                        onClick={() => {
                          // handleLogout()
                          navigate('/register')
                          setSortVisible(false)
                          removeCookie('userId')
                          removeCookie('userRoles')

                          cookies.remove('userRoles')
                          cookies.remove('userId')
                          // setAuth({
                          //   isLoggedin: false,
                          //   role: 'USER'
                          // })
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
  </>
}

      



        </div>
      </div>
    </>
  )
}

export const Header = () => {
  const [showSideNav, setShowSideNav] = useState<boolean>(true)
  const media = useMedia()

  const handleSideNav = useCallback(() => {
    console.log('handle close')
    setShowSideNav(!SideNav)
  }, [SideNav])

  return (
    <>
      {media.md ? (
        <DesktopHeader />
      ) : (
        <Sidebar handleClose={handleSideNav}></Sidebar>
      )}
    </>
  )
}
