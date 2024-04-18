<script lang="ts">
	import { onMount } from 'svelte'
	import type { PageData } from './$types'
	import { userInfoApi } from '../../config/api'
	import { error } from '@sveltejs/kit'

	export let data: PageData
	let platformIcon: string
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
		platformIcon = (sessionStorage.getItem('platform') || 'wechat') + '.svg'
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

<div>
	<img alt="github" title="github" src={platformIcon} width="70em" />
	<pre>{userInfo}</pre>
	<button class="copy-btn" on:click={copyToClipboard}>
		<span>{copyText}</span>
	</button>
</div>

<style>
	div {
		flex: 1;
		display: flex;
		row-gap: 0.5em;
		font-size: 1.2rem;
		flex-direction: column;
		padding: 5em;
		align-items: center;
	}
	.copy-btn {
		border: outset;
	}
	.copy-btn:active {
		border: inset;
	}
</style>
