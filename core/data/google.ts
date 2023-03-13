const domain = 'https://accounts.google.com'
const tokenDomain = 'https://oauth2.googleapis.com'
const userDomain = 'https://www.googleapis.com'

const endpoint = {
  redirectLogin: '/o/oauth2/v2/auth',
  accessToken: '/token',
  userInfo: '/oauth2/v3/userinfo'
}

export const url = {
  redirectLogin: `${domain}${endpoint.redirectLogin}`,
  accessToken: `${tokenDomain}${endpoint.accessToken}`,
  userInfo: `${userDomain}${endpoint.userInfo}`
}
