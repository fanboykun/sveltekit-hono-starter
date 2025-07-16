# Sveltekit - Hono StarterKit

A modern starter kit that combines SvelteKit with Hono, featuring a robust RPC client API interface that wraps RPC responses as state.

## Features

- 🚀 **SvelteKit Integration**: Built on top of SvelteKit for modern, performant web applications
- 🌐 **Hono Backend**: Utilizes Hono framework for fast and efficient server-side logic
- 🔄 **Stateful RPC**: Advanced RPC client implementation that wraps responses as state
- 🛠️ **TypeScript Support**: Full TypeScript integration for type safety

## Project Structure

```
src/
├── app.d.ts         # TypeScript declarations
├── lib/
│   ├── components/  # Reusable Svelte components
│   │   └── suspense.svelte  # Suspense component for RPC state management
│   ├── global/      # Global utilities and configurations
│   │   └── rpc/     # RPC client implementation
│   │       └── call-rpc.svelte  # RPC client implementation that wraps RPC responses as state
│   │       └── create-rpc-client.ts  # RPC client factory
│   └── server/      # Server-side implementation
│       ├── middleware/  # Hono middleware
│       └── procedure/   # RPC procedures
├── routes/          # SvelteKit routes
└── static/          # Static assets
```

## RPC Client API

The project includes a powerful RPC client implementation that:

1. Wraps RPC responses as state
2. Provides type-safe interfaces
3. Handles error states and loading states automatically
4. Supports both synchronous and asynchronous operations

### Suspense Component Integration

The project includes a custom `Suspense` component that seamlessly integrates with the RPC client to handle loading, error, and data states. The component:

- Automatically manages loading states with customizable loading indicators
- Handles error states with user-defined error UI
- Renders data when available
- Provides type-safe integration with RPC callers

Example usage:

```svelte
<script lang="ts">
	import { callRpc } from '$lib/global/rpc/call-rpc.svelte';
	import Suspense from '$lib/components/suspense.svelte';

	const result = callRpc({
		keys: () => ['users'],
		fn: async () => {
			// Your RPC call implementation
		}
	});
</script>

<Suspense data={result}>
	{#snippet error()}
		<div>Error occurred: {error.message}</div>
	{/snippet}
	{#snippet loading()}
		<div>Loading...</div>
	{/snippet}
	{#snippet children(data)}
		<div>Success: {data}</div>
	{/snippet}
</Suspense>
```

## Getting Started

1. Use as Template and Clone your repository
2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```
3. Start the development server:
   ```bash
   bun run dev
   # or
   npm run dev
   ```

## Development

The project is set up with modern development tools:

- TypeScript for type safety
- Prettier for code formatting
- ESLint for code linting
- Vite for fast development server

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
