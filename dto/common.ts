import * as WechatDto from './wechat'
import * as SinaDto from './sina'
import * as FeishuDto from './feishu'
import * as GithubDto from './github'

export type Platform = 'wechat' | 'sina' | 'feishu' | 'github'
export interface OidcResp<E extends keyof FlowResult<P>, P extends Platform> {
  type: E
  result: FlowResult<P>[E]
}

export interface FlowResult<P extends Platform> {
  redirect: string
  accessToken: PlatformAccessTokenResp[P]
  userInfo: PlatformUserInfoResp[P]
}

export interface PlatformAccessTokenResp {
  wechat: WechatDto.AccessTokenResp
  sina: SinaDto.AccessTokenResp
  feishu: FeishuDto.AccessTokenResp
  github: GithubDto.AccessTokenResp
}

export interface PlatformUserInfoResp {
  wechat: WechatDto.UserInfoResp
  sina: SinaDto.UserInfoResp
  feishu: FeishuDto.UserInfoResp
  github: GithubDto.UserInfoResp
}
