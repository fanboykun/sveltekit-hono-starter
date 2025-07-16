/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Strict type for rpc response, make sure every rpc response follows this type
 */
export type RPCRes = { error: unknown } | { data: unknown };
export type RPCFn = (...args: any[]) => Promise<RPCRes>;
export type RPCOptions<T extends RPCFn> = {
	fn: T;
	keys: () => any[];
};
export type RpcResultData<T extends RPCFn> = Extract<
	Awaited<ReturnType<T>>,
	{ data: unknown }
>['data'];
export type RpcResultError<T extends RPCFn> = Extract<
	Awaited<ReturnType<T>>,
	{ error: unknown }
>['error'];
export type OverrideFn<T extends RPCFn> = (oldValue: RpcResultData<T>) => RpcResultData<T>;
export interface IRPCCaller<T extends RPCFn> {
	/**
	 * The status of the rpc caller
	 */
	readonly status: 'idle' | 'loading';
	/**
	 * The data of the rpc caller
	 */
	readonly data: RpcResultData<T> | null;
	/**
	 * The error of the rpc caller
	 */
	readonly error: RpcResultError<T> | null;
	/**
	 * Refresh the rpc caller, use this to invalidate the data in the component
	 */
	refresh: () => Promise<void>;
	/**
	 * Override the data of the rpc caller, usefull for optimistic update
	 */
	override: (fn: OverrideFn<T>) => void;
}
/**
 * Wrap the call function into a rpc caller to make it as a reactive data
 * The data fetched on the client/browser.
 * Make sure every rpc response follows the `RPCRes` type.
 * @example
 * ```svelte
 * 	const result = callRpc({
 *		keys: () => ['users', count],
 *		fn: async () => {
 *			const client = createRpcClient();
 *			const res = await client.api.users.$get({
 *				query: {
 *					name: 'User'
 *				}
 *			});
 *			const data = await res.json();
 *			return data;
 *		}
 *	});
 * ```
 */
export function callRpc<T extends RPCFn>(options: RPCOptions<T>): IRPCCaller<T> {
	return new RPCCaller(options);
}

export class RPCCaller<T extends RPCFn> implements IRPCCaller<T> {
	#status = $state<'idle' | 'loading'>('idle');
	#data = $state<RpcResultData<T> | null>(null);
	#error = $state<RpcResultError<T> | null>(null);
	constructor(private options: RPCOptions<T>) {
		$effect(() => {
			options.keys();
			this.refresh();
		});
	}
	async override(fn: OverrideFn<T>) {
		this.#data = fn(this.#data);
	}
	async refresh() {
		if (typeof window === 'undefined') throw new Error('RPCCaller can only be used in the browser');
		this.#status = 'loading';
		const result = await this.options.fn();
		if ('data' in result) {
			this.#data = result.data;
		} else {
			this.#error = result.error;
		}
		this.#status = 'idle';
	}
	get status() {
		return this.#status;
	}
	get data() {
		return this.#data;
	}
	get error() {
		return this.#error;
	}
}
