// import '../src/sass/main.scss'
// import 'react-loading-skeleton/dist/skeleton.css'
// import type { AppProps } from 'next/app'
// import dynamic from 'next/dynamic'
// import { Provider } from 'react-redux'
// import { store } from '../src/store'

// const GoogleOAuthProvider = dynamic(
//   () => import('@react-oauth/google').then(mod => mod.GoogleOAuthProvider),
//   { ssr: false }
// )

// const AuthProvider = dynamic(() => import('../src/app/routing').then(m => m.AuthProvider), { ssr: false })
// const TopHeader = dynamic(() => import('../src/app/components/header').then(m => m.TopHeader), { ssr: false })
// const Header = dynamic(() => import('../src/app/components/header').then(m => m.Header), { ssr: false })
// const Footer = dynamic(() => import('../src/app/components/footer/footer.component').then(m => m.Footer), { ssr: false })

// export default function MyApp({ Component, pageProps }: AppProps) {
//   return (
//     <Provider store={store}>
//       <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || '58815171868-hlpv60089h5p8286562i2bde9htijb74.apps.googleusercontent.com'}>
//         <AuthProvider>
//           <TopHeader />
//           <Header />
//           <Component {...pageProps} />

          
//           <Footer />
//         </AuthProvider>
//       </GoogleOAuthProvider>
//     </Provider>
//   )
// }



import '../src/sass/main.scss'
import 'react-loading-skeleton/dist/skeleton.css'

import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { Provider } from 'react-redux'
import { store } from '../src/store'

import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { Toaster } from 'react-hot-toast'

import { getCookie } from '../src/helpers'
import { useMedia } from '../src/hooks'

import { HStack } from '../src/app/common'
import { SideNav } from '../src/app/routing/sideNav/sidenav.component'

import SocialChatButtons from '../src/app/components/whatsappChatButton/whatsappChatButton.component'

/**
 * Dynamic Components
 */

const GoogleOAuthProvider = dynamic(
  () =>
    import('@react-oauth/google').then(
      mod => mod.GoogleOAuthProvider
    ),
  { ssr: false }
)

const AuthProvider = dynamic(
  () =>
    import('../src/app/routing').then(
      mod => mod.AuthProvider
    ),
  { ssr: false }
)

const TopHeader = dynamic(
  () =>
    import('../src/app/components/header').then(
      mod => mod.TopHeader
    ),
  { ssr: false }
)

const Header = dynamic(
  () =>
    import('../src/app/components/header').then(
      mod => mod.Header
    ),
  { ssr: false }
)

const Footer = dynamic(
  () =>
    import('../src/app/components/footer/footer.component').then(
      mod => mod.Footer
    ),
  { ssr: false }
)

export default function MyApp({
  Component,
  pageProps
}: AppProps) {
  const router = useRouter()
  const media = useMedia()

  const [containsDash, setContainsDash] =
    useState(false)

  /**
   * Detect dashboard routes
   */
  useEffect(() => {
    setContainsDash(
      router.pathname.includes('dash-')
    )

    window.scrollTo(0, 0)
  }, [router.pathname])

  /**
   * Check admin role
   */
  const isAdmin =
    getCookie('userRoles') === 'ADMIN'

  /**
   * Sidebar render
   */
  const sideNav = useMemo(() => {
    if (containsDash && isAdmin) {
      return <SideNav />
    }

    return null
  }, [containsDash, isAdmin])

  return (
    <Provider store={store}>
      <GoogleOAuthProvider
        clientId='58815171868-hlpv60089h5p8286562i2bde9htijb74.apps.googleusercontent.com'
      >
        <AuthProvider>
          <HStack>
            {sideNav}

            <div
              style={{
                position: 'absolute',

                width:
                  containsDash && isAdmin
                    ? media.md
                      ? '75vw'
                      : '100vw'
                    : '100vw',

                left:
                  containsDash && isAdmin
                    ? media.md
                      ? '20vw'
                      : '0'
                    : '0',

                marginTop:
                  containsDash && isAdmin
                    ? media.md
                      ? '20px'
                      : '60px'
                    : !media.md
                    ? '20px'
                    : '0px'
              }}
            >
              {!containsDash && (
                <>
                  <TopHeader />
                  <Header />
                </>
              )}

              <Component {...pageProps} />

              {!containsDash && <Footer />}

              <Toaster
                position="bottom-right"
                reverseOrder={false}
              />
            </div>
          </HStack>

          {!containsDash && (
            <SocialChatButtons
              whatsappNumber="9779861698400"
              whatsappMessage="Hi! I'm interested in your products."
              facebookPageId="Abhushan Gallery"
            />
          )}
        </AuthProvider>
      </GoogleOAuthProvider>
    </Provider>
  )
}

