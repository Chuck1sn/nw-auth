export interface AppAccessTokenReq {
	app_id: string
	app_secret: string
	app_ticket: string
}

export interface AppAccessTokenResp {
	code: number
	msg: string
	app_access_token: string
	expire: number
}

export interface RedirectReq {
	app_id: string
	redirect_uri: string
	state?: string
}

export interface CallbackReq {
	redirect_uri: string
	code: string
	state: string
}

export interface AccessTokenReqHeader {
	Authorization: string
	'Content-Type': 'application/json; charset=utf-8'
}

export interface AccessTokenReq {
	grant_type: 'authorization_code'
	code: number
}

export interface AccessTokenResp {
	code: number
	msg: string
	data: {
		access_token: string
		token_type: string
		expires_in: number
		name: string
		en_name: string
		avatar_url: string
		avatar_thumb: string
		avatar_middle: string
		avatar_big: string
		open_id: string
		union_id: string
		email: string
		enterprise_email: string
		user_id: string
		mobile: string
		tenant_key: string
		refresh_expires_in: number
		refresh_token: string
	}
}

export interface UserInfoHeaderReq {
	Authorization: string
}

export interface UserInfoResp {
	code: number
	msg: string
	data: {
		name: string
		en_name: string
		avatar_url: string
		avatar_thumb: string
		avatar_middle: string
		avatar_big: string
		open_id: string
		union_id: string
		email: string
		enterprise_email: string
		user_id: string
		mobile: string
		tenant_key: string
	}
}
