import * as WechatDto from './wechat'

export interface OidcResp<E extends keyof FlowResult> {
  type: E
  result: FlowResult[E]
}

export interface FlowResult {
  redirect: string
  accessToken: WechatDto.AccessTokenResp
  userInfo: WechatDto.UserInfoResp
}
