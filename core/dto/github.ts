export interface RedirectReq {
  client_id: string
  redirect_uri: string
  login?: string
  scope?: string
  state?: string
  allow_signup?: string
}

export interface CallbackReq {
  code: string
  state: string
}

export interface AccessTokenReq {
  client_id: string
  client_secret: string
  code: string
  redirect_uri?: string
}

export interface AccessTokenReqHeader {
  Accept: 'application/json'
  'User-Agent': string
  Authorization: 'string'
}

export interface AccessTokenResp {
  access_token: string
  scope: string
  token_type: string
}

export interface UserInfoReqHeader {
  Authorization: string
  Accept: 'application/json'
}

export interface UserInfoResp {
  login: string
  id: string
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string
  company: string
  blog: string
  location: string
  email: string
  hireable: string
  bio: string
  twitter_username: string
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}
