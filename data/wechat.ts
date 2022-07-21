export const baseUrl = 'https://api.weixin.qq.com'
export const redirectBaseUrl = 'https://open.weixin.qq.com'

export const uri = {
  redirectLogin: '/connect/qrconnect',
  accessToken: '/sns/oauth2/access_token',
  refreshToken: '/sns/oauth2/refresh_token',
  validCheck: '/sns/auth',
  userInfo: '/sns/userinfo'
}

export const url = {
  redirectLogin: `${redirectBaseUrl}${uri.redirectLogin}`,
  accessToken: `${baseUrl}${uri.accessToken}`,
  refreshToken: `${baseUrl}${uri.refreshToken}`,
  validCheck: `${baseUrl}${uri.validCheck}`,
  userInfo: `${baseUrl}${uri.userInfo}`
}
