import 'server-only'

import type {QueryParams} from 'next-sanity'

import {client} from './client'

type SanityFetchOptions<Q extends string> = {
  query: Q
  params?: QueryParams
  /** Seconds. Ignored when `tags` is set — tagged queries revalidate on webhook. */
  revalidate?: number | false
  tags?: string[]
  /**
   * Bypass the Sanity CDN. Use `false` in `generateStaticParams` and anywhere
   * a stale read would bake into the build.
   */
  useCdn?: boolean
}

/**
 * The single read path for Sanity content.
 *
 * `defineLive` is deliberately not used: it needs a browser token to stream
 * updates, and no token may reach the browser on a private dataset.
 */
export async function sanityFetch<const Q extends string>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
  useCdn,
}: SanityFetchOptions<Q>) {
  const readClient = useCdn === undefined ? client : client.withConfig({useCdn})

  return readClient.fetch(query, params, {
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  })
}
