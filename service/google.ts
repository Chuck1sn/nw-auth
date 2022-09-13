import { OidcResp } from '../dto/common'
import { OidcService } from './core'
import { url as googleApi } from '../data/google'
import * as GoogleDto from '../dto/google'
import { AccessTokenError, UserInfoError } from '../error/error'

type Platform = 'google'
export class GoogleOidc extends OidcService {
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
    const redirectLoginUrl = new URL(googleApi.redirectLogin)
    const param: GoogleDto.RedirectReq = {
      client_id: this.clientId,
      redirect_uri: this.redirectUrl,
      response_type: 'code',
      access_type: 'online',
      scope: 'https://www.googleapis.com/auth/userinfo.email',
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
      return await Promise.reject(new AccessTokenError('state invalid'))
    }
    if (code === '') {
      return await Promise.reject(new AccessTokenError('code invalid'))
    }

    const accessTokenUrl = new URL(googleApi.accessToken)
    const form: GoogleDto.AccessTokenReq = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUrl
    }
    return await this.requestPromise(accessTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form
    }).then((resp) => {
      const result: GoogleDto.AccessTokenResp = JSON.parse(resp)
      if (result.access_token === undefined) {
        throw new AccessTokenError(
          'access token response not valid'
        )
      }
      return {
        type: 'accessToken',
        result
      }
    })
  }

  async getUserInfo (resp: OidcResp<'accessToken', Platform>): Promise<OidcResp<'userInfo', Platform>> {
    const userInfoUrl = new URL(googleApi.userInfo)
    const options = { Authorization: `Bearer ${resp.result.access_token}` }
    return await this.requestPromise(userInfoUrl, options).then((resp) => {
      const result: GoogleDto.UserInfoResp = JSON.parse(resp)
      if (result.sub === null) {
        throw new UserInfoError('userInfo response not valid')
      }
      return {
        type: 'userInfo',
        result
      }
    })
  }
}
