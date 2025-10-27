// import {BusinessDetailPage, Sample} from 'src/app/pages'
import {ProtectedAuth, PublicAuth, UnrestrictedAuth} from './ProtectedRoutes.app'
import {CompWrapper} from 'src/app/common'
import {RouteObject, createBrowserRouter} from 'react-router-dom'
import {ROLES} from '../roles'
import {ProductListPage} from 'src/app/pages/products'
import ProductDetailsPage from 'src/app/pages/products/view/[productId]/productId.page'
import {AddProductPage} from 'src/app/pages/products/add/addProduct.page'
// import {CategoryListPage} from 'src/app/pages/category/category.page'
import CategoryDetailPage from 'src/app/pages/category/view/[categoryId]/categoryId.page'
import {CategoryListPage} from 'src/app/pages/category/category.page'
import {CartPage, OrderDetailsPage, ProductListForWeb} from 'src/app/pages/web'
// import {BestSellingPage} from 'src/app/pages/bestSelling'
import {
  Banners,
  BestSellingPage,
  NewArrivalListPage,
  OrderListPage,
  RegisterPage,

  SocialLinksPage,
  Testimonial
  // ProductWebSample
} from 'src/app/pages'
import {AddCategoryPage} from 'src/app/pages/category'
import {Sample, SubCategoryListPage, LoginPage} from 'src/app/pages'
import {AddSubCategoryPage} from 'src/app/pages/subCategory/add'
import {ProductWebDetail} from 'src/app/pages/web'
import {HomePage} from 'src/app/pages/web/home/home.component'
import {AddTestimonialPage} from 'src/app/pages/testimonial/add/addTestimonial.component'
import {ShopByBudget} from 'src/app/pages/shopByBudget/shopByBudget.component'
import {AddShopByBudget} from 'src/app/pages/shopByBudget/add/addShopByBudget.component'
import {CartCard} from 'src/app/components'
import {ResetPasswordPage} from 'src/app/pages/resetPassword/resetPassword.page'
import {AddSocialLinksPage} from 'src/app/pages/socialLinks/add/addSocialLinks.component'
import {SubCategoryListPageNested} from 'src/app/pages/subCategoryNested'
import {AddSubCategoryPageNested} from 'src/app/pages/subCategoryNested/add'
import SubCategoryDetailPageNested from 'src/app/pages/subCategoryNested/view/[subCategoryId]/subCategoryid.page'
import { MyProfile } from 'src/app/components/myProfile.component'
import { StylingGuide } from 'src/app/pages/stylingGuide'
import { ContactUs } from 'src/app/pages/contactUs'
import PrivacyPolicy from 'src/app/pages/privacyPolicy'
import TermsAndConditions from 'src/app/pages/termsAndCondition.tsx'
import ReturnPolicy from 'src/app/pages/returnPolicy'
import ShippingPolicy from 'src/app/pages/shippingPolicy'
import HolidayModePage from 'src/app/pages/holidayMode/holidayMode.page'
import HotSellingProducts from 'src/app/pages/hotSelling/hotSelling.page'

// import LoginPage from 'src/app/pages/login/login.page'

export const Router: RouteObject[] = [
  {
    path: '/product',

    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <ProductWebDetail />
      },
      {
        path: 'add',
        element: <AddProductPage />
      },
      {
        path: 'update/:productId',
        element: <AddProductPage />
      },
      {
        path: 'view/:productId',
        element: <ProductWebDetail />
      }
    ]
  },

  {
    path: '/home',
    // element: <PublicAuth />,/

    element: <HomePage />
  },
    {
    path: '/contact-us',
    // element: <PublicAuth />,/

    element: <ContactUs />
  },

  //   {
  //   path: '/return-policy',
  //   // element: <PublicAuth />,/

  //   element: <ReturnPolicy />
  // },
      {
    path: '/shipping-policy',
    // element: <PublicAuth />,/

    element: <ReturnPolicy />
  },
      {
    path: '/styling-guide',
    // element: <PublicAuth />,/

    element: <StylingGuide />
  },

    {
    path: '/privacy-policy',
    // element: <PublicAuth />,

    element: <PrivacyPolicy />
  },
    {
    path: '/terms-and-conditions',
    // element: <PublicAuth />,

    element: <TermsAndConditions />
  },
  {
    path:'/my-profile',
    element:<ProtectedAuth/>,
    children:[
      {
        path:'',
        element:<MyProfile/>
      }
  ]},
  {
    path: '/',
    // element: <PublicAuth />,/

    element: <HomePage />
  },
  {
    path: '/login',
    // element: <PublicAuth />,
     element: <LoginPage />
    // children: [
    //   {
    //     path: '',
    //     element: <LoginPage />
    //   }
    // ]
  },

    {
    path: '/reset-password',
            element: <ResetPasswordPage />
    // element: <PublicAuth />,
    // children: [
    //   {
    //     path: '',
    //     element: <ResetPasswordPage />
    //   }
    // ]
  },

  {
    path: '/register',
    element: <PublicAuth />,
    children: [
      {
        path: '',
        element: <RegisterPage />
      }
    ]
  },



  {
    path: '/sample',
    // element: <Sample />
    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <Sample />
      }
    ]
  },

    {
    path: '/dash-holiday-mode',
    // element: <Sample />
    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <HolidayModePage />
      }
    ]
  },

     {
    path: '/dash-hot-selling',
    // element: <Sample />
    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <HotSellingProducts />
      }
    ]
  },
  {
    path: '/return-policy',
    element: <ReturnPolicy />
    // element: <PublicAuth />,
    // children: [
    //   {
    //     path: '',
    //     element: <ReturnPolicy />
    //   }
    // ]
  },

  {
    path: '/shipping-policy',
    element: <ReturnPolicy />
    // element: <PublicAuth />,
    // children: [
    //   {
    //     path: '',
    //     element: <ReturnPolicy />
    //   }
    // ]
  },
  // {
  //   path: '/products',

  //   element: <PublicAuth />,
  //   children: [
  //     {
  //       path: '',
  //       element: <ProductListForWeb />
  //     },
  //      {
  //       path: 'view/:productId',
  //       element: <ProductWebDetail />
  //     }
  //   ]
  // },



  {
  path: '/products',
  element: <UnrestrictedAuth />,
  children: [
    {
      path: '',
      element: <ProductListForWeb />
    },
    {
      path: 'view/:productId', 
      element: <ProductWebDetail />
    }
  ]
},

  {
    path: '/dash-product',

    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <ProductListPage />
      },
      {
        path: 'add',
        element: <AddProductPage />
      },
      {
        path: 'update/:productId',
        element: <AddProductPage />
      },
      {
        path: 'view/:productId',
        element: <ProductDetailsPage />
      }
    ]
  },

  {
    path: '/dash-new-arrivals',

    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <NewArrivalListPage />
      }
    ]
  },

  {
    path: '/dash-best-selling',

    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <BestSellingPage />
      }
    ]
  },
  {
    path: '/dash-category',

    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <CategoryListPage />
      },
      {
        path: 'add',
        element: <AddCategoryPage />
      },
      {
        path: 'update/:categoryId',
        element: <AddCategoryPage />
      },
      {
        path: 'view/:categoryId',
        element: <CategoryDetailPage />
      }
    ]
  },

  {
    path: '/dash-subCategory',

    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <SubCategoryListPage />
      },
      {
        path: 'add',
        element: <AddSubCategoryPage />
      },
      {
        path: 'update/:subCategoryId',
        element: <AddSubCategoryPage />
      },
      {
        path: 'view/:subCategoryId',
        element: <SubCategoryDetailPageNested />
      }
    ]
  },

  {
    path: '/dash-subCategorynested',

    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <SubCategoryListPageNested />
      },
      {
        path: 'add',
        element: <AddSubCategoryPageNested />
      },
      {
        path: 'update/:subCategoryIdnested',
        element: <AddSubCategoryPageNested />
      },
      {
        path: 'view/:subCategoryIdnested',
        element: <CategoryDetailPage />
      }
    ]
  },
  {
    path: '/dash-banners',

    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <Banners />
      },
      {
        path: 'add',
        element: <AddSubCategoryPage />
      },
      {
        path: 'update/:subCategoryId',
        element: <AddSubCategoryPage />
      },
      {
        path: 'view/:subCategoryId',
        element: <CategoryDetailPage />
      }
    ]
  },

  {
    path: '/dash-testimonial',

    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <Testimonial />
      },
      {
        path: 'add',
        element: <AddTestimonialPage />
      },
      {
        path: 'update/:testimonialId',
        element: <AddTestimonialPage />
      },
      {
        path: 'view/:subCategoryId',
        element: <CategoryDetailPage />
      }
    ]
  },

  {
    path: '/dash-shopByBudget',

    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <ShopByBudget />
      },
      {
        path: 'add',
        element: <AddShopByBudget />
      },
      {
        path: 'update/:subCategoryId',
        element: <AddSubCategoryPage />
      },
      {
        path: 'view/:subCategoryId',
        element: <CategoryDetailPage />
      }
    ]
  },
  {
    path: '/cart',

    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <CartPage />
      }
    ]
  },

  {
    path: '/orderDetails',

    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <OrderDetailsPage />
      }
    ]
  },

  {
    path: '/dash-orders',

    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <OrderListPage />
      }
    ]
  },
  {
    path: '/dash-social-links',

    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <SocialLinksPage />
      },
      {
        path: 'add',
        element: <AddSocialLinksPage />
      },

      {
        path: 'update/:socialLinksId',
        element: <AddSocialLinksPage />
      }
    ]
  },

  {
    path: '/jobs',
    element: <ProtectedAuth />,
    children: []
  },
  {
    path: '/report-complains',

    element: <ProtectedAuth />,
    children: [
      {
        path: ''
      }
    ]
  },
  {
    path: '/claim-request',

    element: <ProtectedAuth />,
    children: []
  },
  {
    path: '/user-management',

    element: <ProtectedAuth />,
    children: []
  },
  {
    path: '*',
    element: (
      <CompWrapper>
        <div>Not found</div>
      </CompWrapper>
    )
  },
  {
    path: '/denied',
    element: (
      <CompWrapper>
        <div>denied</div>
      </CompWrapper>
    )
  }
]

export const router = createBrowserRouter([
  {
    path: '/'
    // element: <Sample />
  },
  {
    path: '/sample'
    // element: <Sample />
    // loader: rootLoader,
    // children: [
    //   {
    //     path: "team",
    //     element: <Team />,
    //     loader: teamLoader,
    //   },
    // ],
  }
])
