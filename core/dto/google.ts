export interface RedirectReq {
  client_id: string
  redirect_uri: string
  response_type: 'code'
  scope: 'https://www.googleapis.com/auth/userinfo.email'
  state?: string
  access_type: 'online'
}

export type CallBackParameter = CallbackReq | CallBackReqError

interface CallbackReq {
  code: string
  state: string
  scop: string
}

interface CallBackReqError {
  error: string
}

export interface AccessTokenReqHeader {
  'Content-Type': 'application/x-www-form-urlencoded'
  method: 'POST'
}
export interface AccessTokenReq {
  client_id: string
  client_secret: string
  code: string
  grant_type: 'authorization_code'
  redirect_uri: string
}

export interface AccessTokenResp {
  access_token: string
  expires_in: number // seconds -> 3920
  scope: string
  refresh_token?: string
  token_type: 'Bearer'
  id_token: string
}

export interface UserInfoReqHeader {
  Authorization: string
}

export interface UserInfoResp {
  sub: string
  email: string
  email_verified: boolean
  picture: string
}
