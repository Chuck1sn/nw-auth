<script lang="ts">
	import { page } from '$app/stores'
</script>

<fieldset>
	<legend><img alt="github" title="github" src="github.svg" width="96em" /></legend>
	<p><label>clientId:<input type="text" name="clientId" required /></label></p>
	<p><label>clientSecret:<input type="text" name="clientSecret" required /></label></p>
	<p><label>appName:<input type="text" name="appName" required /></label></p>
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
