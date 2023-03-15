<fieldset>
	<legend>Oidc Info</legend>
	<p><label>clientId:<input type="text" name="clientId" required /></label></p>
	<p><label>clientSecret:<input type="text" name="clientSecret" required /></label></p>
	<p><label>appName:<input type="text" name="appName" required /></label></p>
	<p><label>callback:<input type="url" name="callback" required /></label></p>
	<p><input type="submit" value="submit" /></p>
</fieldset>

<style>
	input {
		font-size: 1em;
		margin-left: 0.5em;
	}
	input[type='submit'] {
		background-color: rgb(123, 122, 122);
		color: white;
		border: outset;
		cursor: pointer;
		margin-left: 0em;
	}
	input[type='submit']:hover {
		background-color: rgb(150, 149, 149);
	}
	fieldset {
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
	}
</style>
