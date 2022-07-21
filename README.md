![dependency](https://img.shields.io/badge/runtime%20library-none-green) ![l](https://img.shields.io/badge/language-typescript-blue)
![philosophy](https://img.shields.io/badge/philosophy-node%20way-yellow)
![MIT](https://img.shields.io/badge/license-MIT-informational) 

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

Nw-auth is a third-party-login component developed by node-way 👉 small code size, less interface exposure, and no runtime library.

It supports common OIDC protocol-compliant authentication systems and is very easy to use.

### [EN](README.md)/[中文](README_CN.md)

## Content
- [Content](#content)
- [Download and run the program](#download-and-run-the-program)
- [Third party login](#third-party-login)
  - [WeChat web application](#wechat-web-application)
    - [Install dependencies](#install-dependencies)
    - [Quick start](#quick-start)
    - [Type declaration](#type-declaration)
- [Supported platforms](#supported-platforms)
- [Donations and contributions](#donations-and-contributions)

## Download and run the program


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
# 编译
npm run clean
npm run build
# 测试
npm run test
# 启动
npm run start
# 使用
curl http(s)://<server_host>/wechat/login
```
## Third party login

### WeChat web application

#### Install dependencies

```shell
npm i nw-auth
```

#### Quick start

```typescript
import http from "http";

import { WechatOidc } from "./service/wechat";

export const server = http
  .createServer((req, res) => {
    const reqUrl = req.url as string;
    const url = new URL(reqUrl, `http://${req.headers.host}`);
    console.log("http request has been handled ->", url);
    if (url.pathname === "/wechat/login") {
      const callback = `http://${req.headers.host}/wechat/login`;
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      const oidcService = new WechatOidc(
        <appId>,
        <appSecret>
      );
      if (code === null || state === null) {
        oidcService.processOidc(callback).then((oidcResp) => {
          if (oidcResp.type === "redirect") {
            console.info("redirect user to -> ", oidcResp);
            res.writeHead(301, { Location: oidcResp.result as string });
            res.end();
          }
        });
      } else {
        oidcService
          .processOidc(callback, code, state)
          .then((oidcResp) => {
            if (oidcResp.type === "userInfo") {
              console.info(
                "request access token successful and get user info ->",
                oidcResp
              );
              res.writeHead(301, { Location: oidcResp.type });
              res.end();
            }
          })
          .catch((error) => {
            console.error("backend channel error ->", error);
          });
      }
    }
  })
  .listen(80);

```

#### Type declaration

```typescript
export declare type RedirectUrl = {
    appid: string;
    redirect_uri: string;
    response_type: "code";
    scope: string;
    state?: string;
};
export declare type CallbackReq = {
    code: string;
    state: string;
};
export declare type AccessTokenReq = {
    appid: string;
    secret: string;
    code: string;
    grant_type: "authorization_code";
};
export declare type AccessTokenResp = {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    openid: string;
    scope: string;
    unionid?: string;
};
export declare type AccessTokenRespError = {
    errcode: string;
    errmsg: string;
};
export declare type RefreshTokenReq = {
    appid: string;
    grant_type: string;
    refresh_token: string;
};
export declare type UserInfoReq = {
    access_token: string;
    openid: string;
    lang: "zh_CN" | "zh_TW" | "en";
};
export declare type UserInfoResp = {
    openid: string;
    nickname: string;
    sex: number;
    province: string;
    city: string;
    country: string;
    headimgurl: string;
    privilege: string[];
    unionid?: string;
};

```

## Supported platforms

| Platform | Class | constructor | Type declaration | support | 
| --- | --- | --- | --- |--- |
| Wechat | WechaOidc  | new WechatOidc(appid,appsecret) | dto/wechat.d.ts | yes |
| Github |  |  | | feature |
| StackOverFlow |  | | | feature |
| Weibo |  | | | feature |

## Donations and contributions
