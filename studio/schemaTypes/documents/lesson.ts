import {defineArrayMember, defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons'

/**
 * A lesson does not store its parent course. Courses reference lessons through
 * their modules, and the course is derived with a reverse reference in GROQ.
 */
/**
 * Playback happens through the provider's own embed on the lesson page, so a
 * lesson may only point at a provider we can both ingest and play.
 * See AGENTS.md section 9.
 */
const SUPPORTED_VIDEO_HOSTS = [
  'youtube.com',
  'youtu.be',
  'youtube-nocookie.com',
  'vimeo.com',
  'player.vimeo.com',
  'b-cdn.net',
  'mediadelivery.net',
]

export const lesson = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  icon: PlayIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'video', title: 'Video'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description: 'One or two sentences shown under the lesson title.',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      description: 'A YouTube, Vimeo, or Bunny URL. Playback stays on this site.',
      type: 'url',
      group: 'video',
      validation: (rule) =>
        rule
          .required()
          .uri({scheme: ['http', 'https']})
          .custom((value) => {
            if (typeof value !== 'string') return true
            let host: string
            try {
              host = new URL(value).hostname.replace(/^www\./, '').toLowerCase()
            } catch {
              return 'Must be a valid URL starting with http:// or https://'
            }
            const supported = SUPPORTED_VIDEO_HOSTS.some(
              (allowed) => host === allowed || host.endsWith(`.${allowed}`),
            )
            return supported
              ? true
              : 'Playback stays on this site, so the URL must be YouTube, Vimeo, or Bunny.'
          }),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Poster image',
      type: 'image',
      group: 'video',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      description: 'Stored in seconds. Formatted for display in the frontend.',
      type: 'number',
      group: 'video',
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: 'freePreview',
      title: 'Free preview',
      description: 'A label only. It does not grant or restrict access.',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Student count',
      description: 'Display only. Not derived from real enrolment.',
      type: 'number',
      group: 'content',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({type: 'image', options: {hotspot: true}}),
      ],
    }),
    defineField({
      name: 'keyPoints',
      title: 'Key points',
      description: 'The "In this lesson you will" list.',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'proTip',
      title: 'Pro tip',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'resources',
      title: 'Resources',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'resource'})],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'summary', media: 'thumbnail'},
  },
})
