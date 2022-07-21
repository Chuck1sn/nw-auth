![dependency](https://img.shields.io/badge/runtime%20library-none-green) ![l](https://img.shields.io/badge/language-typescript-blue)
![philosophy](https://img.shields.io/badge/philosophy-node%20way-yellow)
![MIT](https://img.shields.io/badge/license-MIT-informational) 

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)


nw-auth 是一款采用 node-way 理念开发的三方登录组件 👉 它代码体积小、接口暴露少、无运行时依赖。

支持市面上常见的符合 OIDC 协议的身份认证系统且十分易于使用。

### [EN](README.md)/[中文](README_CN.md)

## 目录
- [目录](#目录)
- [下载并运行程序](#下载并运行程序)
- [对接三方登陆](#对接三方登陆)
  - [微信网页应用](#微信网页应用)
    - [安装依赖](#安装依赖)
    - [快速对接](#快速对接)
    - [类型声明](#类型声明)
- [支持平台](#支持平台)
- [捐赠与贡献](#捐赠与贡献)

## 下载并运行程序

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
## 对接三方登陆

### 微信网页应用

#### 安装依赖

```shell
npm i nw-auth
```

#### 快速对接

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

#### 类型声明

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

## 支持平台

| 平台 | 类 | 构造函数 | 类型声明 | 支持 | 
| --- | --- | --- | --- |--- |
| 微信 | WechaOidc  | new WechatOidc(appid,appsecret) | dto/wechat.d.ts | 是 |
| Github |  |  | | 开发中 |
| StackOverFlow |  | | | 开发中 |
| 微博 |  | | | 开发中 |

## 捐赠与贡献
