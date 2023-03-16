<script>
	let data = {
		name: 'John Doe',
		age: 30,
		city: 'New York'
	}
	let copyText = 'Copy to Clipboard'
	let copyToClipboard = () => {
		let jsonData = JSON.stringify(data, null, 2)
		navigator.clipboard.writeText(jsonData)
		copyText = 'copied!'
	}
</script>

<div>
	<h1>UserInfo</h1>
	<button class="copy-btn" on:click={copyToClipboard}>
		<span>{copyText}</span>
	</button>
	<pre>{JSON.stringify(data, null, 2)}</pre>
</div>

<style>
	div {
		display: flex;
		font-size: 1.5em;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.copy-btn {
		border: outset;
	}
	.copy-btn:active {
		border: inset;
	}
</style>
