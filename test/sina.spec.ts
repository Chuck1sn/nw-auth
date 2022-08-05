import { SinaOidc } from '../service/sina'
import { describe, it } from 'mocha'
import { faker } from '@faker-js/faker'
import { OidcError } from '../error/error'
import sinon from 'sinon'
import chai from 'chai'
// Load chai assertions
import chaiAsPromised from 'chai-as-promised'
const expect = chai.expect
const assert = chai.assert
// Load chai-as-promised support
chai.use(chaiAsPromised)

describe('sina oidc flow', function () {
  const callback = 'http://localhost/callback'
  const testDouble = new SinaOidc('clientId', 'clientSecret', callback)
  let mockState
  let mockCode
  describe('sina oidc front channel', function () {
    let redirectUrl
    let state
    it('redirect user to sina login page', async function () {
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
        return await expect(testDouble.getAccessToken('mockedCode', invalidState)).to.eventually.rejectedWith(OidcError)
      })
      // it('invalid code will get ad invalid state error', async function () {
      //   const invalidCode = ''
      //   return await expect(testDouble.getAccessToken(invalidCode, 'STATE')).to.eventually.rejectedWith(OidcError)
      // })
      it('valid state and code will get access token', async function () {
        const stubValue = {
          access_token: faker.datatype.string(),
          expires_in: faker.datatype.number(),
          remind_in: faker.datatype.string(),
          uid: faker.datatype.string()
        }
        const requestPromise = sinon.stub(testDouble, 'requestPromise')
          .returns(
            Promise.resolve(JSON.stringify(stubValue))
          )
        return await testDouble.getAccessToken(mockCode, mockState).then((resp) => {
          expect(requestPromise.calledOnce)
          assert.equal(resp.type, 'accessToken')
          assert.equal(resp.result.uid, stubValue.uid)
          requestPromise.restore()
          return resp
        })
      })
    })
    describe('get user info by access token', function () {
      it('get user info by valid access token', async function () {
        const stubValue = {
          uid: faker.datatype.string(),
          appkey: faker.datatype.string(),
          scope: faker.datatype.number(),
          create_at: faker.datatype.string(),
          expire_in: faker.datatype.string()
        }
        const requestPromise = sinon.stub(testDouble, 'requestPromise').returns(
          Promise.resolve(JSON.stringify(stubValue))
        )
        const req = {
          type: 'accessToken',
          result: {
            access_token: faker.datatype.string(),
            expires_in: faker.datatype.number(),
            remind_in: faker.datatype.string(),
            uid: faker.datatype.string() // 授权用户唯一标识
          }
        } as const
        return await testDouble.getUserInfo(req).then((resp) => {
          expect(requestPromise.calledOnce)
          assert.equal(resp.type, 'userInfo')
          assert.equal(resp.result.uid, stubValue.uid)
        })
      })
    })
  })
})
