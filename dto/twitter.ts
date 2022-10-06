export interface RedirectReq {
  response_type: 'code'
  client_id: string
  redirect_uri: string
  scope: 'users.read' // tweet.read%20users.read%20follows.read%20follows.write
  state: string
  code_challenge: string
  code_challenge_method: 'plain' // TODO random string on production
}

export interface CallbackReq {
  'redirect_uri': string
  'code': string
  'state': string
}

export interface AccessTokenReq {
  'grant_type': 'authorization_code'
  'code': string
  'client_id': string
  'redirect_uri': string
  'code_verifier': string
}

// TODO find real accessToken resp
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
  data: {
    'id': string
    'name': string
    'username': string
  }
}
