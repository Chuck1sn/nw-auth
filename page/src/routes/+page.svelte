<h1>Platform Server Info</h1>
<form action="" method="post">
	<p>
		<select name="pets" id="pet-select">
			<option value="">--Please choose an option--</option>
			<option value="dog">Dog</option>
			<option value="cat">Cat</option>
			<option value="hamster">Hamster</option>
			<option value="parrot">Parrot</option>
			<option value="spider">Spider</option>
			<option value="goldfish">Goldfish</option>
		</select>
	</p>
	<fieldset>
		<legend>Oidc Info</legend>
		<p><label>appId:<input type="text" name="appId" required /></label></p>
		<p><label>appSecret:<input type="text" name="appSecret" required /></label></p>
		<p><label>appTicket:<input type="text" name="appTicket" required /></label></p>
		<p><label>callback:<input type="url" name="callback" required /></label></p>
		<p><input type="submit" value="submit" /></p>
	</fieldset>
</form>
