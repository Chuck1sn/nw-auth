import https from 'https'
import { OidcResp } from '../dto/common'
import { OidcError } from '../error/error'
import { OidcFLow } from '../interface/function'

export abstract class OidcService {
  private static readonly stateCache = new Set()

  abstract redirectLogin (redirectUrl: string): Promise<OidcResp<'redirect'>>

  abstract getAccessToken (
    code: string,
    state: string
  ): Promise<OidcResp<'accessToken'>>

  abstract getUserInfo (
    accessToken: string,
    openid?: string
  ): Promise<OidcResp<'userInfo'>>

  processOidc: OidcFLow = async (redirect: string, code?: string, state?: string) => {
    if (code === undefined) {
      return await this.redirectLogin(redirect)
    } else {
      return await this.getAccessToken(code, state as string).then(
        async (resp: OidcResp<'accessToken'>) => {
          return await this.getUserInfo(resp.result.access_token, resp.result.openid)
        }
      )
    }
  }

  async requestPromise (options: URL): Promise<string> {
    return await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let chunks = ''
        res.setEncoding('utf8')
        res.on('data', (d) => {
          chunks = chunks.concat(d)
        })
        res.on('error', (error: Error) => {
          const authError = new OidcError(
            `server response error ! param: ${options.toString()} err :${error.message}`,
            'OidcError'
          )
          reject(authError)
        })
        res.on('end', () => {
          resolve(chunks)
        })
      })
      req.on('error', (error) => {
        const authError = new OidcError(
          `request client error occur! param: ${options.toString()} err :${error.message}`,
          'OidcError'
        )
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
