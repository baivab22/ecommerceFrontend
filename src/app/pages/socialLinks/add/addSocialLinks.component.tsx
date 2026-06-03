// import React, {useEffect, useState} from 'react'
// import {Button, InputField, Label} from 'src/app/common'
// import {useParams} from 'src/hooks'
// import {useDispatch, useSelector} from 'src/store'
// import {
//   createSocialLinksAction,
//   getSocialLinksByIdAction,
//   updateSocialLinksAction
// } from '../socialLinks.slice'
// import { useRouter } from 'next/router'
// import {toast} from 'react-hot-toast'

// export const AddSocialLinksPage = () => {
//   const [data, setData] = useState<any>({
//     instagram: '',
//     tiktok: '',
//     facebook: '',
//     specialSlogan: '',
//     offerText: ''
//   })

//   const {isUpdateLoading, isCreateLoading, individdualSocialLinks} =
//     useSelector((state) => state.socialLinks)

//   console.log(individdualSocialLinks, 'individdualSocialLinks')

//   const router = useRouter()

//   const socialLinksId = useParams('socialLinksId')

//   useEffect(() => {
//     // Only fetch detail if we're in edit mode
//     if (socialLinksId) {
//       dispatch(getSocialLinksByIdAction({socialLinksId: socialLinksId as string}))
//     } else {
//       // Clear form data when in add mode
//       setData({
//         instagram: '',
//         tiktok: '',
//         facebook: '',
//         specialSlogan: '',
//         offerText: ''
//       })
//     }
//   }, [socialLinksId, dispatch])

//   useEffect(() => {
//     if (socialLinksId && individdualSocialLinks) {
//       console.log(individdualSocialLinks, 'inside')
//       setData({
//         instagram: individdualSocialLinks.socialLinks?.instagram || '',
//         tiktok: individdualSocialLinks.socialLinks?.tiktok || '',
//         facebook: individdualSocialLinks.socialLinks?.facebook || '',
//         specialSlogan: individdualSocialLinks.specialSlogan || '',
//         offerText: individdualSocialLinks.offerText || ''
//       })
//     } else if (!socialLinksId) {
//       // Clear form when in add mode
//       setData({
//         instagram: '',
//         tiktok: '',
//         facebook: '',
//         specialSlogan: '',
//         offerText: ''
//       })
//     }
//   }, [individdualSocialLinks, socialLinksId])

//   const dispatch = useDispatch()
//   const addSubCategoryHandler = () => {
//     !socialLinksId
//       ? dispatch(
//           createSocialLinksAction({
//             body: {
//               socialLinks: {
//                 instagram: data.instagram,
//                 tiktok: data.tiktok,
//                 facebook: data.facebook
//               },
//               specialSlogan: data.specialSlogan,
//               offerText: data.offerText
//             },

//             onSuccess: (data: any) => {
//               router.push('/dash-social-links')
//               toast.success('Social Links Created Successfully')
//             }
//           })
//         )
//       : dispatch(
//           updateSocialLinksAction({
//             body: {
//               socialLinks: {
//                 instagram: data.instagram,
//                 tiktok: data.tiktok,
//                 facebook: data.facebook
//               },
//               specialSlogan: data.specialSlogan,
//               offerText: data.offerText
//             },

//             onSuccess: (data: any) => {
//               router.push('/dash-social-links')
//               toast.success('Social Links Created Successfully')
//             },
//             socialLinksId: socialLinksId as string
//           })
//         )
//   }

//   return (
//     <div className="addSociaLinks-container">
//       <div className="addSociaLinks">
//         <div className="addProduct-input">
//           <Label required labelName="Facebook Link"></Label>
//           <InputField
//             type="text"
//             placeholder="Enter Facebook Name"
//             onChange={(e: any) =>
//               setData((prev: any) => ({...prev, facebook: e.target.value}))
//             }
//             value={data.facebook}
//           ></InputField>
//         </div>

//         <div className="addProduct-input">
//           <Label required labelName="Instagram Link"></Label>
//           <InputField
//             type="text"
//             placeholder="Enter Instagram Link"
//             onChange={(e: any) =>
//               setData((prev: any) => ({...prev, instagram: e.target.value}))
//             }
//             value={data.instagram}
//           ></InputField>
//         </div>

//         <div className="addProduct-input">
//           <Label required labelName="Tiktok Link"></Label>
//           <InputField
//             type="text"
//             placeholder="Enter Tiktok Link"
//             onChange={(e: any) =>
//               setData((prev: any) => ({...prev, tiktok: e.target.value}))
//             }
//             value={data.tiktok}
//           ></InputField>
//         </div>

//         <div className="addProduct-input">
//           <Label required labelName="Special Slogan"></Label>
//           <InputField
//             type="text"
//             placeholder="Enter Special Slogan"
//             onChange={(e: any) =>
//               setData((prev: any) => ({...prev, specialSlogan: e.target.value}))
//             }
//             value={data.specialSlogan}
//           ></InputField>
//         </div>

//         <div className="addProduct-input">
//           <Label required labelName="Offer Text"></Label>
//           <InputField
//             type="text"
//             placeholder="Enter Offer Text"
//             onChange={(e: any) =>
//               setData((prev: any) => ({...prev, offerText: e.target.value}))
//             }
//             value={data.offerText}
//           ></InputField>
//         </div>

//         <Button
//           style={{justifySelf: 'flex-end', marginTop: '12px'}}
//           title={socialLinksId ? 'Update Social links' : 'Add Social Links'}
//           onClick={addSubCategoryHandler}
//           loading={socialLinksId ? isUpdateLoading : isCreateLoading}
//         ></Button>
//       </div>
//     </div>
//   )
// }


import React, {useEffect, useState} from 'react'
import {Button, InputField, Label} from 'src/app/common'
import {useParams} from 'src/hooks'
import {useDispatch, useSelector} from 'src/store'
import {
  createSocialLinksAction,
  getSocialLinksByIdAction,
  updateSocialLinksAction,
  deleteSocialLinksAction
} from '../socialLinks.slice'
import { useRouter } from 'next/router'
import {toast} from 'react-hot-toast'

export const AddSocialLinksPage = () => {
  const [data, setData] = useState<any>({
    instagram: '',
    tiktok: '',
    facebook: '',
    specialSlogan: '',
    offerText: ''
  })

  const dispatch = useDispatch() // Moved this before useEffect
  const router = useRouter()
  const socialLinksId = useParams('socialLinksId')

  const {isUpdateLoading, isCreateLoading, isDeleteLoading, individdualSocialLinks} =
    useSelector((state) => state.socialLinks)

  console.log(individdualSocialLinks, 'individdualSocialLinks')

  useEffect(() => {
    // Only fetch detail if we're in edit mode
    if (socialLinksId) {
      dispatch(getSocialLinksByIdAction({socialLinksId: socialLinksId as string}))
    } else {
      // Clear form data when in add mode
      setData({
        instagram: '',
        tiktok: '',
        facebook: '',
        specialSlogan: '',
        offerText: ''
      })
    }
  }, [socialLinksId, dispatch])

  useEffect(() => {
    if (socialLinksId && individdualSocialLinks) {
      console.log(individdualSocialLinks, 'inside')
      setData({
        instagram: individdualSocialLinks.socialLinks?.instagram || '',
        tiktok: individdualSocialLinks.socialLinks?.tiktok || '',
        facebook: individdualSocialLinks.socialLinks?.facebook || '',
        specialSlogan: individdualSocialLinks.specialSlogan || '',
        offerText: individdualSocialLinks.offerText || ''
      })
    } else if (!socialLinksId) {
      // Clear form when in add mode
      setData({
        instagram: '',
        tiktok: '',
        facebook: '',
        specialSlogan: '',
        offerText: ''
      })
    }
  }, [individdualSocialLinks, socialLinksId])

  const addSubCategoryHandler = () => {
    !socialLinksId
      ? dispatch(
          createSocialLinksAction({
            body: {
              socialLinks: {
                instagram: data.instagram,
                tiktok: data.tiktok,
                facebook: data.facebook
              },
              specialSlogan: data.specialSlogan,
              offerText: data.offerText
            },
            onSuccess: (data: any) => {
              router.push('/dash-social-links')
              toast.success('Social Links Created Successfully')
            }
          })
        )
      : dispatch(
          updateSocialLinksAction({
            body: {
              socialLinks: {
                instagram: data.instagram,
                tiktok: data.tiktok,
                facebook: data.facebook
              },
              specialSlogan: data.specialSlogan,
              offerText: data.offerText
            },
            onSuccess: (data: any) => {
              router.push('/dash-social-links')
              toast.success('Social Links Updated Successfully')
            },
            socialLinksId: socialLinksId as string
          })
        )
  }

  const handleDelete = () => {
    const confirmed = window.confirm('Are you sure you want to delete this social link? This action cannot be undone.')
    
    if (confirmed && socialLinksId) {
      dispatch(
        deleteSocialLinksAction({
          socialLinksId: socialLinksId as string,
          onSuccess: () => {
            toast.success('Social Links Deleted Successfully')
            router.push('/dash-social-links')
          }
        })
      )
    }
  }

  return (
    <div className="addSociaLinks-container">
      <div className="addSociaLinks">
        <div className="addProduct-input">
          <Label required labelName="Facebook Link"></Label>
          <InputField
            type="text"
            placeholder="Enter Facebook Name"
            onChange={(e: any) =>
              setData((prev: any) => ({...prev, facebook: e.target.value}))
            }
            value={data.facebook}
          ></InputField>
        </div>

        <div className="addProduct-input">
          <Label required labelName="Instagram Link"></Label>
          <InputField
            type="text"
            placeholder="Enter Instagram Link"
            onChange={(e: any) =>
              setData((prev: any) => ({...prev, instagram: e.target.value}))
            }
            value={data.instagram}
          ></InputField>
        </div>

        <div className="addProduct-input">
          <Label required labelName="Tiktok Link"></Label>
          <InputField
            type="text"
            placeholder="Enter Tiktok Link"
            onChange={(e: any) =>
              setData((prev: any) => ({...prev, tiktok: e.target.value}))
            }
            value={data.tiktok}
          ></InputField>
        </div>

        <div className="addProduct-input">
          <Label required labelName="Special Slogan"></Label>
          <InputField
            type="text"
            placeholder="Enter Special Slogan"
            onChange={(e: any) =>
              setData((prev: any) => ({...prev, specialSlogan: e.target.value}))
            }
            value={data.specialSlogan}
          ></InputField>
        </div>

        <div className="addProduct-input">
          <Label required labelName="Offer Text"></Label>
          <InputField
            type="text"
            placeholder="Enter Offer Text"
            onChange={(e: any) =>
              setData((prev: any) => ({...prev, offerText: e.target.value}))
            }
            value={data.offerText}
          ></InputField>
        </div>

        <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px'}}>
          <Button
            title={socialLinksId ? 'Update Social links' : 'Add Social Links'}
            onClick={addSubCategoryHandler}
            loading={socialLinksId ? isUpdateLoading : isCreateLoading}
          ></Button>
          
          {socialLinksId && (
            <Button
              title="Delete"
              onClick={handleDelete}
              loading={isDeleteLoading}
              style={{
                backgroundColor: '#dc2626',
                borderColor: '#dc2626'
              }}
            ></Button>
          )}
        </div>
      </div>
    </div>
  )
}