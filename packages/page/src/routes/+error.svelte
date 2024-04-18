<script>
	import { page } from '$app/stores'
</script>

<div class="error-wrapper">
	<h1>{$page.status}</h1>
	<h3>{$page.error?.message}</h3>
</div>

<style>
	.error-wrapper {
		flex: 1;
		display: flex;
		padding: 5em;
		flex-direction: column;
		align-items: center;
	}
</style>
