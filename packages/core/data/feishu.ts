const domain = 'https://open.feishu.cn/open-apis/authen'

const endpoint = {
	appAccessToken: '/v3/app_access_token',
	redirectLogin: '/v1/index',
	accessToken: '/v1/access_token',
	userInfo: '/v1/user_info'
}

export const url = {
	appAccessToken: `${domain}${endpoint.appAccessToken}`,
	redirectLogin: `${domain}${endpoint.redirectLogin}`,
	accessToken: `${domain}${endpoint.accessToken}`,
	userInfo: `${domain}${endpoint.userInfo}`
}
