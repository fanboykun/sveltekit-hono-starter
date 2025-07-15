import { Hono } from 'hono';
import { api } from './api.server';

export const app = new Hono<Env>().route('/api', api);
export type App = typeof app;
