export const BASE_URL =
  import.meta.env.MODE === 'development'
    ? `${import.meta.env.REACT_APP_DEV_URL}`
    : `${import.meta.env.REACT_APP_PROD_URL}`

export const FILE_URL =
  import.meta.env.MODE === 'development'
    ? import.meta.env.REACT_APP_DEV_URL
    : import.meta.env.REACT_APP_PROD_URL

export const TABLE_LIMIT = 10
export const MODAL_TABLE_LIMIT = 10
