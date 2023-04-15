<script lang="ts">
	import { onMount } from 'svelte'
	import type { PageData } from './$types'
	import { userInfoApi } from '../../config/api'
	import { error } from '@sveltejs/kit'

	export let data: PageData
	let userInfo = 'loading...'
	let copyText = 'Copy to Clipboard'
	let copyToClipboard = () => {
		navigator.clipboard.writeText(userInfo)
		copyText = 'copied!'
	}
	onMount(async () => {
		const uRLSearchParams = new URLSearchParams()
		uRLSearchParams.append('state', data.state)
		uRLSearchParams.append('code', data.code)
		try {
			const resp = await fetch(`${userInfoApi}?${uRLSearchParams}`, {
				headers: {
					origin: data.origin
				}
			})
			const userInfoJson = await resp.json()
			userInfo = JSON.stringify(userInfoJson, null, 2)
		} catch (err) {
			console.error(err)
			userInfo = 'fetch userInfo failed!'
			throw error(500, { message: 'fetch userInfo failed!' })
		}
	})
</script>

{@debug userInfo}

<div>
	<h1>UserInfo</h1>
	<button class="copy-btn" on:click={copyToClipboard}>
		<span>{copyText}</span>
	</button>
	<pre>{userInfo}</pre>
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
