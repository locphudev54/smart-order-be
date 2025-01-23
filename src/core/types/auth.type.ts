export type IAuthTokenPayload = {
  email: string
  fullName: string
  role: string
  iat?: number
  exp?: number
}

export type IAuthTokenType = {
  email: string
  fullName: string
  role: string
  iat: number
  exp: number
}
