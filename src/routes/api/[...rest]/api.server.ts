import { Hono } from 'hono';
import { setUserMiddleware } from './middleware.server';
import { error } from '@sveltejs/kit';
import { users } from '$lib/users';
import { setCookie } from 'hono/cookie';
import { zValidator } from '@hono/zod-validator';
import z, { flattenError } from 'zod';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validate<T extends z.ZodType<any>>(data: z.input<T> | unknown, schema: T) {
	const validated = schema.safeParse(data);
	if (!validated.success) {
		const errors = flattenError(validated.error);
		return [false, errors.fieldErrors] as const;
	}
	return [true, validated.data] as const;
}
export const api = new Hono<Env>()
	.get('/', setUserMiddleware, (c) => {
		const user = c.var.user;
		if (!user) {
			return error(401, 'Unauthorized');
		}
		return c.json('oke');
	})
	.get('/login', (c) => {
		const user = users[Math.floor(Math.random() * users.length)];
		setCookie(c, 'session', user.id, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7
		});
		return c.json('oke');
	})
	.get('/logout', (c) => {
		setCookie(c, 'session', '', {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 0
		});
		return c.json('oke');
	})
	.get(
		'/users',
		setUserMiddleware,
		// zValidator(
		// 	'query',
		// 	z.object({
		// 		name: z
		// 			.string()
		// 			.min(1)
		// 			.transform((val) => (val ? val.toLowerCase().trim() : val))
		// 	}),
		// 	(result, c) => {
		// 		if (!result.success) {
		// 			return c.json(
		// 				result.error.issues.flatMap((issue) => `${issue.path.join('.')}: ${issue.message}`),
		// 				400
		// 			);
		// 		}
		// 	}
		// ),
		(c) => {
			const query = c.req.query();
			const [isValid, result] = validate(
				query,
				z.object({
					name: z
						.string()
						.min(1)
						.transform((val) => (val ? val.toLowerCase().trim() : val))
				})
			);
			if (!isValid) {
				return c.json({ error: result }, 400);
			}
			const filteredUsers = users.filter((user) =>
				result.name ? user.name.toLowerCase().includes(result.name.toLowerCase()) : true
			);
			return c.json({ data: filteredUsers });
		}
	)
	.post(
		'/users',
		setUserMiddleware,
		zValidator(
			'json',
			z.object({
				id: z.uuid(),
				name: z.string()
			}),
			(result, c) => {
				if (!result.success) {
					return c.json(result.error, 400);
				}
			}
		),
		(c) => {
			const user = c.var.user;
			if (!user) {
				return error(401, 'Unauthorized');
			}
			const userValidated = c.req.valid('json');
			users.push(userValidated);
			return c.json('oke');
		}
	);
