import {configureStore} from '@reduxjs/toolkit'

import productReducer from 'src/app/pages/products/product.slice'
import categoryReducer from 'src/app/pages/category/category.slice'
import subCategoryReducer from 'src/app/pages/subCategory/subCategory.slice'
import subCategoryReducerNested from 'src/app/pages/subCategoryNested/subCategory.slice'
import BannerReducer from 'src/app/pages/banners/banners.slice'
import TestimonialReducer from 'src/app/pages/testimonial/testimonial.slice'
import ShopByBudgetReducer from 'src/app/pages/shopByBudget/shopByBudget.slice'

import CartReducer from 'src/app/pages/web/cart/cart.slice'

import SocialLinksReducer from 'src/app/pages/socialLinks/socialLinks.slice'
import ResetPasswordReducer from 'src/app/pages/resetPassword/resetPassword.slice'
import LoginReducer from 'src/app/pages/login/login.slice'
import HolidayModeReducer from 'src/app/pages/holidayMode/holidayMode.slice'

export const store = configureStore({
  reducer: {
    product: productReducer,
    category: categoryReducer,
    subCategory: subCategoryReducer,
    subCategoryNested: subCategoryReducerNested,
    banner: BannerReducer,
    testimonial: TestimonialReducer,
    shopByBudget: ShopByBudgetReducer,
    cart: CartReducer,
    socialLinks: SocialLinksReducer,
    resetPassword: ResetPasswordReducer,
    Login: LoginReducer,
    holidayMode:HolidayModeReducer
  }
})
