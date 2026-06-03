// // export const BASE_URL =
// //   import.meta.env.MODE === 'development'
// //     ? `${import.meta.env.REACT_APP_DEV_URL}`
// //     : `${import.meta.env.REACT_APP_PROD_URL}`

// // export const FILE_URL =
// //   import.meta.env.MODE === 'development'
// //     ? import.meta.env.REACT_APP_DEV_ASSET_URL
// //     : import.meta.env.REACT_APP_DEV_ASSET_URL

// // export const TABLE_LIMIT = 10
// // export const MODAL_TABLE_LIMIT = 10

// // Use Next.js-compatible env vars. Vite's `import.meta.env` is not available
// // during Next.js SSR so fall back to `process.env` here.
// const isDev = process.env.NODE_ENV === 'development'

// const getEnvValue = (...keys: string[]) => {
//   for (const key of keys) {
//     const value = process.env[key]
//     if (value) return value
//   }

//   return ''
// }

// export const BASE_URL = isDev
//   ? getEnvValue('NEXT_PUBLIC_DEV_URL', 'REACT_APP_DEV_URL') || 'http://localhost:8000/api'
//   : getEnvValue('NEXT_PUBLIC_PROD_URL', 'REACT_APP_PROD_URL') || '/api'

// export const FILE_URL = isDev
//   ? getEnvValue('NEXT_PUBLIC_DEV_ASSET_URL', 'REACT_APP_DEV_ASSET_URL') || 'http://localhost:8000/uploads'
//   : getEnvValue('NEXT_PUBLIC_PROD_ASSET_URL', 'REACT_APP_PROD_ASSET_URL') || ''

// export const TABLE_LIMIT = Number(process.env.NEXT_PUBLIC_TABLE_LIMIT) || 10
// export const MODAL_TABLE_LIMIT = 10

// ==============================
// API CONFIG (NEXT.JS SAFE VERSION)
// ==============================

/**
 * Get environment variable safely (supports old + new keys)
 */
const getEnv = (...keys: string[]) => {
  for (const key of keys) {
    if (process.env[key]) return process.env[key];
  }
  return '';
};

/**
 * Detect dev mode
 */
const isDev = process.env.NODE_ENV === 'development';

// ==============================
// BASE API URL
// ==============================
export const BASE_URL = isDev
  ? getEnv('NEXT_PUBLIC_DEV_URL', 'REACT_APP_DEV_URL') ||
    'http://localhost:8000/api'
  : getEnv('NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_PROD_URL', 'REACT_APP_PROD_URL') ||
    'https://api2.abhushangallery.com/api';

// ==============================
// FILE / ASSET URL
// ==============================
export const FILE_URL = isDev
  ? getEnv('NEXT_PUBLIC_DEV_ASSET_URL', 'REACT_APP_DEV_ASSET_URL') ||
    'http://localhost:8000/uploads'
  : getEnv('NEXT_PUBLIC_ASSET_URL', 'NEXT_PUBLIC_PROD_ASSET_URL', 'REACT_APP_PROD_ASSET_URL') ||
    'https://api2.abhushangallery.com';

// ==============================
// TABLE SETTINGS
// ==============================
export const TABLE_LIMIT =
  Number(getEnv('NEXT_PUBLIC_TABLE_LIMIT', 'REACT_APP_TABLE_LIMIT')) || 10;

export const MODAL_TABLE_LIMIT = 10;

// ==============================
// OPTIONAL ASSETS
// ==============================
export const SLIDER_ASSETS_URL =
  getEnv('NEXT_PUBLIC_SLIDER_ASSETS_URL', 'REACT_APP_SLIDER_ASSETS_URL') ||
  `${FILE_URL}/assets/banner`;

// ==============================
// APP CONFIG
// ==============================
export const APP_URL =
  getEnv('NEXT_PUBLIC_APP_URL') || 'https://abhushangallery.com';

export const FACEBOOK_APP_ID =
  getEnv('NEXT_PUBLIC_FACEBOOK_APP_ID') || '';

// ==============================
// GOOGLE AUTH
// ==============================
export const GOOGLE_CLIENT_ID =
  getEnv('NEXT_PUBLIC_GOOGLE_CLIENT_ID') || '';