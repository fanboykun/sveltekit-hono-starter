import type { RequestEvent } from '@sveltejs/kit';
import { app } from './handler.server';

export const GET = ({ request }: RequestEvent) => app.fetch(request);
export const POST = ({ request }: RequestEvent) => app.fetch(request);
