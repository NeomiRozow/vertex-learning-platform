import type {StructureResolver} from 'sanity/structure'
import {BookIcon, CogIcon, PlayIcon, TagIcon, UserIcon} from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('course').title('Courses').icon(BookIcon),
      S.documentTypeListItem('lesson').title('Lessons').icon(PlayIcon),
      S.divider(),
      S.documentTypeListItem('instructor').title('Instructors').icon(UserIcon),
      S.documentTypeListItem('category').title('Categories').icon(TagIcon),
      S.divider(),
      // Built by scripts/ingest-videos.ts, not authored by hand. Kept visible
      // so the pipeline's output can be inspected, but out of the way.
      S.listItem()
        .title('Internal')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Internal')
            .items([S.documentTypeListItem('video').title('Videos').icon(PlayIcon)]),
        ),
    ])
