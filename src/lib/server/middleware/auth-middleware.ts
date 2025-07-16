import { users } from '$lib/users';
import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
export const authMiddleware = createMiddleware<Env>(async (c, next) => {
	const sessionCookie = getCookie(c, 'session');
	if (!sessionCookie) {
		c.set('user', null);
		await next();
		return;
	}
	const user = users.find((user) => user.id === sessionCookie);
	if (!user) {
		c.set('user', null);
		await next();
	} else {
		c.set('user', user);
		await next();
	}
});
