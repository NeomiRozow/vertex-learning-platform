import {defineField, defineType} from 'sanity'
import {BookmarkIcon} from '@sanity/icons'

/**
 * One entry in a video's table of contents.
 * Chapter labels are clean authored text, so search matches these before it
 * falls back to the noisier transcript chunks.
 */
export const videoChapter = defineType({
  name: 'videoChapter',
  title: 'Chapter',
  type: 'object',
  icon: BookmarkIcon,
  fields: [
    defineField({
      name: 'startSeconds',
      title: 'Start (seconds)',
      type: 'number',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'startSeconds'},
    prepare: ({title, subtitle}) => ({
      title,
      subtitle: typeof subtitle === 'number' ? formatTimestamp(subtitle) : undefined,
    }),
  },
})

function formatTimestamp(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
