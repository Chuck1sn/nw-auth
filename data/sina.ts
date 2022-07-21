const baseUrl = 'https://api.weibo.com/'

const uri = {
  redirectLogin: '/oauth2/authorize',
  accessToken: '/oauth2/access_token',
  userInfo: '/oauth2/get_token_info'
}

export const url = {
  redirectLogin: `${baseUrl}${uri.redirectLogin}`,
  accessToken: `${baseUrl}${uri.accessToken}`,
  userInfo: `${baseUrl}${uri.userInfo}`
}
