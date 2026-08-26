import {defineArrayMember, defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons'

/**
 * Video intelligence for one unique video URL, built by the offline ingestion
 * pipeline (`scripts/ingest-videos.ts`). One document per unique URL, keyed by
 * an id derived from the provider's video id.
 *
 * This is an internal lookup. It is never shown to a learner as a search
 * result: a video match is always surfaced through the lesson that uses it.
 * Lessons link here by `url`, matching `lesson.videoUrl`, not by reference.
 */
export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  icon: PlayIcon,
  groups: [
    {name: 'source', title: 'Source', default: true},
    {name: 'intelligence', title: 'Chapters and transcript'},
  ],
  fields: [
    defineField({
      name: 'videoId',
      title: 'Video ID',
      description: "The provider's own id, for example a YouTube watch id.",
      type: 'string',
      group: 'source',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      description: 'Must match the lesson’s Video URL exactly. This is the join key.',
      type: 'url',
      group: 'source',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'provider',
      title: 'Provider',
      type: 'string',
      group: 'source',
      options: {
        list: [
          {title: 'YouTube', value: 'youtube'},
          {title: 'Vimeo', value: 'vimeo'},
          {title: 'Bunny', value: 'bunny'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Source title',
      description: 'The title on the provider. Display only, for recognising the video here.',
      type: 'string',
      group: 'source',
    }),
    defineField({
      name: 'durationSeconds',
      title: 'Duration (seconds)',
      type: 'number',
      group: 'source',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'transcriptSource',
      title: 'Transcript source',
      description: 'Where the chunks came from. Authored means no captions were available.',
      type: 'string',
      group: 'intelligence',
      options: {
        list: [
          {title: 'Manual captions', value: 'manual'},
          {title: 'Auto captions', value: 'auto'},
          {title: 'Authored', value: 'authored'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'chaptersSource',
      title: 'Chapters source',
      description: 'Uploader means real chapter markers. Key points means derived from the lesson.',
      type: 'string',
      group: 'intelligence',
      options: {
        list: [
          {title: 'Uploader', value: 'uploader'},
          {title: 'Lesson key points', value: 'keyPoints'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'chapters',
      title: 'Chapters',
      description: 'The table of contents. Matched before the transcript.',
      type: 'array',
      group: 'intelligence',
      of: [defineArrayMember({type: 'videoChapter'})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'chunks',
      title: 'Transcript chunks',
      description: 'Short timestamped pieces. Never return this whole array to a model.',
      type: 'array',
      group: 'intelligence',
      of: [defineArrayMember({type: 'videoChunk'})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {title: 'title', videoId: 'videoId', provider: 'provider'},
    prepare: ({title, videoId, provider}) => ({
      title: title || videoId,
      subtitle: `${provider} · ${videoId}`,
    }),
  },
})
