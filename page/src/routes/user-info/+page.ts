import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load = (({ params, url }) => {
	const code = url.searchParams.get('code')
	const state = url.searchParams.get('state')
	const callback = `${url.host}/user-info`
	return { code, state, callback }
}) satisfies PageLoad
