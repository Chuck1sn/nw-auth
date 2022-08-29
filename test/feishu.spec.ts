import { FeishuOidc } from '../service/feishu'
import { describe, it } from 'mocha'
import { faker } from '@faker-js/faker'
import { AccessTokenError } from '../error/error'
import sinon from 'sinon'
import chai from 'chai'
// Load chai assertions
import chaiAsPromised from 'chai-as-promised'
const expect = chai.expect
const assert = chai.assert
// Load chai-as-promised support
chai.use(chaiAsPromised)

describe('feishu oidc flow', function () {
  const callback = 'http://localhost/callback'
  const testDouble = new FeishuOidc('appId', 'appSecret', 'appTicket', callback)
  let mockState
  let mockCode
  describe('feishu oidc front channel', function () {
    let redirectUrl
    let state
    it('redirect user to feishu login page', async function () {
      return await testDouble.redirectLogin().then((resp) => {
        assert.equal(resp.type, 'redirect')
        redirectUrl = new URL(resp.result)
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
  describe('feishu oidc backend channel', function () {
    const mockAccessTokenResp = {
      code: faker.datatype.number(),
      msg: faker.datatype.string(),
      data: {
        access_token: faker.datatype.string(),
        token_type: faker.datatype.string(),
        expires_in: faker.datatype.number(),
        name: faker.datatype.string(),
        en_name: faker.datatype.string(),
        avatar_url: faker.datatype.string(),
        avatar_thumb: faker.datatype.string(),
        avatar_middle: faker.datatype.string(),
        avatar_big: faker.datatype.string(),
        open_id: faker.datatype.string(),
        union_id: faker.datatype.string(),
        email: faker.datatype.string(),
        enterprise_email: faker.datatype.string(),
        user_id: faker.datatype.string(),
        mobile: faker.datatype.string(),
        tenant_key: faker.datatype.string(),
        refresh_expires_in: faker.datatype.number(),
        refresh_token: faker.datatype.string()
      }
    }

    describe('get access token by state and code', function () {
      it('invalid state will get a invalid state error', async function () {
        // mock incorrect state
        const invalidState = 'INVALID_STATE'
        return await expect(testDouble.getAccessToken(mockCode, invalidState)).to.eventually.rejectedWith(AccessTokenError)
      })
      // it('invalid code will get a invalid code error', async function () {
      //   const invalidCode = ''
      //   return await expect(testDouble.getAccessToken(invalidCode, mockState)).to.eventually.rejectedWith(OidcError)
      // })
      it('valid state and code will get access token', async function () {
        const requestPromise = sinon.stub(testDouble, 'requestPromise')
          .returns(
            Promise.resolve(JSON.stringify(mockAccessTokenResp))
          )
        const getAppAccessToken = sinon.stub(testDouble, 'getAppAccessToken').returns(
          Promise.resolve({
            code: 0,
            msg: faker.datatype.string(),
            app_access_token: faker.datatype.string(),
            expire: faker.datatype.number()
          })
        )
        return await testDouble.getAccessToken(mockCode, mockState).then((resp) => {
          expect(requestPromise.calledOnce)
          expect(getAppAccessToken.calledOnce)
          assert.equal(resp.type, 'accessToken')
          assert.equal(resp.result.data.open_id, mockAccessTokenResp.data.open_id)
          requestPromise.restore()
        })
      })
    })
    describe('get user info by access token', function () {
      it('get user info by valid access token', async function () {
        const stubValue = {
          code: 0,
          msg: faker.datatype.string(),
          data: {
            name: faker.datatype.string(),
            en_name: faker.datatype.string(),
            avatar_url: faker.datatype.string(),
            avatar_thumb: faker.datatype.string(),
            avatar_middle: faker.datatype.string(),
            avatar_big: faker.datatype.string(),
            open_id: faker.datatype.string(),
            union_id: faker.datatype.string(),
            email: faker.datatype.string(),
            enterprise_email: faker.datatype.string(),
            user_id: faker.datatype.string(),
            mobile: faker.datatype.string(),
            tenant_key: faker.datatype.string()
          }
        }
        const requestPromise = sinon.stub(testDouble, 'requestPromise')
          .returns(
            Promise.resolve(JSON.stringify(stubValue))
          )
        const req = {
          type: 'accessToken',
          result: mockAccessTokenResp
        } as const
        return await testDouble.getUserInfo(req).then((resp) => {
          expect(requestPromise.calledOnce)
          assert.equal(resp.type, 'userInfo')
          assert.equal(resp.result.data.open_id, stubValue.data.open_id)
        })
      })
    })
  })
})
