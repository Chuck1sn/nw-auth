<script lang="ts">
	import { page } from '$app/stores'
</script>

<fieldset>
	<legend><img alt="wechat" title="wechat" src="wechat.svg" width="96em" /></legend>
	<label>appId:<input type="text" name="appId" required /></label>
	<label>appSecret:<input type="text" name="appSecret" required /></label>

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
