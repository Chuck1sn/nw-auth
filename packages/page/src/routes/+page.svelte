<script lang="ts">
	import Wechat from '../components/fieldset/Wechat.svelte'
	import Github from '../components/fieldset/Github.svelte'
	import Sina from '../components/fieldset/Sina.svelte'
	import Google from '../components/fieldset/Google.svelte'
	import Feishu from '../components/fieldset/Feishu.svelte'
	import Twitter from '../components/fieldset/Twitter.svelte'
	import { authApi } from '../config/api'
	import { afterUpdate } from 'svelte'

	let platforms = ['wechat', 'feishu', 'github', 'sina', 'google', 'twitter']
	let selected = 'wechat'
	afterUpdate(() => {
		$: {
			sessionStorage.setItem('platform', selected)
		}
	})
</script>

<form action={authApi} method="post" enctype="application/x-www-form-urlencoded">
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
	form {
		flex: 1;
		font-size: 1.2rem;
		padding: 5em;
		display: flex;
		row-gap: 0.5em;
		flex-direction: column;
		align-items: center;
	}
	select {
		padding: 0.2em;
		font-size: inherit;
		border: solid black;
		border-radius: var(--main-border-radius);
		text-align: center;
		cursor: pointer;
	}
	select:focus {
		outline: none;
	}
</style>
