
import { OidcResp } from '../dto/common'
import { OidcService } from './core'
import { url as twitterApi } from '../data/twitter'
import * as TwitterDto from '../dto/twitter'
import { AccessTokenError, UserInfoError } from '../error/error'

type Platform = 'twitter'
export class TwitterOidc extends OidcService {
  private readonly clientId: string
  private readonly redirectUrl: string

  constructor (clientId, redirectUrl) {
    super()
    this.clientId = clientId
    this.redirectUrl = redirectUrl
  }

  async redirectLogin (): Promise<OidcResp<'redirect', Platform>> {
    const redirectLoginUrl = new URL(twitterApi.redirectLogin)
    const param: TwitterDto.RedirectReq = {
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUrl,
      scope: 'users.read',
      state: super.createState(),
      code_challenge: 'test',
      code_challenge_method: 'plain'
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

    const accessTokenUrl = new URL(twitterApi.accessToken)
    const form: TwitterDto.AccessTokenReq = {
      grant_type: 'authorization_code',
      code,
      client_id: this.clientId,
      redirect_uri: this.redirectUrl,
      code_verifier: 'test'
    }
    const searchParams = new URLSearchParams()
    Object.entries(form).forEach(([k, v]) => {
      searchParams.append(k, v)
    })
    return await this.requestPromise(accessTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }, searchParams.toString()).then((resp) => {
      const result: TwitterDto.AccessTokenResp = JSON.parse(resp)
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
    const userInfoUrl = new URL(twitterApi.userInfo)
    const headers = { Authorization: `Bearer ${resp.result.access_token}` }
    return await this.requestPromise(userInfoUrl, headers).then((resp) => {
      const result: TwitterDto.UserInfoResp = JSON.parse(resp)
      if (result.data.id === undefined) {
        throw new UserInfoError('userInfo response not valid')
      }
      return {
        type: 'userInfo',
        result
      }
    })
  }
}
