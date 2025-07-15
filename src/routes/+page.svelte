<script lang="ts">
	import { hc } from 'hono/client';
	import type { App } from './api/[...rest]/handler.server';
	import { setContext, untrack } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	const cacheMap = new SvelteMap<any, { lastUpdated: number; data: unknown }>();
	setContext('rpc-cache', cacheMap);
	const client = hc<App>('http://localhost:5173/');
	async function getUsers() {
		const res = await client.api.users.$get({
			query: {
				name: 'User'
			}
		});
		const data = await res.json();
		return data;
	}
	type RPCRes = { error: unknown } | { data: unknown };
	type RPCFn = (...args: any[]) => Promise<RPCRes>;
	type RPCOptions<T extends RPCFn, Keys extends () => any[]> = {
		fn: T;
		keys: Keys;
		cacheLifetime?: number;
	};
	function RPC<T extends RPCFn, Keys extends () => any[]>(options: RPCOptions<T, Keys>) {
		const keys = $derived(options.keys());
		const cacheLifetime = options.cacheLifetime ?? 60 * 60 * 10; // 10 minutes
		let status = $state<'idle' | 'loading'>('idle');
		let value = $state<Extract<Awaited<ReturnType<T>>, { data: unknown }>['data']>();
		let error = $state<Extract<Awaited<ReturnType<T>>, { error: unknown }>['error']>();
		const getFromCache = () => {
			return untrack(() => {
				const cache = cacheMap.get($state.snapshot(keys));
				if (cache) {
					const isStale = Date.now() - cache.lastUpdated > cacheLifetime;
					if (!isStale) {
						value = cache.data;
						return true;
					}
				}
				return false;
			});
		};
		const refresh = async () => {
			const cached = getFromCache();
			if (cached) return;
			status = 'loading';
			options
				.fn()
				.then((data) => {
					if ('data' in data) {
						value = data.data;
						untrack(() => {
							cacheMap.set($state.snapshot(keys), { lastUpdated: Date.now(), data: data.data });
						});
					} else {
						error = data.error;
					}
				})
				.catch((error) => {
					console.info(error);
				})
				.finally(() => {
					status = 'idle';
				});
		};

		$effect(() => {
			options.keys();
			refresh();
		});
		const override = (fn: (oldValue: typeof value) => typeof value) => {
			value = fn(value);
		};
		return {
			get value() {
				return value;
			},
			get error() {
				return error;
			},
			get status() {
				return status;
			},
			refresh,
			override
		};
	}
	let count = $state(0);
	const data = RPC({ fn: getUsers, keys: () => ['users', count] });
	$inspect(data.status);
	setInterval(() => {
		// count++;
		data.refresh();
	}, 1000);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
