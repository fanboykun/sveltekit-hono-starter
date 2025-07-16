import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth-middleware';
import { validator } from 'hono/validator';
import z, { flattenError } from 'zod';
import { error } from '@sveltejs/kit';

export const users: User[] = Array.from({ length: 100 }).map((_, i) => ({
	id: crypto.randomUUID() as string,
	name: `User ${i}`,
	createdAt: new Date()
}));
export interface User {
	id: string;
	name: string;
	createdAt: Date;
}

export const userProcedure = new Hono<Env>()
	.get(
		'/users',
		authMiddleware,
		validator('query', (query, c) => {
			const result = z
				.object({
					name: z
						.string()
						.optional()
						.transform((val) => (val ? val.toLowerCase().trim() : val))
				})
				.safeParse(query);
			if (!result.success) {
				return c.json({ error: flattenError(result.error).fieldErrors }, 400);
			}
			return result.data;
		}),
		async (c) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return c.json({ data: users });
		}
	)
	.post(
		'/users',
		authMiddleware,
		validator('json', (value, c) => {
			const validationResult = z
				.object({
					id: z.uuid(),
					name: z.string()
				})
				.safeParse(value);
			if (!validationResult.success) {
				return c.json({ error: flattenError(validationResult.error).fieldErrors }, 400);
			}
			return validationResult.data;
		}),
		(c) => {
			const user = c.var.user;
			if (!user) {
				return error(401, 'Unauthorized');
			}
			const userValidated = c.req.valid('json');
			users.push({ ...userValidated, createdAt: new Date() });
			return c.json('oke');
		}
	);
