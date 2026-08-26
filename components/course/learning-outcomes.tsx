import type { COURSE_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import { learningOutcomeIcon } from "@/components/ui/icons";

type Outcomes = NonNullable<COURSE_BY_SLUG_QUERY_RESULT>["learningOutcomes"];

export function LearningOutcomes({ outcomes }: { outcomes: Outcomes }) {
  if (!outcomes?.length) return null;

  return (
    <section className="rounded-lg border border-neutral-200 bg-surface p-6 shadow-sm sm:p-10">
      <h2 className="font-display text-2xl font-bold text-neutral-900 sm:text-[28px]">
        What you&apos;ll learn
      </h2>

      <ul className="mt-7 grid gap-6 lg:grid-cols-2">
        {outcomes.map((outcome) => {
          const Icon = learningOutcomeIcon(outcome.icon);
          return (
            <li
              key={outcome._key}
              className="flex gap-5 rounded-md border border-neutral-200 bg-surface p-6"
            >
              <Icon size={40} className="shrink-0 text-primary-500" />
              <div className="min-w-0">
                <h3 className="text-[17px] font-semibold text-neutral-900">
                  {outcome.title}
                </h3>
                {outcome.description ? (
                  <p className="mt-2 text-sm leading-6 text-neutral-500">
                    {outcome.description}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
