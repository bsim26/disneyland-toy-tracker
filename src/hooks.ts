import { deLocalizeUrl } from '$lib/paraglide/runtime';

export const reroute = (request) => deLocalizeUrl(request.url).pathname;

// Required for SvelteKit client-side navigation
export const transport = undefined;
