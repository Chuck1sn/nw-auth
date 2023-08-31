<script lang="ts">
	import { page } from '$app/stores'
</script>

<fieldset>
	<legend><img alt="twitter" title="twitter" src="twitter.svg" width="96em" /></legend>
	<label>clientId:<input type="text" name="clientId" required /></label>
	<label
		>callback:<input
			type="url"
			name="callback"
			value="{$page.url.origin}/user-info"
			required
		/></label
	>
	<input type="submit" value="submit" />
</fieldset>

<style>
	@import '../../../styles/components/fieldset.css';
</style>
