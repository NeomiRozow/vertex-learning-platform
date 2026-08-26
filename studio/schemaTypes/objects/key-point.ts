import {defineField, defineType} from 'sanity'
import {CheckmarkCircleIcon} from '@sanity/icons'

/** One line in a lesson's "In this lesson you will" list. */
export const keyPoint = defineType({
  name: 'keyPoint',
  title: 'Key point',
  type: 'object',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'text'},
  },
})
