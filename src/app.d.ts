// See https://svelte.dev/docs/kit/types#app.d.ts

import type { User } from '$lib/users';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	interface Env {
		Variables: {
			user: User | null;
		};
	}
}

export {};
