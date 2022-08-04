export class OidcError extends Error {
  cause?: Error
  name: 'OidcError' | 'AccessTokenError' | 'UserInfoError' | 'appAccessTokenError'
  constructor (message, name, cause?) {
    super()
    this.message = message
    this.name = name
    this.cause = cause
  }
}
