import http from 'http'
import { GoogleOidc } from '../service/google'

export const server = http
	.createServer((req, res) => {
		const endpoint = req.url as string
		const url = new URL(endpoint, `https://${req.headers.host as string}`)
		if (url.pathname === '/google/login') {
			const callback = `https://${req.headers.host as string}/google/login`
			const code = url.searchParams.get('code')
			const state = url.searchParams.get('state')
			const oidcService = new GoogleOidc('<clientId>', '<clientSecret>', callback)
			if (code === null || state === null) {
				oidcService
					.processOidc(callback)
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
						res.end()
					})
			} else {
				console.log('handle user login callback ->', url)
				oidcService
					.processOidc(code, state)
					.then((oidcResp) => {
						if (oidcResp.type === 'userInfo') {
							console.info('request access token successful and get user info ->', oidcResp)
							res.write(JSON.stringify(oidcResp.result))
							res.writeHead(200)
							res.end()
						}
					})
					.catch((error) => {
						res.writeHead(500)
						res.end()
						console.error('backend channel error ->', error)
					})
			}
		}
	})
	.listen(80)
