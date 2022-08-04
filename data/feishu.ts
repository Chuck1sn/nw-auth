const baseUrl = 'https://open.feishu.cn/open-apis/authen'

const uri = {
  appAccessToken: 'v3/app_access_token',
  redirectLogin: '/v1/index',
  accessToken: '/v1/access_token',
  userInfo: '/v1/user_info'
}

export const url = {
  appAccessToken: `${baseUrl}${uri.appAccessToken}`,
  redirectLogin: `${baseUrl}${uri.redirectLogin}`,
  accessToken: `${baseUrl}${uri.accessToken}`,
  userInfo: `${baseUrl}${uri.userInfo}`
}
