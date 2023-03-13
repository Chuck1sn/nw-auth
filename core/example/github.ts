import http from 'http'

import { GithubOidc } from '../service/github'

export const server = http
  .createServer
  ((req, res) => {
    const reqUrl = req.url as string
    const url = new URL(reqUrl, `https://${req.headers.host as string}`)
    if (url.pathname === '/github/login') {
      const callback = `https://${req.headers.host as string}/github/login`
      const code = url.searchParams.get('code')
      const state = url.searchParams.get('state')
      const oidcService = new GithubOidc('<client_id>', '<client_secret>', callback, '<appName>')
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
        console.log('handle user login callback ->', url)
        oidcService
          .processOidc(callback, code, state)
          .then((oidcResp) => {
            if (oidcResp.type === 'userInfo') {
              console.info(
                'request access token successful and get user info ->',
                oidcResp
              )
              res.write(JSON.stringify(oidcResp.result))
              res.writeHead(200)
              res.end()
            }
          })
          .catch((error) => {
            res.writeHead(500)
            res.end()
            console.error('backend channel error ->', error)
          })
      }
    }
  })
  .listen(80)
