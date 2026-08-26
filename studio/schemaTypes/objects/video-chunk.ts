import {defineField, defineType} from 'sanity'
import {TextIcon} from '@sanity/icons'

/**
 * One short, timestamped slice of a video's transcript.
 * Chunks are deliberately small so a filtered query returns a few matches
 * instead of a whole transcript. Never project the full array in the request
 * path.
 */
export const videoChunk = defineType({
  name: 'videoChunk',
  title: 'Transcript chunk',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'startSeconds',
      title: 'Start (seconds)',
      type: 'number',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'text', subtitle: 'startSeconds'},
  },
})
