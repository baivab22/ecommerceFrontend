export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN'
}

type UserRoles = {
  [key: string]: {
    access: string[]
  }
}

export const USER_ROLES: UserRoles = {
  ADMIN: {
    access: [
      '/register',
      '/login',
      '/reset-password',
      '/products/*',
      '/dash-category/*',
      '/dash-subCategory/*',
      '/dash-new-arrivals/*',
      '/dash-best-selling/*',
      '/banners/*',
      '/dash-product/*',
      '/sample',
      '/product/*',
      './home/*',
      '/dash-testimonial/*',
      '/dash-shopByBudget/*',
      '/cart/*',
      '/dash-orders/*',
      '/product/*',
      '/return-policy',
      '/shipping-policy',
      '/dash-social-links/*',
      'orderDetails/*',
      '/dash-subCategorynested/*',
      '/my-profile/*',
      '/contact-us',
      '/about-us',
      '/privacy-policy',
      '/styling-guide'
    ]
  },
  USER: {
    access: [
      '/register',
      '/login',
      '/reset-password',
      '/sample',
      '/business/*',
      '/home/*',
      // '/banners/*',
      // '/testimonial/*',
      // '/shopByBudget/*',
      '/cart/*',
      '/orders/*',
      // '/dash-product/*',
      '/product/*',
      '/return-policy',
      '/shipping-policy',
      'orderDetails/*',
      '/dash-subCategorynested/*',
          '/my-profile/*',
              '/contact-us',
      '/about-us',
      '/privacy-policy',
      '/styling-guide'
    ]
  }
}
