import { describe, it } from 'mocha'
import { WechatOidc } from '../service/wechat'
import { OidcServiceStub } from './stub'
import { AccessTokenError } from '../error/error'
import { faker } from '@faker-js/faker'
import sinon from 'sinon'
import chaiAsPromised from 'chai-as-promised'
import chai from 'chai'
const expect = chai.expect
const assert = chai.assert
chai.use(chaiAsPromised)

describe('oidc state cache', function () {
  it('create state and check ext', function () {
    const spy = new OidcServiceStub()
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
        return await expect(testDouble.getAccessToken('mockedCode', invalidState)).to.eventually.rejectedWith(AccessTokenError)
      })
      // it('invalid code will get ad invalid state error', async function () {
      //   const invalidCode = ''
      //   return await expect(testDouble.getAccessToken(invalidCode, invalidState)).to.eventually.rejectedWith(AccessTokenError)
      // })
      it('valid state and code will get access token', async function () {
        const stubValue = {
          access_token: faker.datatype.string(),
          expires_in: faker.datatype.number(),
          refresh_token: faker.datatype.string(),
          openid: faker.datatype.string(),
          scope: faker.datatype.string(),
          unionid: faker.datatype.string()
        }
        const requestPromise = sinon.stub(testDouble, 'requestPromise')
        requestPromise.returns(Promise.resolve(JSON.stringify(stubValue)))
        return await testDouble.getAccessToken(mockCode, mockState).then((resp) => {
          expect(requestPromise.calledOnce)
          assert.equal(resp.type, 'accessToken')
          assert.equal(resp.result.openid, stubValue.openid)
          requestPromise.restore()
          return resp
        })
      })
    })
    describe('get user info by access token', function () {
      it('get user info by valid access token', async function () {
        const stubValue = {
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
        const requestPromise = sinon.stub(testDouble, 'requestPromise').returns(
          Promise.resolve(JSON.stringify(stubValue)))
        const accessTokenResp = {
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
        return await testDouble.getUserInfo(accessTokenResp).then((resp) => {
          expect(requestPromise.calledOnce)
          assert.equal(resp.type, 'userInfo')
          assert.equal(resp.result.openid, stubValue.openid)
        })
      })
    })
  })
})
