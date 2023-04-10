import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load = (({ url }) => {
	return { url: url.origin + url.pathname }
}) satisfies PageLoad
