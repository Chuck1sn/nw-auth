<script lang="ts">
	import { page } from '$app/stores'
</script>

<fieldset>
	<legend><img alt="wechat" title="wechat" src="wechat.svg" width="96em" /></legend>
	<p><label>appId:<input type="text" name="appId" required /></label></p>
	<p><label>appSecret:<input type="text" name="appSecret" required /></label></p>
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
