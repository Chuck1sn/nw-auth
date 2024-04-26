# Node Auth

![dependency](https://img.shields.io/badge/runtime%20library-none-green?style=for-the-badge)
![philosophy](https://img.shields.io/badge/philosophy-node%20way-9cf?style=for-the-badge)

![l](https://img.shields.io/badge/language-typescript-blue?)
![node](https://img.shields.io/badge/node-%5E20.10.0-yellowgreen)
![test](https://img.shields.io/badge/tests-26%20passed%2C%200%20faild-critical)
![module](https://img.shields.io/badge/module-ESM-yellow)
![MIT](https://img.shields.io/badge/license-MIT-informational)

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

**[中文](README_CN.md)/[EN](README.md)**

---

一款采用 node way 理念开发的三方登录组件。其特点为：

- 🍒 代码体积小
- 🍋 接口暴露少
- 🥝 无运行时依赖

组件基于 OIDC 身份认证流程设计与开发，无论是常见的[三方登录平台](#支持平台)还是自部署的 OIDC 认证服务器都可以得到完善的支持。

## Usage

```shell
npm i nw-auth
```

### Github 三方登录示例

```shell
git clone ... into ${NW-AUTH-HOME}
vim/nano ${NW-AUTH-HOME}/packages/core/example/github.ts
```

```typescript
import http from 'http'

import { GithubOidc } from '../service/github'

export const server = http
 .createServer((req, res) => {
  const reqUrl = req.url as string
  const url = new URL(reqUrl, `https://${req.headers.host as string}`)
  if (url.pathname === '/github/login') {
   const callback = `https://${req.headers.host as string}/github/login`
   const code = url.searchParams.get('code')
   const state = url.searchParams.get('state')
   const oidcService = new GithubOidc('<client_id>', '<client_secret>', callback, '<appName>')
   if (code === null || state === null) {
    oidcService
     .processOidc(callback)
     .then((oidcResp) => {
      if (oidcResp.type === 'redirect') {
       console.info('redirect user to -> ', oidcResp)
       res.writeHead(301, { Location: oidcResp.result as string })
       res.end()
      }
     })
     .catch((err) => {
      console.log(err)
      res.writeHead(500)
      res.end()
     })
   } else {
    console.log('handle user login callback ->', url)
    oidcService
     .processOidc(code, state)
     .then((oidcResp) => {
      if (oidcResp.type === 'userInfo') {
       console.info('request access token successful and get user info ->', oidcResp)
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

```

### OIDC 流程节点类型声明

```typescript

export interface RedirectReq {
    client_id: string;
    redirect_uri: string;
    login?: string;
    scope?: string;
    state?: string;
    allow_signup?: string;
}
export interface CallbackReq {
    code: string;
    state: string;
}
export interface AccessTokenReq {
    client_id: string;
    client_secret: string;
    code: string;
    redirect_uri?: string;
}
export interface AccessTokenReqHeader {
    Accept: 'application/json';
    'User-Agent': string;
    Authorization: 'string';
}
export interface AccessTokenResp {
    access_token: string;
    scope: string;
    token_type: string;
}
export interface UserInfoReqHeader {
    Authorization: string;
    Accept: 'application/json';
}
export interface UserInfoResp {
    login: string;
    id: string;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    ...
}

```

## 测试

### 单元测试

```shell
git clone ... into ${NW-AUTH-HOME}
cd ${NW-AUTH-HOME}
npm i
npm run test -w packages/core
```

### 自部署测试

🎁 新版本的组件增加了一个自部署的 web 应用，以对接示例和可视化页面的方式提供三方登录平台的对接测试。

![flow](flow.png)

### 使用示例测试

```shell
git clone ... into ${NW-AUTH-HOME}
cd ${NW-AUTH-HOME}
npm i
# Default app server -> http://localhost:80
npm run dev -w packages/core
# Run example
curl http(s)://<server_host>/github/login
```

### 可视化测试

```shell
git clone ... into ${NW-AUTH-HOME}
cd ${NW-AUTH-HOME}
```

```
.
├──LICENSE
├──package-lock.json
├──package.json
├──.gitignore
├──packages/
│   ├──core/
│   │   ├── ...
│   └──page/
│       ├── ...
└──README.md
```

```shell
# On shell session1 (default app server host port -> http://localhost:80)
npm run dev -w packages/core
# On shell session2 (default page server host port -> http://localhost:5173)
npm run dev -w packages/page
```

![page](page.png)

## 支持平台

| Platform                                                                       | Constructor                                             | Type declaration  | Example             |
| ------------------------------------------------------------------------------ | ------------------------------------------------------- | ----------------- | ------------------- |
| ![wechat](https://img.shields.io/badge/wechat-white?style=flat&logo=wechat)    | `WechatOidc<appid,appsecret,redirectUrl>`               | `dto/wechat.d.ts` |                     |
| ![sina](https://img.shields.io/badge/sina-red?style=flat&logo=sinaweibo)       | `SinaOidc<clientId,clientSecret,redirectUrl>`           | `dto/sina.d.ts`   | `example/sina.ts`   |
| ![feishu](https://img.shields.io/badge/feishu-white?style=flat&logo=bytedance) | `FeishuOidc<appId,appSecret,appTicket,redirectUrl>`     | `dto/feishu.d.ts` |                     |
| ![github](https://img.shields.io/badge/github-black?style=flat&logo=github)    | `GithubOidc<clientId,clientSecret,redirectUrl,appName>` | `dto/github.d.ts` | `example/github.ts` |
| ![google](https://img.shields.io/badge/google-white?style=flat&logo=google)    | `GoogleOidc<clientId,clientSecret,redirectUrl>`         | `dto/google.d.ts` | `example/google.ts` |
| ![twitter](https://img.shields.io/badge/twitter-white?style=flat&logo=twitter)    | `TwitterOidc<clientId,redirectUrl>`         | `dto/twitter.d.ts` | `example/twitter.ts` |
