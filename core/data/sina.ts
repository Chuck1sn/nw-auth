const domian = 'https://api.weibo.com'

const endpoint = {
	redirectLogin: '/oauth2/authorize',
	accessToken: '/oauth2/access_token',
	userInfo: '/oauth2/get_token_info'
}

export const url = {
	redirectLogin: `${domian}${endpoint.redirectLogin}`,
	accessToken: `${domian}${endpoint.accessToken}`,
	userInfo: `${domian}${endpoint.userInfo}`
}
