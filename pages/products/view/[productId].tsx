import React from 'react'
import {ProductWebDetail} from 'src/app/pages/web/productWeb/view/productWebView.component'
import { useRouter } from 'next/router'

export default function ProductDetailPage() {
  const router = useRouter()
  const { productId } = router.query

  return <ProductWebDetail />
}
