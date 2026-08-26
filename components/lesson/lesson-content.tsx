import Link from "next/link";
import type { LESSON_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import { LessonPortableText } from "@/components/lesson/portable-text";
import {
  CheckCircleIcon,
  ExternalLinkIcon,
  FileIcon,
  GithubIcon,
  LightbulbIcon,
  PlayCircleIcon,
  type IconProps,
} from "@/components/ui/icons";

type Lesson = NonNullable<LESSON_BY_SLUG_QUERY_RESULT>;
type Resource = NonNullable<Lesson["resources"]>[number];

/** Resource icon per type. Unknown or missing types fall back to a link. */
const resourceIcons: Record<string, (props: IconProps) => React.ReactElement> = {
  documentation: FileIcon,
  guide: FileIcon,
  article: FileIcon,
  download: FileIcon,
  repository: GithubIcon,
  video: PlayCircleIcon,
  link: ExternalLinkIcon,
};

function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = resourceIcons[resource.type ?? "link"] ?? ExternalLinkIcon;

  const body = (
    <>
      <div className="flex items-start gap-3">
        <Icon size={20} className="mt-0.5 shrink-0 text-neutral-900" />
        <h4 className="text-sm leading-5 font-semibold text-neutral-900">
          {resource.title}
        </h4>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        {resource.description ? (
          <p className="text-xs leading-5 text-neutral-500">
            {resource.description}
          </p>
        ) : (
          <span />
        )}
        {resource.url ? (
          <ExternalLinkIcon
            size={16}
            className="mb-0.5 shrink-0 text-neutral-500 group-hover/resource:text-primary-500"
          />
        ) : null}
      </div>
    </>
  );

  const className =
    "group/resource flex flex-col rounded-md border border-neutral-200 bg-surface p-5 transition-colors hover:border-neutral-300";

  if (!resource.url) {
    return <div className={className}>{body}</div>;
  }

  return (
    <Link
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      {body}
    </Link>
  );
}

export function LessonContent({ lesson }: { lesson: Lesson }) {
  const notes = lesson.notes ?? [];
  const keyPoints = (lesson.keyPoints ?? []).filter(Boolean);
  const resources = (lesson.resources ?? []).filter((r) => r.title);

  return (
    <div className="flex flex-col">
      {notes.length || lesson.summary ? (
        <section>
          <h2 className="text-xl font-semibold text-neutral-900">Overview</h2>
          <div className="mt-4">
            {notes.length ? (
              <LessonPortableText value={notes} />
            ) : (
              <p className="text-[15px] leading-7 text-neutral-700">
                {lesson.summary}
              </p>
            )}
          </div>
        </section>
      ) : null}

      {keyPoints.length ? (
        <section className="mt-10 border-t border-neutral-200 pt-10">
          <h3 className="text-[15px] font-semibold text-neutral-900">
            In this lesson you will:
          </h3>
          <ul className="mt-5 flex flex-col gap-4">
            {keyPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <CheckCircleIcon
                  size={20}
                  className="mt-px shrink-0 text-primary-500"
                />
                <span className="text-sm leading-6 text-neutral-700">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {lesson.proTip ? (
        <div className="mt-8 flex gap-4 rounded-md bg-primary-100 p-6">
          <LightbulbIcon size={20} className="mt-0.5 shrink-0 text-primary-500" />
          <div>
            <p className="text-sm font-semibold text-neutral-900">Pro Tip</p>
            <p className="mt-1.5 text-sm leading-6 text-neutral-700">
              {lesson.proTip}
            </p>
          </div>
        </div>
      ) : null}

      {resources.length ? (
        <section className="mt-10 border-t border-neutral-200 pt-10">
          <h3 className="text-xl font-semibold text-neutral-900">Resources</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard key={resource._key} resource={resource} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
