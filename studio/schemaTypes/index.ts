import type {SchemaTypeDefinition} from 'sanity'

import {category} from './documents/category'
import {course} from './documents/course'
import {instructor} from './documents/instructor'
import {lesson} from './documents/lesson'
import {keyPoint} from './objects/key-point'
import {learningOutcome} from './objects/learning-outcome'
import {courseModule} from './objects/course-module'
import {resource} from './objects/resource'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    // Documents
    course,
    lesson,
    instructor,
    category,
    // Objects
    courseModule,
    learningOutcome,
    keyPoint,
    resource,
  ],
}
