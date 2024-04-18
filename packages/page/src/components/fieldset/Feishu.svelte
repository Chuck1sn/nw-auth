<script lang="ts">
	import { page } from '$app/stores'
</script>

<fieldset>
	<legend><img alt="feishu" src="feishu.svg" width="50em" /></legend>
	<label>appId:<input type="text" name="appId" required /></label>
	<label>appSecret:<input type="text" name="appSecret" required /></label>
	<label>appTicket:<input type="text" name="appTicket" required /></label>
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
