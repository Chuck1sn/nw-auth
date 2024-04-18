export class OidcError extends Error {
	constructor(message: string) {
		super(message)
		this.message = message
		this.name = 'OidcError'
	}
}

export class CoreError extends OidcError {
	constructor(message: string) {
		super(message)
		this.name = 'CoreError'
	}
}

export class AccessTokenError extends OidcError {
	constructor(message: string) {
		super(message)
		this.name = 'AccessTokenError'
	}
}

export class UserInfoError extends OidcError {
	constructor(message: string) {
		super(message)
		this.name = 'UserInfoError'
	}
}

export class AppAccessTokenError extends OidcError {
	constructor(message: string) {
		super(message)
		this.name = 'AppAccessTokenError'
	}
}
