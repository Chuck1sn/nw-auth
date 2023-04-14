export const domain = 'https://open.weixin.qq.com'
export const apiDomain = 'https://api.weixin.qq.com'

export const endpoint = {
	redirectLogin: '/connect/qrconnect',
	accessToken: '/sns/oauth2/access_token',
	refreshToken: '/sns/oauth2/refresh_token',
	validCheck: '/sns/auth',
	userInfo: '/sns/userinfo'
}

export const url = {
	redirectLogin: `${domain}${endpoint.redirectLogin}`,
	accessToken: `${apiDomain}${endpoint.accessToken}`,
	refreshToken: `${apiDomain}${endpoint.refreshToken}`,
	validCheck: `${apiDomain}${endpoint.validCheck}`,
	userInfo: `${apiDomain}${endpoint.userInfo}`
}
