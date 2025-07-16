import { userProcedure } from '$lib/server/procedure/user-procedure';
import type { RequestEvent } from '@sveltejs/kit';
import { Hono } from 'hono';
import { logger } from 'hono/logger';

const app = new Hono<Env>().use(logger()).route('/api', userProcedure);

export const GET = ({ request }: RequestEvent) => app.fetch(request);
export const POST = ({ request }: RequestEvent) => app.fetch(request);

export type App = typeof app;
