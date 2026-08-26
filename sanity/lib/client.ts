import 'server-only'

import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId} from '../env'

/**
 * Read-only Sanity client. The dataset is private, so every read carries a
 * server-only token. `server-only` turns an accidental client-component import
 * into a build error rather than a leaked credential.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  token: process.env.SANITY_API_READ_TOKEN,
})
