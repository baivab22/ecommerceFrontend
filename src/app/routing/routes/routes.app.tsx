// import {BusinessDetailPage, Sample} from 'src/app/pages'
import {ProtectedAuth, PublicAuth} from './ProtectedRoutes.app'
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
  ReturnPolicy,
  ShippingPolicy,
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
    element: <ProtectedAuth />,
    //  element: <LoginPage />
    children: [
      {
        path: '',
        element: <LoginPage />
      }
    ]
  },

  {
    path: '/register',
    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <RegisterPage />
      }
    ]
  },

  {
    path: '/reset-password',
    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <ResetPasswordPage />
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
    path: '/return-policy',
    // element: <Sample />
    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <ReturnPolicy />
      }
    ]
  },

  {
    path: '/shipping-policy',
    // element: <Sample />
    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <ShippingPolicy />
      }
    ]
  },
  {
    path: '/products',

    element: <ProtectedAuth />,
    children: [
      {
        path: '',
        element: <ProductListForWeb />
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
