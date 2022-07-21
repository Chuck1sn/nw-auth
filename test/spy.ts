import { OidcResp } from '../dto/common'
import { OidcService } from '../service/core'

export class OidcServiceSpy extends OidcService {
  async redirectLogin (redirectUrl: string): Promise<OidcResp<'redirect'>> {
    throw new Error('Method not implemented.')
  }

  async getAccessToken (
    code: string,
    state: string
  ): Promise<OidcResp<'accessToken'>> {
    throw new Error('Method not implemented.')
  }

  async getUserInfo (
    accessToken: string,
    openid: string
  ): Promise<OidcResp<'userInfo'>> {
    throw new Error('Method not implemented.')
  }

  createState (): string {
    return super.createState()
  }

  checkState (state: string): boolean {
    return super.checkState(state)
  }
}
