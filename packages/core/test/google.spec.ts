import { GoogleOidc } from '../service/google'
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

describe('google oidc flow', function () {
	const callback = 'http://localhost/callback'
	const testDouble = new GoogleOidc('clientId', 'clientSecret', callback)
	let mockState
	let mockCode
	describe('google oidc front channel', function () {
		let redirectUrl
		let state
		it('redirect user to google login page', async function () {
			await testDouble.redirectLogin().then((resp) => {
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
	describe('google oidc backend channel', function () {
		const mockAccessTokenResp = {
			access_token: faker.datatype.string(),
			expires_in: faker.datatype.number(), // seconds -> 3920
			refresh_token: faker.datatype.string(),
			scope: 'https://www.googleapis.com/auth/userinfo.profile',
			token_type: 'Bearer',
			id_token: faker.datatype.string()
		} as const
		describe('get access token by state and code', function () {
			it('invalid state will get a invalid state error', async function () {
				// mock incorrect state
				const invalidState = 'INVALID_STATE'
				return await expect(
					testDouble.getAccessToken(mockCode, invalidState)
				).to.eventually.rejectedWith(AccessTokenError)
			})
			// it('invalid code will get a invalid code error', async function () {
			//   const invalidCode = ''
			//   return await expect(testDouble.getAccessToken(invalidCode, mockState)).to.eventually.rejectedWith(OidcError)
			// })
			it('valid state and code will get access token', async function () {
				const requestPromise = sinon
					.stub(testDouble, 'requestPromise')
					.returns(Promise.resolve(JSON.stringify(mockAccessTokenResp)))
				await testDouble.getAccessToken(mockCode, mockState).then((resp) => {
					expect(requestPromise.calledOnce)
					assert.equal(resp.type, 'accessToken')
					assert.equal(resp.result.access_token, mockAccessTokenResp.access_token)
					requestPromise.restore()
				})
			})
		})
		describe('get user info by access token', function () {
			it('get user info by valid access token', async function () {
				const stubValue = {
					sub: faker.datatype.string(),
					email: faker.datatype.string(),
					verified_email: faker.datatype.boolean(),
					picture: faker.internet.url()
				}
				const requestPromise = sinon
					.stub(testDouble, 'requestPromise')
					.returns(Promise.resolve(JSON.stringify(stubValue)))
				const req = {
					type: 'accessToken',
					result: mockAccessTokenResp
				} as const
				await testDouble.getUserInfo(req).then((resp) => {
					expect(requestPromise.calledOnce)
					assert.equal(resp.type, 'userInfo')
					assert.equal(resp.result.sub, stubValue.sub)
				})
			})
		})
	})
})
