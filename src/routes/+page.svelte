<script lang="ts">
	import { page } from '$app/state';
	import Suspense from '$lib/components/suspense.svelte';
	import { callRpc } from '$lib/global/rpc/call-rpc.svelte';
	import { createRpcClient } from '$lib/global/rpc/create-rpc-client';

	/**
	 * Wrap the call function into a rpc caller to make it as a reactive data
	 * The data fetched on the client/browser
	 */
	const result = callRpc({
		keys: () => ['users'],
		fn: async () => {
			const client = createRpcClient();
			const res = await client.api.users.$get({
				query: {
					name: page.url.searchParams.get('name') || ''
				}
			});
			const data = await res.json();
			return data;
		}
	});
</script>

<h1>Welcome to SvelteKit + Hono</h1>
<p>
	This is a template/starterkit to work with sveltekit and Hono as the backend. It provides a
	stateful rpc client.
</p>
<Suspense data={result}>
	{#snippet error()}
		<div>Error</div>
	{/snippet}
	{#snippet children({ data })}
		{#if data?.length}
			<div>Data Here</div>
		{/if}
	{/snippet}
	{#snippet loading()}
		<div>Loading...</div>
	{/snippet}
</Suspense>
