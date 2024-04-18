export interface RedirectReq {
	client_id: string // 申请应用时分配的AppKey。
	redirect_uri: string // 授权回调地址，站外应用需与设置的回调地址一致，站内应用需填写canvas page的地址。
	scope?: string // 申请scope权限所需参数，可一次申请多个scope权限，用逗号分隔。使用文档
	state?: string // 用于保持请求和回调的状态，在回调时，会在Query Parameter中回传该参数。开发者可以用这个参数验证请求有效性，也可以记录用户请求授权页前的位置。这个参数可用于防止跨站请求伪造（CSRF）攻击
	display?: string // 授权页面的终端类型，取值见下面的说明。
	forcelogin?: boolean // 是否强制用户重新登录，true：是，false：否。默认false。
	language?: string // 授权页语言，缺省为中文简体版，en为英文版。英文版测试中，开发者任何意见可反馈至 @微博API
}

export interface CallbackReq {
	code: string
	state: string
}

export interface AccessTokenReq {
	client_id: string
	client_secret: string
	grant_type: 'authorization_code'
	code: string
	redirect_uri: string
}

export interface AccessTokenResp {
	access_token: string
	expires_in: number
	remind_in?: string
	uid: string // 授权用户唯一标识
}

export type UserInfoReq = string

export interface UserInfoResp {
	uid: string
	appkey: string
	scope: number
	create_at: string
	expire_in: string
}
