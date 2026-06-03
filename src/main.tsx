import ReactDOM from 'react-dom/client'
import {Provider} from 'react-redux'

import {store} from 'src/store'
import './sass/main.scss'
import 'react-loading-skeleton/dist/skeleton.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import {
  BrowserRouter,
  HashRouter,
  RouterProvider,
  useLocation,
  useRoutes
} from 'src/next-router-compat'
import {AuthProvider, useAuth, USER_ROLES} from './app/routing'
import {Router, router} from './app/routing/routes'
import {SideNav} from './app/routing/sideNav/sidenav.component'
import {Toaster} from 'react-hot-toast'
import {Sample} from './app/pages'
import {Header, TopHeader} from './app/components/header'
import {CompWrapper, HStack} from './app/common'
// import Sidebar from './app/components/headerDrawer/headerDrawer.component'
import {Sidebar} from './app/components/headerDrawer/headerDrawer.component'
import {CategoryContainer, MainCarousel, ProductSection} from './app/components'
import {ProductCard} from './app/components/productCard/productCard.component'
import {Footer} from './app/components/footer/footer.component'
import {getCookie} from './helpers'
import {useEffect, useMemo, useState} from 'react'
import {useMedia} from './hooks'
import WhatsAppButton from './app/components/whatsappChatButton/whatsappChatButton.component'
import SocialChatButtons from './app/components/whatsappChatButton/whatsappChatButton.component'
// import MultiLevelMenu from './app/components/header/header.componnet'

// ScrollToTop Component
const ScrollToTop = () => {
  const { pathname } = useLocation()
  

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const App = () => {
  let routes: any[] = [
    {
      path: '/'
      // element: <Header />
    }
  ]

  const media = useMedia()

  const [containsDash, setContainsDash] = useState(false)
  const location = useLocation()
  const roles = getCookie('userRoles')
  
  console.log(window.location.href,"window location href  ");

  useEffect(() => {
    const checkForDash = () => {
      const currentUrl = window.location.href
      setContainsDash(currentUrl.includes('dash-'))
    }

    checkForDash()
  }, [location])

   const {auth} = useAuth()

  const sideNavData = useMemo(() => {
    return window.location.href.includes('dash-') &&
      getCookie('userRoles') === 'ADMIN' ? (
      <SideNav />
    ) : (
      <></>
    )
  }, [getCookie('userRoles'), window.location.href])

  console.log(auth.isLoggedin,"auth logged in hai",    containsDash ,media.md, getCookie('userRoles') === 'ADMIN')

  return (
    <AuthProvider>
      <ScrollToTop /> {/* Added ScrollToTop component */}
      <HStack>
        {sideNavData}
        <div
          style={{
            position: 'absolute',
            // right: '10px',
            width:
              containsDash && getCookie('userRoles') === 'ADMIN'?media.md
                ? '75vw':'100vw'
                : '100vw',
   
            marginTop: containsDash && getCookie('userRoles') === 'ADMIN'?media.md ? '20px':'60px':!media?.md?'20px':'0px',
            left:
              containsDash && getCookie('userRoles') === 'ADMIN'?media.md?'20vw':'0vw':'0vw'
          }}
        >
          {!containsDash && (
            <>
             <TopHeader></TopHeader>
             { <Header></Header>  }
              {/* <MultiLevelMenu/> */}
            </>
          )}

          {useRoutes(Router)}
          {!containsDash && <Footer></Footer>}

          <Toaster position="bottom-right" reverseOrder={false} />
        </div>
      </HStack>
      {!containsDash && (
  <SocialChatButtons 
    whatsappNumber="977-9861698400"  // Your WhatsApp number with country code
    whatsappMessage="Hi! I'm interested in your products."
    facebookPageId="Abhushan Gallery"  // Your Facebook Page username or ID
  />
)}
    </AuthProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <HashRouter>

    <GoogleOAuthProvider clientId="58815171868-hlpv60089h5p8286562i2bde9htijb74.apps.googleusercontent.com">
    <Provider store={store}>
      <App />
   
    </Provider>
    </GoogleOAuthProvider>
  </HashRouter>
)