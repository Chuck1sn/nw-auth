import { GithubOidc } from '../service/github'
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

describe('github oidc flow', function () {
  const callback = 'http://localhost/callback'
  const testDouble = new GithubOidc('clientId', 'clientSecret', callback, 'appName')
  let mockState
  let mockCode
  describe('github oidc front channel', function () {
    let redirectUrl
    let state
    it('redirect user to github login page', async function () {
      await testDouble.redirectLogin().then((resp) => {
        assert.equal(resp.type, 'redirect')
        redirectUrl = new URL(resp.result)
        assert.equal(redirectUrl.searchParams.get('redirect_uri'), callback)
        state = redirectUrl.searchParams.get('state')
      })
    })
    it('get callback when user login successful', function (): void {
      (() => {
        mockState = state
        mockCode = faker.datatype.string()
      })()
    })
  })
  describe('github oidc backend channel', function () {
    describe('get access token by state and code', function () {
      it('invalid state will get a invalid state error', async function () {
        // mock incorrect state
        const invalidState = 'INVALID_STATE'
        return await expect(testDouble.getAccessToken('mockedCode', invalidState)).to.eventually.rejectedWith(AccessTokenError)
      })
      // it('invalid code will get ad invalid state error', async function () {
      //   const invalidCode = ''
      //   return await expect(testDouble.getAccessToken(invalidCode, 'STATE')).to.eventually.rejectedWith(OidcError)
      // })
      it('valid state and code will get access token', async function () {
        const stubValue = {
          access_token: faker.datatype.string(),
          scope: faker.datatype.string(),
          token_type: faker.datatype.string()
        }
        const requestPromise = sinon.stub(testDouble, 'requestPromise')
          .returns(
            Promise.resolve(JSON.stringify(stubValue))
          )
        return await testDouble.getAccessToken(mockCode, mockState).then((resp) => {
          expect(requestPromise.calledOnce)
          assert.equal(resp.type, 'accessToken')
          assert.equal(resp.result.access_token, stubValue.access_token)
          requestPromise.restore()
          return resp
        })
      })
    })
    describe('get user info by access token', function () {
      it('get user info by valid access token', async function () {
        const stubValue = {
          id: faker.datatype.string(),
          login: faker.datatype.string(),
          url: faker.datatype.string()
        }
        const requestPromise = sinon.stub(testDouble, 'requestPromise').returns(
          Promise.resolve(JSON.stringify(stubValue))
        )
        const req = {
          type: 'accessToken',
          result: {
            access_token: faker.datatype.string(),
            scope: faker.datatype.string(),
            token_type: faker.datatype.string()
          }
        } as const
        await testDouble.getUserInfo(req).then((resp) => {
          expect(requestPromise.calledOnce)
          assert.equal(resp.type, 'userInfo')
          assert.equal(resp.result.id, stubValue.id)
        })
      })
    })
  })
})
