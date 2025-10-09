import React, {useCallback, useEffect, useState} from 'react'
import {Button, InputField, Label, VStack} from 'src/app/common'

import {
  createShopByBudgetAction,
  deleteShopByBudgetAction,
  getShopByBudgetListAction
} from '../shopByBudget.slice'

import {useDispatch, useSelector} from 'src/store'
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
export const AddShopByBudget = () => {
  const [shopByBudget, setShopByBudget] = useState<any>('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {createShopByBudgetLoading, shopByBudgetData}: any = useSelector(
    (state: any) => state.shopByBudget
  )

  useEffect(() => {
    // console.log(bannerData, 'bannerData')
    shopByBudgetData &&
      shopByBudgetData.length > 0 &&
      setShopByBudget(shopByBudgetData)
  }, [shopByBudgetData])
  const handleImage = useCallback((event: any) => {
    setShopByBudget((prev: any) => [...prev, event.target.value])
  }, [])

  useEffect(() => {
    dispatch(
      getShopByBudgetListAction({
        onSuccess: () => {}
      })
    )
  }, [])

  const addShopByBudgetHandler = () => {
    dispatch(
      createShopByBudgetAction({
        shopByBudgetData: {name: shopByBudget},
        onSuccess: () => {
          toast.success('ShopBy Budget added Successfully')
          navigate('/dash-shopByBudget')
        }
      })
    )
  }
  return (
    <VStack gap="$5">
      <Label required labelName="Shop By Budget"></Label>
      <InputField
        type="text"
        placeholder="Enter Shop By Budget Price"
        onChange={(e: any) => setShopByBudget(e.target.value)}
        // value={shopByBudget}
      ></InputField>

      <Button
        title="Add Shop By Budget"
        onClick={addShopByBudgetHandler}
        loading={createShopByBudgetLoading}
      ></Button>
    </VStack>
  )
}
