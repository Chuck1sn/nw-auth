<script lang="ts">
	import { page } from '$app/stores'
</script>

<fieldset>
	<legend><img alt="github" title="github" src="github.svg" width="96em" /></legend>
	<label>clientId:<input type="text" name="clientId" required /></label>
	<label>clientSecret:<input type="text" name="clientSecret" required /></label>
	<label>appName:<input type="text" name="appName" required /></label>
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
