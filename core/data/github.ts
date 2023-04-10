const domain = 'https://github.com/login'
const apiDomain = 'https://api.github.com'
const endpoint = {
  redirectLogin: '/oauth/authorize',
  accessToken: '/oauth/access_token',
  userInfo: '/user'
}

export const url = {
  redirectLogin: `${domain}${endpoint.redirectLogin}`,
  accessToken: `${domain}${endpoint.accessToken}`,
  userInfo: `${apiDomain}${endpoint.userInfo}`
}
