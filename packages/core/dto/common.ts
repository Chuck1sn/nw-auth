import type * as WechatDto from './wechat'
import type * as SinaDto from './sina'
import type * as FeishuDto from './feishu'
import type * as GithubDto from './github'
import type * as GoogleDto from './google'
import type * as TwitterDto from './twitter'

export type Platform = 'wechat' | 'sina' | 'feishu' | 'github' | 'google' | 'twitter'
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
	google: GoogleDto.AccessTokenResp
	twitter: TwitterDto.AccessTokenResp
}

export interface PlatformUserInfoResp {
	wechat: WechatDto.UserInfoResp
	sina: SinaDto.UserInfoResp
	feishu: FeishuDto.UserInfoResp
	github: GithubDto.UserInfoResp
	google: GoogleDto.UserInfoResp
	twitter: TwitterDto.UserInfoResp
}
