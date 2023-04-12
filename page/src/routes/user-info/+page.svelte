<script lang="ts">
	import type { PageData } from './$types'
	import { userInfoApi } from '../../config/api'

	export let data: PageData
	let fetchUserInfo = (async () => {
		if (data.state && data.code) {
			const uRLSearchParams = new URLSearchParams()
			uRLSearchParams.append('state', data.state)
			uRLSearchParams.append('code', data.code)
			const resp = await fetch(`${userInfoApi}?${uRLSearchParams}`)
			let result = await resp.json()
			return result
		}
	})()
	let copyText = 'Copy to Clipboard'
	let copyToClipboard = () => {
		navigator.clipboard.writeText(JSON.stringify('', null, 2))
		copyText = 'copied!'
	}
</script>

{@debug fetchUserInfo}

<div>
	<h1>UserInfo</h1>
	{#await fetchUserInfo}
		<p>loading...</p>
	{:then userInfo}
		<button class="copy-btn" on:click={copyToClipboard}>
			<span>{copyText}</span>
		</button>
		<pre>{JSON.stringify(userInfo, null, 2)}</pre>
	{:catch error}
		<p>{error}</p>
	{/await}
</div>

<style>
	div {
		display: flex;
		font-size: 1.5em;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.copy-btn {
		border: outset;
	}
	.copy-btn:active {
		border: inset;
	}
</style>
