<script lang="ts">
	import type { PageData } from './$types'
	import { onMount } from 'svelte'
	import { userInfoApi } from '../../config/api'

	export let data: PageData

	let output = {}
	onMount(async () => {
		if (data.state && data.code) {
			const uRLSearchParams = new URLSearchParams()
			uRLSearchParams.append('state', data.state)
			uRLSearchParams.append('code', data.code)
			const resp = await fetch(`${userInfoApi}?${uRLSearchParams}`)
			output = await resp.json()
		}
	})

	let copyText = 'Copy to Clipboard'
	let copyToClipboard = () => {
		navigator.clipboard.writeText(JSON.stringify(output, null, 2))
		copyText = 'copied!'
	}
</script>

<div>
	<h1>UserInfo</h1>
	<button class="copy-btn" on:click={copyToClipboard}>
		<span>{copyText}</span>
	</button>
	<pre>{JSON.stringify(output, null, 2)}</pre>
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
