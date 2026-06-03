import React from 'react'
import { useRouter } from 'next/router'
import {getNprPrice} from 'src/helpers/nprPrice.helper'

export const ShopByBudgetWeb = ({data}: any) => {
  const router = useRouter()
  return (
    <div
      className="shopByBudgetWeb-container"
      onClick={() => {
        router.push(`/products?maxPrice=${data.name}`)
      }}
    >
      <div className="shopByBudgetWeb">
        <div className="shopBudgetWeb-under">UNDER</div>
        <div className="shopBudgetWeb-price">{getNprPrice(data?.name)}</div>
      </div>
    </div>
  )
}
