<form action="" method="post">
	<h1>Platform Server Info</h1>
	<p>
		<select name="pets" id="pet-select">
			<option value="">Choose a platform </option>
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

<style>
	form {
		display: flex;
		font-size: 1.5em;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
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
	select {
		appearance: none;
		font-size: 1em;
		padding: 0.5em;
		background-color: #eee;
		border: none;
		border-radius: 0.25em;
		box-shadow: inset 0 0 0.5em rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}
	select::-ms-expand {
		display: none;
	}
	select option {
		background-color: white;
	}
	fieldset {
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
	}
</style>
