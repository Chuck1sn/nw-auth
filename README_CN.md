# Nw Auth

![dependency](https://img.shields.io/badge/runtime%20library-none-green?style=for-the-badge)
![philosophy](https://img.shields.io/badge/philosophy-node%20way-9cf?style=for-the-badge)

![l](https://img.shields.io/badge/language-typescript-blue?)
![node](https://img.shields.io/badge/node-%5E14.19.3-yellowgreen)
![test](https://img.shields.io/badge/tests-21%20passed%2C%200%20faild-critical)
![module](https://img.shields.io/badge/module-ESM-yellow)
![MIT](https://img.shields.io/badge/license-MIT-informational)


[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

**[EN](README.md)/[中文](README_CN.md)**

---

Node-Way-Auth 是一款采用 node way 理念开发的三方登录组件。其代码体积小、接口暴露少、无运行时依赖。

组件[支持](#支持平台)常见的遵守 OIDC 协议的身份认证系统，且部署简单，易于使用。

---
##  目录
- [Nw Auth](#nw-auth)
  - [目录](#目录)
  - [下载并运行](#下载并运行)
  - [使用手册](#使用手册)
      - [类型声明](#类型声明)
  - [支持平台](#支持平台)
## 下载并运行

```shell
git clone ... into <nw-auth-home>
cd <nw-auth-home>
```
```
├─ <nw-auth-home>
│   └── data
│   └── dto
│   └── error
│   └── service
│   └── ...
```

```shell
# compile
npm run clean
npm run build
# test
npm run test
# start
npm run start
# run example
curl http(s)://<server_host>/wechat/login
```
## 使用手册

**example on wechat oidc**

```shell
npm i nw-auth
```

```typescript
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
      const oidcService = new WechatOidc('appId', 'appSecret', callback)
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

```

#### 类型声明

```typescript

export interface RedirectUrl {
    appid: string;
    redirect_uri: string;
    response_type: 'code';
    scope: string;
    state?: string;
}
export interface CallbackReq {
    code: string;
    state: string;
}
export interface AccessTokenReq {
    appid: string;
    secret: string;
    code: string;
    grant_type: 'authorization_code';
}
export interface AccessTokenResp {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    openid: string;
    scope: string;
    unionid?: string;
}
export interface AccessTokenRespError {
    errcode: string;
    errmsg: string;
}
export interface AccessTokenRespUnion extends AccessTokenResp, AccessTokenRespError {
}
export interface RefreshTokenReq {
    appid: string;
    grant_type: string;
    refresh_token: string;
}
export interface UserInfoReq {
    access_token: string;
    openid: string;
    lang: 'zh_CN' | 'zh_TW' | 'en';
}
export interface UserInfoResp {
    openid: string;
    nickname: string;
    sex: number;
    province: string;
    city: string;
    country: string;
    headimgurl: string;
    privilege: string[];
    unionid?: string;
}

```

##  支持平台

| Platform                                                                       | Constructor                                             | Type declaration      |
| ------------------------------------------------------------------------------ | ------------------------------------------------------- | --------------------- |
| ![wechat](https://img.shields.io/badge/wechat-white?style=flat&logo=wechat)    | ```WechatOidc<appid,appsecret,redirectUrl>```           | ```dto/wechat.d.ts``` |
| ![sina](https://img.shields.io/badge/sina-red?style=flat&logo=sinaweibo)       | ```SinaOidc<clientId,clientSecret,redirectUrl>```       | ```dto/sina.d.ts```   |
| ![feishu](https://img.shields.io/badge/feishu-white?style=flat&logo=bytedance) | ```FeishuOidc<appId,appSecret,appTicket,redirectUrl>``` | ```dto/feishu.d.ts``` |
| ![github](https://img.shields.io/badge/github-black?style=flat&logo=github)    | ```GithubOidc<clientId,clientSecret,redirectUrl>```     | ```dto/feishu.d.ts``` |
