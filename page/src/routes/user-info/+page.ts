import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load = (async ({ url }) => {
	const code = url.searchParams.get('code')
	const state = url.searchParams.get('state')
	if (!(state && code)) {
		throw error(500, {
      message: 'invalid search params'
    });
	}
	return { origin:url.origin,code,state } 
}) satisfies PageLoad
