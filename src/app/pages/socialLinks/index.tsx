// import React, {useEffect, useState, useCallback} from 'react'
// import {useDispatch} from 'src/store'
// // import {delteProductAction, getProductListAction} from './product.slice'
// import {useSelector} from 'react-redux'
// import {Box, Button, HStack, SelectField, Table} from 'src/app/common'
// import {useNavigate} from 'react-router-dom'
// import {toast} from 'react-hot-toast'
// import {
//   deleteSubCategoryAction,
//   getSubCategoryListAction
// } from '../subCategory/subCategory.slice'
// import {getSocialLinksAction} from './socialLinks.slice'
// export const SocialLinksPage = () => {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()

//   const [category, setCategory] = useState<any>()
//   //   const [selectedCateory, setSelectedCategory] = useState<any>()
//   const {socialLinks}: any = useSelector((state: any) => state.socialLinks)

//   useEffect(() => {
//     dispatch(
//       getSocialLinksAction({
//         onSuccess: () => console.log('Sub categoryList fetch Successfully')
//       })
//     )
//   }, [])

//   return (
//     <div>
//       <Box>
//         <HStack justify="space-between" style={{margin: '20px 0'}}>
//           <Button
//             title="Add Social Links"
//             onClick={() => navigate('add')}
//           ></Button>
//         </HStack>

//         <Table
//           columns={[
//             {
//               field: 'specialSlogan',
//               name: 'Special Slogan',
//               render: (datas) => {
//                 return <div style={{width: 'max-content'}}>{datas}</div>
//               }
//             },
//             {
//               field: 'offerText',
//               name: 'Offer Text',
//               render: (datas) => (
//                 <div className="subCategoryButton">
//                   <p className="subCategoryButton-item">{datas}</p>
//                 </div>
//               )
//             },

//             {
//               field: 'socialLinks',
//               name: 'Instagram',
//               render: (datas) => (
//                 <div className="subCategoryButton">
//                   <p className="subCategoryButton-item">{datas.instagram}</p>
//                 </div>
//               )
//             },
//             {
//               field: 'socialLinks',
//               name: 'Facebook',
//               render: (datas) => (
//                 <div className="subCategoryButton">
//                   <p className="subCategoryButton-item">{datas.facebook}</p>
//                 </div>
//               )
//             },
//             {
//               field: 'socialLinks',
//               name: 'Tiktok',
//               render: (datas) => (
//                 <div className="subCategoryButton">
//                   <p className="subCategoryButton-item">{datas.tiktok}</p>
//                 </div>
//               )
//             }
//           ]}
//           data={socialLinks}
//           actions={{
//             // onView: (item: any) => {
//             //   navigate(`view/${item.id}`)
//             // },

//             onEdit: (item: any) => {
//               console.log(item.id, 'item id to delete')
//               navigate(`update/${item._id}`)
//             }
         
//           }}
//           pagination={{
//             totalCount: Number(socialLinks?.length ?? 1)
//             // perPage: Number(import.meta.REACT_APP_TABLE_LIMIT || 10)
//           }}
//         />
//       </Box>
//     </div>
//   )
// }


import React, {useEffect, useState, useCallback} from 'react'
import {useDispatch} from 'src/store'
// import {delteProductAction, getProductListAction} from './product.slice'
import {useSelector} from 'react-redux'
import {Box, Button, HStack, SelectField, Table} from 'src/app/common'
// import { useRouter } from 'next/router'
import {toast} from 'react-hot-toast'
import {getSocialLinksAction, deleteSocialLinksAction} from './socialLinks.slice'
import { useNavigate } from 'react-router-dom'
export const SocialLinksPage = () => {
  // const router = useRouter()
  const dispatch = useDispatch()
    const navigate = useNavigate()
  const [category, setCategory] = useState<any>()
  //   const [selectedCateory, setSelectedCategory] = useState<any>()
  const {socialLinks}: any = useSelector((state: any) => state.socialLinks)

  useEffect(() => {
    dispatch(
      getSocialLinksAction({
        onSuccess: () => console.log('Sub categoryList fetch Successfully')
      })
    )
  }, [dispatch])

  const handleDelete = (item: any, onCloseModalHandler: any) => {
    dispatch(
      deleteSocialLinksAction({
        socialLinksId: item._id,
        onSuccess: () => {
          toast.success('Social link deleted successfully')
          onCloseModalHandler?.()
          dispatch(
            getSocialLinksAction({
              onSuccess: () => console.log('Social Links refreshed')
            })
          )
        }
      })
    )
  }

  return (
    <div>
      <Box>
        <HStack justify="space-between" style={{margin: '20px 0'}}>
          <Button
            title="Add Social Links"
            onClick={() => navigate('/dash-social-links/add')}
          ></Button>
        </HStack>

        <Table
          columns={[
            {
              field: 'specialSlogan',
              name: 'Special Slogan',
              render: (datas) => {
                return <div style={{width: 'max-content'}}>{datas}</div>
              }
            },
            {
              field: 'offerText',
              name: 'Offer Text',
              render: (datas) => (
                <div className="subCategoryButton">
                  <p className="subCategoryButton-item">{datas}</p>
                </div>
              )
            },

            {
              field: 'socialLinks',
              name: 'Instagram',
              render: (datas) => (
                <div className="subCategoryButton">
                  <p className="subCategoryButton-item">{datas.instagram}</p>
                </div>
              )
            },
            {
              field: 'socialLinks',
              name: 'Facebook',
              render: (datas) => (
                <div className="subCategoryButton">
                  <p className="subCategoryButton-item">{datas.facebook}</p>
                </div>
              )
            },
            {
              field: 'socialLinks',
              name: 'Tiktok',
              render: (datas) => (
                <div className="subCategoryButton">
                  <p className="subCategoryButton-item">{datas.tiktok}</p>
                </div>
              )
            }
          ]}
          data={socialLinks}
          actions={{
            onEdit: (item: any) => {
              console.log(item.id, 'item id to delete')
              navigate(`/dash-social-links/update/${item._id}`)
            },
            onDelete: handleDelete
          }}
          pagination={{
            totalCount: Number(socialLinks?.length ?? 1)
            // perPage: Number(import.meta.REACT_APP_TABLE_LIMIT || 10)
          }}
        />
      </Box>
    </div>
  )
}
