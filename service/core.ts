import https from 'https'
import { OidcResp, Platform } from '../dto/common'
import { CoreError } from '../error/error'

export abstract class OidcService {
  private static readonly stateCache = new Set()

  abstract redirectLogin (redirectUrl: string): Promise<OidcResp<'redirect', Platform>>

  abstract getAccessToken (
    code: string,
    state: string
  ): Promise<OidcResp<'accessToken', Platform>>

  abstract getUserInfo (
    resp: OidcResp<'accessToken', Platform>
  ): Promise<OidcResp<'userInfo', Platform>>

  processOidc = async (redirect: string, code?: string, state?: string): Promise<OidcResp<'userInfo' | 'redirect', Platform>> => {
    if (code === undefined) {
      return await this.redirectLogin(redirect)
    } else {
      const accessTokenResult: OidcResp<'accessToken', Platform> = await this.getAccessToken(code, state as string)
      return await this.getUserInfo(accessTokenResult)
    }
  }

  async requestPromise (url, options = {}): Promise<string> {
    return await new Promise((resolve, reject) => {
      const req = https.request(url, options, (res) => {
        let chunks = ''
        res.setEncoding('utf8')
        res.on('data', (d) => {
          chunks = chunks.concat(d)
        })
        res.on('error', (error: Error) => {
          const authError = new CoreError(
            `server response error ! param: ${JSON.stringify(url)} err :${error.message}`
          )
          reject(authError)
        })
        res.on('end', () => {
          resolve(chunks)
        })
      })
      req.on('error', (error) => {
        const authError = new CoreError(`request client error occur! param: ${JSON.stringify(url)} err :${error.message}`)
        reject(authError)
      })
      req.end()
    })
  }

  protected createState (): string {
    const state = Math.floor(Math.random() * 99999).toString()
    OidcService.stateCache.add(state)
    // cache expire
    setTimeout(() => {
      OidcService.stateCache.delete(state)
    }, 50000)
    return state
  }

  protected checkState (state: string): boolean {
    if (OidcService.stateCache.has(state)) {
      OidcService.stateCache.delete(state)
      return true
    } else {
      return false
    }
  }
}
