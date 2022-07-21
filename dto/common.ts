import * as WechatDto from './wechat'
import * as SinaDto from './sina'

export interface OidcResp<E extends keyof FlowResult> {
  type: E
  result: FlowResult[E]
}

export interface FlowResult {
  redirect: string
  accessToken: PlatformAccessTokenResp
  userInfo: PlatformUserInfoResp
}

export interface PlatformAccessTokenResp extends WechatDto.AccessTokenResp, SinaDto.AccessTokenResp {

}

export interface PlatformUserInfoResp extends WechatDto.UserInfoResp, SinaDto.UserInfoResp {

}
