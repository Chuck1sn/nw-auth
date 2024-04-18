import https from 'https'
import { type OidcResp, type Platform } from '../dto/common'
import { CoreError } from '../error/error'

export abstract class OidcService {
	private static readonly stateCache = new Set()

	abstract redirectLogin(): Promise<OidcResp<'redirect', Platform>>

	abstract getAccessToken(code: string, state: string): Promise<OidcResp<'accessToken', Platform>>

	abstract getUserInfo(
		resp: OidcResp<'accessToken', Platform>
	): Promise<OidcResp<'userInfo', Platform>>

	processOidc = async (
		code?: string | null,
		state?: string | null,
		error?: string | null
	): Promise<OidcResp<'userInfo' | 'redirect', Platform>> => {
		if (error !== null && error !== undefined) {
			throw new Error(error)
		} else if (code !== undefined && code !== null && state !== undefined && state !== null) {
			const accessTokenResult: OidcResp<'accessToken', Platform> = await this.getAccessToken(
				code,
				state
			)
			return await this.getUserInfo(accessTokenResult)
		} else {
			return await this.redirectLogin()
		}
	}

	async requestPromise(url, options = {}, body?: string): Promise<string> {
		return await new Promise((resolve, reject) => {
			const req = https.request(url, options, (res) => {
				let chunks = ''
				res.setEncoding('utf8')
				res.on('data', (d) => {
					chunks = chunks.concat(d)
				})
				res.on('error', (error: Error) => {
					const authError = new CoreError(
						`server response error ! param: ${JSON.stringify(url)} err :${error.message}`
					)
					reject(authError)
				})
				res.on('end', () => {
					resolve(chunks)
				})
			})
			if (body !== undefined) {
				req.write(body)
			}
			req.on('error', (error) => {
				const authError = new CoreError(
					`request client error occur! param: ${JSON.stringify(url)} err :${error.message}`
				)
				reject(authError)
			})
			req.end()
		})
	}

	protected createState(): string {
		const state = Math.floor(Math.random() * 99999).toString()
		OidcService.stateCache.add(state)
		// cache expire
		setTimeout(() => {
			OidcService.stateCache.delete(state)
		}, 50000)
		return state
	}

	protected checkState(state: string): boolean {
		if (OidcService.stateCache.has(state)) {
			OidcService.stateCache.delete(state)
			return true
		} else {
			return false
		}
	}
}
