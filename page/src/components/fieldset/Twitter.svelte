<script lang="ts">
	import { page } from '$app/stores'
</script>

<fieldset>
	<legend><img alt="twitter" title="twitter" src="twitter.svg" width="96em" /></legend>
	<p><label>clientId:<input type="text" name="clientId" required /></label></p>
	<p>
		<label
			>callback:<input
				type="url"
				name="callback"
				value="{$page.url.origin}/user-info"
				required
			/></label
		>
	</p>
	<p><input type="submit" value="submit" /></p>
</fieldset>

<style>
	@import '../../../styles/components/fieldset.css';
</style>
