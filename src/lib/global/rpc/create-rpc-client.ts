import { hc, type ClientRequestOptions } from 'hono/client';
import type { App } from '../../../routes/api/[...rest]/+server';

export function createRpcClient(
	basePath: string = 'http://localhost:5173/',
	options?: ClientRequestOptions
) {
	return hc<App>(basePath, options);
}
