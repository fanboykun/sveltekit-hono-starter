export const users: User[] = Array.from({ length: 100 }).map((_, i) => ({
	id: crypto.randomUUID() as string,
	name: `User ${i}`
}));
export interface User {
	id: string;
	name: string;
}
