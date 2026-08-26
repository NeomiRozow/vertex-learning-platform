import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

/** One card in a lesson's Resources row. Always an outbound link. */
export const resource = defineType({
  name: 'resource',
  title: 'Resource',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Documentation', value: 'documentation'},
          {title: 'Guide', value: 'guide'},
          {title: 'Repository', value: 'repository'},
          {title: 'Article', value: 'article'},
          {title: 'Video', value: 'video'},
          {title: 'Download', value: 'download'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) =>
        rule
          .required()
          .uri({scheme: ['http', 'https']})
          .error('Must be a valid URL starting with http:// or https://'),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'url'},
  },
})
