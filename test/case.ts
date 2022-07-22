import { describe, it } from 'mocha'
import { assert } from 'chai'
import { WechatOidc } from '../service/wechat'
import { OidcServiceSpy } from './spy'
import { OidcError } from '../error/error'
import { faker } from '@faker-js/faker'
import sinon from 'sinon'
import { OidcResp } from '../dto/common'

describe('oidc state cache', function () {
  it('create state and check ext', function () {
    const spy = new OidcServiceSpy()
    const state = spy.createState()
    assert.equal(spy.checkState(state), true)
  })
})

describe('wechat oidc flow', function () {
  const callback = 'http://localhost/callback'
  const testDouble = new WechatOidc('appId', 'appSecret', callback)
  let mockState
  let mockCode

  describe('wechat oidc front channel', function () {
    let redirectUrl
    let state
    it('redirect user to wechat login page', async function () {
      return await testDouble.redirectLogin().then((result) => {
        assert.equal(result.type, 'redirect')
        redirectUrl = new URL(result.result)
        assert.equal(redirectUrl.searchParams.get('redirect_uri'), callback)
        state = redirectUrl.searchParams.get('state')
      })
    })
    it('get callback when user login successful', function (): void {
      const callBack = function (): void {
        mockState = state
        mockCode = faker.datatype.string()
      }
      callBack()
    })
  })
  describe('wechat oidc backend channel', function () {
    describe('get access token by state and code', function () {
      it('invalid state will get a invalid state error', async function () {
        // mock incorrect state
        const invalidState = 'INVALID_STATE'
        return await testDouble
          .getAccessToken(invalidState, 'mockedCode')
          .then((result) => {
            assert.fail('was not supposed to succeed')
          })
          .catch((error: OidcError) => {
            assert.equal(error instanceof OidcError, true)
            assert.equal(error.name, 'AccessTokenError')
          })
      })
      it('invalid code will get ad invalid state error', async function () {
        const invalidCode: unknown = null
        return await testDouble
          .getAccessToken(mockCode, invalidCode as string)
          .then((response) => {
            assert.fail('was not supposed to succeed')
          })
          .catch((error: OidcError) => {
            assert.equal(error instanceof OidcError, true)
            assert.equal(error.name, 'AccessTokenError')
          })
      })
      it('valid state and code will get access token', async function () {
        const getAccessToken = sinon.stub(testDouble, 'getAccessToken')
        getAccessToken.returns(
          Promise.resolve({
            type: 'accessToken',
            result: {
              access_token: faker.datatype.string(),
              expires_in: faker.datatype.number(),
              refresh_token: faker.datatype.string(),
              openid: faker.datatype.string(),
              scope: faker.datatype.string(),
              unionid: faker.datatype.string()
            }
          })
        )
        return await getAccessToken(mockCode, mockState).then((resp) => {
          assert.equal(resp.type, 'accessToken')
          getAccessToken.restore()
          accessToken = resp.result.access_token
          openid = resp.result.openid
          return resp
        })
      })
    })
    describe('get user info by access token', function () {
      it('get user info by valid access token', async function () {
        const getUserInfo = sinon.stub(testDouble, 'getUserInfo')
        getUserInfo.returns(
          Promise.resolve({
            type: 'userInfo',
            result: {
              openid: faker.datatype.string(),
              nickname: faker.name.middleName(),
              sex: faker.datatype.number(1),
              province: faker.address.city(),
              city: faker.address.cityName(),
              country: faker.address.country(),
              headimgurl: faker.image.imageUrl(),
              privilege: ['PRIVILEGE1', 'PRIVILEGE2'],
              unionid: faker.datatype.string()
            }
          })
        )
        const resp = {
          type: 'accessToken',
          result: {
            access_token: faker.datatype.string(),
            expires_in: faker.datatype.number(),
            refresh_token: faker.datatype.string(),
            openid: faker.datatype.string(),
            scope: faker.datatype.string(),
            unionid: faker.datatype.string()
          }
        } as const
        return await getUserInfo(resp).then((resp) => {
          getUserInfo.restore()
          assert.equal(resp.type, 'userInfo')
          assert.isNotNull(resp.result.unionid)
        })
      })
    })
  })
})
