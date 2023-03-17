const domain = 'https://twitter.com'
const apiDomain = 'https://api.twitter.com'

const endpoint = {
  redirectLogin: '/i/oauth2/authorize',
  accessToken: '/2/oauth2/token',
  userInfo: '/v1/user_info'
}

export const url = {
  redirectLogin: `${domain}${endpoint.redirectLogin}`,
  accessToken: `${apiDomain}${endpoint.accessToken}`,
  userInfo: `${domain}${endpoint.userInfo}`
}
