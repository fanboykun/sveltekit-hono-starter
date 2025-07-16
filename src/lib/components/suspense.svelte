<script lang="ts" generics="T extends RPCFn">
	import type { callRpc, RPCFn } from '$lib/global/rpc/call-rpc.svelte';
	import type { Snippet } from 'svelte';
	interface Props {
		data: ReturnType<typeof callRpc<T>>;
		children: Snippet<[{ data: ReturnType<typeof callRpc<T>>['data'] }]>;
		error?: Snippet<[{ error: ReturnType<typeof callRpc<T>>['error'] }]>;
		loading?: Snippet<[]>;
	}
	let { data, children, error, loading }: Props = $props();
</script>

{#if data.status === 'idle'}
	{#if data.error}
		{@render error?.({ error: data.error })}
	{:else}
		{@render children?.({ data: data.data })}
	{/if}
{:else if data.status === 'loading'}
	{@render loading?.()}
{/if}
