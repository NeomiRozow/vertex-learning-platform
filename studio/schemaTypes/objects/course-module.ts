import {defineArrayMember, defineField, defineType} from 'sanity'
import {BlockContentIcon} from '@sanity/icons'

/**
 * A module is embedded in its course, not a document of its own.
 * The numbers the UI shows ("Module 5", "Lesson 5.1") are derived from array
 * order at render time and are deliberately not stored here.
 */
export const courseModule = defineType({
  name: 'module',
  title: 'Module',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lessons',
      title: 'Lessons',
      description: 'Ordered. The order here is the order learners see.',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'lesson'}]})],
      validation: (rule) => rule.min(1).unique(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'summary'},
  },
})
