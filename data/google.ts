const domain = 'https://accounts.google.com'
const apiDomain = 'https://oauth2.googleapis.com'

const endpoint = {
  redirectLogin: '/o/oauth2/v2/auth',
  accessToken: '/token',
  userInfo: '/oauth2/v2/userinfo'
}

export const url = {
  redirectLogin: `${domain}${endpoint.redirectLogin}`,
  accessToken: `${apiDomain}${endpoint.accessToken}`,
  userInfo: `${apiDomain}${endpoint.userInfo}`
}
