export interface RedirectReq {
  appid: string
  redirect_uri: string
  response_type: 'code'
  scope: string
  state?: string
}

export interface CallbackReq {
  code: string
  state: string
}

export interface AccessTokenReq {
  appid: string
  secret: string
  code: string
  grant_type: 'authorization_code'
}

export interface AccessTokenResp {
  access_token: string
  expires_in: number // access_token接口调用凭证超时时间，单位（秒）
  refresh_token: string
  openid: string // 授权用户唯一标识
  scope: string // 用户授权的作用域，使用逗号（,）分隔
  unionid?: string // 当且仅当该网站应用已获得该用户的 userInfo 授权时，才会出现该字段。
}

export interface AccessTokenRespError {
  errcode: string
  errmsg: string
}

export interface AccessTokenRespUnion extends AccessTokenResp, AccessTokenRespError {
}

export interface RefreshTokenReq {
  appid: string
  grant_type: string
  refresh_token: string
}

export interface UserInfoReq {
  access_token: string
  openid: string
  lang: 'zh_CN' | 'zh_TW' | 'en'
}

export interface UserInfoResp {
  openid: string
  nickname: string
  sex: number
  province: string
  city: string
  country: string
  headimgurl: string
  privilege: string[]
  unionid?: string
}
