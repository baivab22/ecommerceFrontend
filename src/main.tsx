import ReactDOM from 'react-dom/client'
import {Provider} from 'react-redux'

import {store} from 'src/store'
import './sass/main.scss'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  BrowserRouter,
  HashRouter,
  RouteObject,
  RouterProvider,
  useLocation,
  useRoutes
} from 'react-router-dom'
import {AuthProvider, USER_ROLES} from './app/routing'
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

// const MemoChild = () => {
//   console.log('hello memo')

//   console.log(window.location.href, 'hello')
//   console.log(roles, 'roles')
//   return (
//     <AuthProvider>
//       <div>
//         <App />
//       </div>
//     </AuthProvider>
//   )
// }

const App = () => {
  let routes: RouteObject[] = [
    {
      path: '/'
      // element: <Header />
    }
  ]

  const media = useMedia()

  const [containsDash, setContainsDash] = useState(false)
  const location = useLocation()
  const roles = getCookie('userRoles')

  useEffect(() => {
    const checkForDash = () => {
      const currentUrl = window.location.href
      setContainsDash(currentUrl.includes('dash-'))
    }

    checkForDash()
  }, [location])

  const sideNavData = useMemo(() => {
    return window.location.href.includes('dash-') &&
      getCookie('userRoles') === 'ADMIN' ? (
      <SideNav />
    ) : (
      <></>
    )
  }, [getCookie('userRoles'), window.location.href])

  return (
    <AuthProvider>
      <HStack>
        {sideNavData}
        <div
          style={{
            position: 'absolute',
            // right: '10px',
            width:
              containsDash && getCookie('userRoles') === 'ADMIN'
                ? '75vw'
                : '100vw',
            marginTop: media.md ? '0px' : '20px',
            left:
              containsDash && getCookie('userRoles') === 'ADMIN'
                ? '20vw'
                : '0vw'
          }}
        >
          {!containsDash && (
            <>
             <TopHeader></TopHeader>
              <Header></Header> 
            </>
          )}

          {useRoutes(Router)}

          {/* <MainCarousel></MainCarousel> */}
          {/* <CompWrapper>
        <CategorryContainer></CategorryContainer>
      </CompWrapper> */}

          {/* <CompWrapper>
        <ProductSection
          header="Best Selling"
          isProfilePage={true}
        ></ProductSection>
      </CompWrapper> */}

          {!containsDash && <Footer></Footer>}

          <Toaster position="bottom-right" reverseOrder={false} />
        </div>
      </HStack>
    </AuthProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <HashRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </HashRouter>
)
