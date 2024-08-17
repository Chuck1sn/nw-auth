import { describe, it } from 'mocha'
import { faker } from '@faker-js/faker'
import { AccessTokenError } from '../error/error'
import sinon from 'sinon'
import chai from 'chai'
// Load chai assertions
import chaiAsPromised from 'chai-as-promised'
import { TwitterOidc } from '../service/twitter'
const expect = chai.expect
const assert = chai.assert
// Load chai-as-promised support
chai.use(chaiAsPromised)

describe('twitter oidc flow', function () {
	const callback = 'http://localhost/callback'
	const testDouble = new TwitterOidc('clientId', callback)
	let mockState
	let mockCode
	describe('twitter oidc front channel', function () {
		let redirectUrl
		let state
		it('redirect user to twitter login page', async function () {
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
	describe('twitter oidc backend channel', function () {
		const mockAccessTokenResp = {
			access_token: faker.datatype.string(),
			token_type: 'bearer'
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
					id: faker.datatype.string(),
					name: faker.datatype.string(),
					username: faker.datatype.boolean()
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
					assert.equal(resp.result.data.id, stubValue.id)
				})
			})
		})
	})
})
