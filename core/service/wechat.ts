import { OidcService } from './core'
import * as WechatDto from '../dto/wechat'
import { url as wechatApi } from '../data/wechat'
import { OidcResp } from '../dto/common'
import { AccessTokenError, UserInfoError } from '../error/error'

type Platform = 'wechat'

export class WechatOidc extends OidcService {
	private readonly appId
	private readonly secret
	private readonly redirectUrl
	constructor(appId, secret, redirectUrl) {
		super()
		this.appId = appId
		this.secret = secret
		this.redirectUrl = redirectUrl
	}

	async redirectLogin(): Promise<OidcResp<'redirect', Platform>> {
		const redirectLoginUrl = new URL(wechatApi.redirectLogin)
		const param: WechatDto.RedirectReq = {
			appid: this.appId,
			redirect_uri: this.redirectUrl,
			response_type: 'code',
			scope: 'snsapi_login',
			state: super.createState()
		}
		Object.entries(param).forEach(([k, v]) => {
			redirectLoginUrl.searchParams.append(k, v)
		})
		return await Promise.resolve({
			type: 'redirect',
			result: redirectLoginUrl.toString()
		})
	}

	async getAccessToken(code: string, state: string): Promise<OidcResp<'accessToken', Platform>> {
		if (!super.checkState(state)) {
			return await Promise.reject(new AccessTokenError('state invalid'))
		}
		if (code === '') {
			return await Promise.reject(new AccessTokenError('code invalid'))
		}
		const accessTokenUrl = new URL(wechatApi.accessToken)
		const param: WechatDto.AccessTokenReq = {
			appid: this.appId,
			secret: this.secret,
			code,
			grant_type: 'authorization_code'
		}
		Object.entries(param).forEach(([k, v]) => {
			accessTokenUrl.searchParams.append(k, v)
		})
		return await this.requestPromise(accessTokenUrl).then((res) => {
			const resp = JSON.parse(res)
			if (resp.errcode !== undefined) {
				throw new AccessTokenError('access token response not valid')
			}
			return {
				type: 'accessToken',
				result: resp
			}
		})
	}

	async getUserInfo(
		resp: OidcResp<'accessToken', Platform>
	): Promise<OidcResp<'userInfo', Platform>> {
		const userInfoUrl = new URL(wechatApi.userInfo)
		const param: WechatDto.UserInfoReq = {
			access_token: resp.result.access_token,
			openid: resp.result.openid,
			lang: 'zh_CN'
		}
		Object.entries(param).forEach(([k, v]) => {
			userInfoUrl.searchParams.append(k, v)
		})
		return await this.requestPromise(userInfoUrl).then((res) => {
			const resp = JSON.parse(res)
			if (resp.errcode !== undefined) {
				throw new UserInfoError('userInfo response not valid')
			}
			return {
				type: 'userInfo',
				result: resp
			}
		})
	}
}
