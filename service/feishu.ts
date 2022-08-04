import { OidcResp } from '../dto/common'
import { OidcService } from './core'
import { url as feishuApi } from '../data/feishu'
import * as FeishuDto from '../dto/feishu'
import { OidcError } from '../error/error'

type Platform = 'feishu'
export class FeishuOidc extends OidcService {
  private readonly appId: string
  private readonly appSecret: string
  private readonly appTicket: string
  private readonly redirectUrl: string

  constructor (appId, appSecret, appTicket, redirectUrl) {
    super()
    this.appId = appId
    this.appSecret = appSecret
    this.appTicket = appTicket
    this.redirectUrl = redirectUrl
  }

  async getAppAccessToken (): Promise<FeishuDto.AppAccessTokenResp> {
    const headers = {
      'Content-Type': 'application/json; charset=utf-8'
    }
    const appAccessTokenUrl = new URL(feishuApi.redirectLogin)
    const param: FeishuDto.AppAccessTokenReq = {
      app_id: this.appId,
      app_secret: this.appSecret,
      app_ticket: this.appTicket
    }
    Object.entries(param).forEach(([k, v]) => {
      appAccessTokenUrl.searchParams.append(k, v)
    })
    const res = await this.requestPromise(appAccessTokenUrl, headers)
    const tokenResp: FeishuDto.AppAccessTokenResp = JSON.parse(res)
    if (tokenResp.code !== 0) {
      throw new OidcError('feishu appAccessToken request return invalid code', 'appAccessTokenError')
    }
    return tokenResp
  }

  async redirectLogin (): Promise<OidcResp<'redirect', Platform>> {
    const redirectLoginUrl = new URL(feishuApi.redirectLogin)
    const param: FeishuDto.RedirectReq = {
      app_id: this.appId,
      redirect_uri: this.redirectUrl,
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

  async getAccessToken (code: string, state: string): Promise<OidcResp<'accessToken', Platform>> {
    if (!super.checkState(state)) {
      return await Promise.reject(new OidcError('state invalid', 'AccessTokenError'))
    }
    if (code === '') {
      return await Promise.reject(new OidcError('code invalid', 'AccessTokenError'))
    }

    const appToken = await this.getAppAccessToken()
    const headers = {
      Authorization: `Bearer ${appToken.app_access_token}`,
      'Content-Type': 'application/json; charset=utf-8'
    }
    const accessTokenUrl = new URL(feishuApi.accessToken)
    const param: FeishuDto.AccessTokenReq = {
      grant_type: 'authorization_code',
      code: appToken.code
    }
    Object.entries(param).forEach(([k, v]) => {
      accessTokenUrl.searchParams.append(k, v)
    })
    return await this.requestPromise(accessTokenUrl, headers).then((res) => {
      const resp: FeishuDto.AccessTokenResp = JSON.parse(res)
      if (resp.data.access_token === undefined) {
        throw new OidcError(
          'access token response not valid',
          'AccessTokenError'
        )
      }
      return {
        type: 'accessToken',
        result: resp
      }
    })
  }

  async getUserInfo (resp: OidcResp<'accessToken', Platform>): Promise<OidcResp<'userInfo', Platform>> {
    const userInfoUrl = new URL(feishuApi.userInfo)
    const headers =
    { Authorization: `Bearer ${resp.result.data.access_token}` }

    return await this.requestPromise(userInfoUrl, headers).then((res) => {
      const resp = JSON.parse(res)
      if (resp.code !== 0) {
        throw new OidcError('get userInfo response not valid', 'UserInfoError')
      }
      return {
        type: 'userInfo',
        result: resp
      }
    })
  }
}
