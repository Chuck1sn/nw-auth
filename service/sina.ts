import { OidcResp } from '../dto/common'
import { OidcService } from './core'
import { url as sinaApi } from '../data/sina'
import * as SinaDto from '../dto/sina'
import { OidcError } from '../error/error'

type Platform = 'sina'
export class SinaOidc extends OidcService {
  private readonly clientId: string
  private readonly clientSecret: string
  private readonly redirectUrl: string

  constructor (clientId, clientSecret, redirectUrl) {
    super()
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.redirectUrl = redirectUrl
  }

  async redirectLogin (): Promise<OidcResp<'redirect', Platform>> {
    const redirectLoginUrl = new URL(sinaApi.redirectLogin)
    const param: SinaDto.RedirectUrl = {
      client_id: this.clientId,
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
    if (code !== '') {
      return await Promise.reject(new OidcError('code invalid', 'AccessTokenError'))
    }
    const accessTokenUrl = new URL(sinaApi.accessToken)
    const param: SinaDto.AccessTokenReq = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUrl
    }
    Object.entries(param).forEach(([k, v]) => {
      accessTokenUrl.searchParams.append(k, v)
    })
    return await this.requestPromise(accessTokenUrl).then((res) => {
      const resp = JSON.parse(res)
      if (resp.access_token === undefined) {
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
    const userInfoUrl = new URL(sinaApi.userInfo)
    const param: SinaDto.UserInfoReq = resp.result.access_token
    Object.entries(param).forEach(([k, v]) => {
      userInfoUrl.searchParams.append(k, v)
    })
    return await this.requestPromise(userInfoUrl).then((res) => {
      const resp = JSON.parse(res)
      if (resp.uid === undefined) {
        throw new OidcError('get userInfo response not valid', 'UserInfoError')
      }
      return {
        type: 'userInfo',
        result: resp
      }
    })
  }
}
