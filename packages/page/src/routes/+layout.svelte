<script lang="ts">
	import Head from '../components/Head.svelte'
	import Foot from '../components/Foot.svelte'
	import type { LayoutData } from './user-info/$types'
	export let data: LayoutData
</script>

<div id="main-wrapper">
	<Head />

	<slot />
	<Foot />
</div>

<style>
	:global(html),
	:global(body) {
		height: 100%;
		margin: 0;
		padding: 0;
	}

	#main-wrapper {
		display: flex;
		flex-direction: column;
		min-height: 100%;
	}
	:root {
		--main-border-radius: 0.3em;
	}
</style>
