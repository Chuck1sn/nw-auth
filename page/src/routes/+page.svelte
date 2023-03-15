<script>
	import Wechat from '../components/fieldset/Wechat.svelte'
	import Github from '../components/fieldset/Github.svelte'
	import Sina from '../components/fieldset/Sina.svelte'
	import Google from '../components/fieldset/Google.svelte'
	import Feishu from '../components/fieldset/Feishu.svelte'

	let platforms = ['wechat', 'feishu', 'github', 'sina', 'google']
	let selected = 'wechat'
</script>

<form action="" method="post">
	<h1>Platform Server Info</h1>
	<p>
		<select name="platform" bind:value={selected}>
			{#each platforms as platform}
				<option value={platform}>{platform}</option>
			{/each}
		</select>
	</p>
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
	{:else}
		<Wechat />
	{/if}
</form>

<style>
	form {
		display: flex;
		font-size: 1.5em;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	select {
		appearance: none;
		font-size: 1em;
		padding: 0.5em;
		background-color: #eee;
		border: none;
		border-radius: 0.25em;
		box-shadow: inset 0 0 0.5em rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}
	select::-ms-expand {
		display: none;
	}
</style>
