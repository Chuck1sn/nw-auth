import { OidcResp } from '../dto/common'

export interface OidcFLow {
  (redirectUrl: string): Promise<OidcResp<'redirect' | 'userInfo'>>
  (redirectUrl: string, code: string, state: string): Promise<
  OidcResp<'redirect' | 'userInfo'>
  >
}
