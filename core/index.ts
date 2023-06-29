import http from 'http'

import { parse, type ParsedUrlQuery } from 'querystring'
import { type OidcService } from './service/core'
import { GithubOidc } from './service/github'
import { GoogleOidc } from './service/google'
import { FeishuOidc } from './service/feishu'
import { SinaOidc } from './service/sina'
import { TwitterOidc } from './service/twitter'
import { WechatOidc } from './service/wechat'

let _storedOidc: OidcService

function setStoredOidc(oidc): void {
	_storedOidc = oidc
}
function storedOidc(): OidcService {
	return _storedOidc
}

export const server = http
	.createServer((req, res) => {
		// const callback = `https://${req.headers.host as string}/test-auth/callback`
		const reqUrl = req.url as string
		const url = new URL(reqUrl, `https://${req.headers.host as string}`)
		if (req.method === 'POST' && url.pathname === '/process-oidc') {
			let body = ''
			req.on('data', (chunk: Buffer) => {
				body += chunk.toString() // convert Buffer to string
			})
			req.on('end', () => {
				console.log('🚀 ~ req.on ~ body:', body)
				const oidc = createOidcBy(parse(body))
				setStoredOidc(oidc)
				oidc
					.processOidc()
					.then((oidcResp) => {
						if (oidcResp.type === 'redirect') {
							console.info('redirect user to -> ', oidcResp)
							res.writeHead(301, { Location: oidcResp.result as string })
							res.end()
						}
					})
					.catch((err) => {
						console.log(err)
						res.writeHead(500)
						res.end('ok')
					})
			})
		}

		if (url.pathname === '/user-info') {
			const code = url.searchParams.get('code')
			const state = url.searchParams.get('state')
			console.log('handle user login callback ->', url)
			storedOidc()
				.processOidc(code, state)
				.then((oidcResp) => {
					if (oidcResp.type === 'userInfo') {
						console.info('request access token successful and get user info ->', oidcResp)
						res.writeHead(200, {
							'Access-Control-Allow-Origin': req.headers.origin,
							'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
							Vary: 'Origin'
						})
						res.write(JSON.stringify(oidcResp.result))
						res.end()
					}
				})
				.catch((error) => {
					res.writeHead(500)
					res.end()
					console.error('backend channel error ->', error)
				})
		}
	})
	.listen(80)

function createOidcBy(body: ParsedUrlQuery): OidcService {
	let result
	switch (body.platform) {
		case 'github': {
			result = new GithubOidc(body.clientId, body.clientSecret, body.callback, body.appName)
			break
		}
		case 'google': {
			result = new GoogleOidc(body.clientId, body.clientSecret, body.callback)
			break
		}
		case 'feishu': {
			result = new FeishuOidc(body.appId, body.appSecret, body.appTicket, body.callback)
			break
		}
		case 'sina': {
			result = new SinaOidc(body.clientId, body.clientSecret, body.callback)
			break
		}
		case 'twitter': {
			result = new TwitterOidc(body.clientId, body.callback)
			break
		}
		case 'wechat': {
			result = new WechatOidc(body.appId, body.secret, body.callback)
			break
		}
	}
	return result
}
