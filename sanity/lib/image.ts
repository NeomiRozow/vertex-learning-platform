import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'

import {dataset, projectId} from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({projectId, dataset})

/** Chainable builder: `urlFor(image).width(640).url()`. */
export const urlFor = (source: SanityImageSource) => builder.image(source)
