export default () => ({
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET,
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET,
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME
  },
  tableToken: {
    secret: process.env.TABLE_TOKEN_SECRET
  },
  customerAccessToken: {
    // secret: process.env.CUSTOMER_ACCESS_TOKEN_SECRET,
    expiresIn: process.env.CUSTOMER_ACCESS_TOKEN_EXPIRATION_TIME
  },
  customerRefreshToken: {
    // secret: process.env.CUSTOMER_REFRESH_TOKEN_SECRET,
    expiresIn: process.env.CUSTOMER_REFRESH_TOKEN_EXPIRATION_TIME
  }
})
