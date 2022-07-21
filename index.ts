import http from 'http'

import { WechatOidc } from './service/wechat'

export const server = http
  .createServer((req, res) => {
    const reqUrl = req.url as string
    const url = new URL(reqUrl, `http://${req.headers.host as string}`)
    console.log('http request has been handled ->', url)
    if (url.pathname === '/wechat/login') {
      const callback = `http://${req.headers.host as string}/wechat/login`
      const code = url.searchParams.get('code')
      const state = url.searchParams.get('state')
      const oidcService = new WechatOidc('appId', 'appSecret')
      if (code === null || state === null) {
        oidcService.processOidc(callback).then((oidcResp) => {
          if (oidcResp.type === 'redirect') {
            console.info('redirect user to -> ', oidcResp)
            res.writeHead(301, { Location: oidcResp.result as string })
            res.end()
          }
        }).catch((err) => {
          console.log(err)
          res.writeHead(500)
          res.end()
        })
      } else {
        oidcService
          .processOidc(callback, code, state)
          .then((oidcResp) => {
            if (oidcResp.type === 'userInfo') {
              console.info(
                'request access token successful and get user info ->',
                oidcResp
              )
              res.writeHead(301, { Location: oidcResp.type })
              res.end()
            }
          })
          .catch((error) => {
            console.error('backend channel error ->', error)
          })
      }
    }
  })
  .listen(80)
