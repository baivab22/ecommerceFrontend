interface Assets {
  banner: string
  commonDescription: string
  profile: string
  testimonial: string
  textEditor: string
  contact: string
  welcome: string
  user: string
  classifiedAds: string
  claim: string
}

const assets: Assets = {
  banner: '/assets/banner',
  commonDescription: '/assets/common-description/',
  profile: '/assets/profile',
  testimonial: '/assets/testimonial',
  textEditor: '/assets/text-editor',
  contact: '/assets/contact',
  welcome: '/assets/welcome',
  user: '/assets/user',
  classifiedAds: '/assets/classified-ads',
  claim: '/assets/claim'
}

type AssetsKeys = keyof typeof assets

export const getImageUrl = (assetsType: AssetsKeys, imageSrc: string) => {
  const base = (process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEV_URL || process.env.REACT_APP_DEV_URL || 'http://localhost:8000/api'
    : process.env.NEXT_PUBLIC_PROD_URL || process.env.REACT_APP_PROD_URL || '/api') || ''

  return `${base.replace('/api', '')}${assets[assetsType]}/${imageSrc}`
}
