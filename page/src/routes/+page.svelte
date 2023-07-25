<script lang="ts">
	import Wechat from '../components/fieldset/Wechat.svelte'
	import Github from '../components/fieldset/Github.svelte'
	import Sina from '../components/fieldset/Sina.svelte'
	import Google from '../components/fieldset/Google.svelte'
	import Feishu from '../components/fieldset/Feishu.svelte'
	import Twitter from '../components/fieldset/Twitter.svelte'
	import { authApi } from '../config/api'

	let platforms = ['wechat', 'feishu', 'github', 'sina', 'google', 'twitter']
	let selected = 'wechat'
</script>

<form action={authApi} method="post" enctype="application/x-www-form-urlencoded">
	<h1>Platform Server Info</h1>
	<select name="platform" bind:value={selected}>
		{#each platforms as platform}
			<option value={platform}>{platform}</option>
		{/each}
	</select>
	{#if selected === 'wechat'}
		<Wechat />
	{:else if selected === 'github'}
		<Github />
	{:else if selected === 'sina'}
		<Sina />
	{:else if selected === 'google'}
		<Google />
	{:else if selected === 'feishu'}
		<Feishu />
	{:else if selected === 'twitter'}
		<Twitter />
	{:else}
		<Wechat />
	{/if}
</form>

<style>
	:global(body * + *) {
		margin-top: 2rem;
	}
	form {
		font-size: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	form > h1 {
		margin-bottom: 0;
	}
	select {
		font-size: 1.5rem;
		border: solid black;
		text-align: center;
		cursor: pointer;
	}
</style>
