import {defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons'

/**
 * One row in a course's "What you'll learn" grid.
 * The icon is stored as a key, not as an image, so the frontend renders it
 * from its own icon set and the design stays consistent.
 */
export const learningOutcome = defineType({
  name: 'learningOutcome',
  title: 'Learning outcome',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          {title: 'Layers', value: 'layers'},
          {title: 'Database', value: 'database'},
          {title: 'Gauge', value: 'gauge'},
          {title: 'Cloud', value: 'cloud'},
          {title: 'Code', value: 'code'},
          {title: 'Shield', value: 'shield'},
          {title: 'Terminal', value: 'terminal'},
          {title: 'Rocket', value: 'rocket'},
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
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
