import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CourseCard,
  LessonCard,
  LessonVideoCard,
  ResourceCard,
} from "@/components/ui/card";
import {
  AccessibilityIcon,
  BarChartFilledIcon,
  BarChartIcon,
  BellFilledIcon,
  BellIcon,
  BookmarkFilledIcon,
  BookmarkIcon,
  ChevronRightFilledIcon,
  ChevronRightIcon,
  ClockFilledIcon,
  ClockIcon,
  ExternalLinkIcon,
  EyeIcon,
  FileFilledIcon,
  FileIcon,
  GridIcon,
  PlayCircleFilledIcon,
  PlayCircleIcon,
  SearchFilledIcon,
  SearchIcon,
  TargetIcon,
  UserFilledIcon,
  UserIcon,
  VertexMark,
} from "@/components/ui/icons";
import { SearchInput, Select } from "@/components/ui/input";
import {
  Breadcrumbs,
  NavBar,
  Pagination,
} from "@/components/ui/navigation";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusIndicator } from "@/components/ui/status";

export const metadata: Metadata = {
  title: "Design System — Vertex",
  description: "Tokens and UI primitives for the Vertex learning platform.",
};

function Section({
  number,
  title,
  children,
  className,
}: {
  number: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`min-w-0 rounded-lg border border-neutral-200 bg-neutral-50 p-6 ${className ?? ""}`}
    >
      <header className="mb-6 flex items-center gap-4">
        <span className="text-xs font-semibold text-primary-500">{number}</span>
        <h2 className="text-xs font-semibold tracking-[0.14em] text-neutral-900 uppercase">
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
}

function Swatch({
  name,
  hex,
  className,
}: {
  name: string;
  hex: string;
  className: string;
}) {
  return (
    <div className="min-w-20 flex-1">
      <div
        className={`h-14 rounded-sm border border-neutral-200 ${className}`}
      />
      <p className="mt-3 text-sm font-medium text-neutral-900">{name}</p>
      <p className="text-sm text-neutral-500">{hex}</p>
    </div>
  );
}

function SpecList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm text-neutral-500">
          <span aria-hidden>·</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const typeScale = [
  ["Display 1", "Playfair Display", "48 / 56", "Bold", "Page titles"],
  ["Display 2", "Playfair Display", "36 / 44", "Bold", "Section titles"],
  ["Heading 1", "Inter", "28 / 36", "Semi Bold", "Card titles"],
  ["Heading 2", "Inter", "22 / 30", "Semi Bold", "Sub section"],
  ["Heading 3", "Inter", "18 / 26", "Medium", "Small titles"],
  ["Body Large", "Inter", "16 / 24", "Regular", "Body copy"],
  ["Body", "Inter", "14 / 20", "Regular", "Supporting text"],
  ["Small", "Inter", "12 / 16", "Regular", "Captions, meta"],
];

const spacing = [
  [4, "0.25rem", "size-1"],
  [8, "0.5rem", "size-2"],
  [12, "0.75rem", "size-3"],
  [16, "1rem", "size-4"],
  [24, "1.5rem", "size-6"],
  [32, "2rem", "size-8"],
  [40, "2.5rem", "size-10"],
  [48, "3rem", "size-12"],
  [64, "4rem", "size-16"],
] as const;

const radii = [
  ["4px", "(xs)", "rounded-xs"],
  ["8px", "(sm)", "rounded-sm"],
  ["12px", "(md)", "rounded-md"],
  ["16px", "(lg)", "rounded-lg"],
  ["24px", "(xl)", "rounded-xl"],
  ["Full", "(circle)", "rounded-full"],
] as const;

const shadows = [
  ["Sm", "0 1px 2px 0", "rgba(15, 23, 42, 0.05)", "shadow-sm"],
  ["Md", "0 4px 12px -2px", "rgba(15, 23, 42, 0.08)", "shadow-md"],
  ["Lg", "0 12px 24px -4px", "rgba(15, 23, 42, 0.10)", "shadow-lg"],
  ["Xl", "0 20px 40px -8px", "rgba(15, 23, 42, 0.12)", "shadow-xl"],
] as const;

const outlineIcons = [
  BellIcon,
  SearchIcon,
  PlayCircleIcon,
  FileIcon,
  BookmarkIcon,
  BarChartIcon,
  ClockIcon,
  UserIcon,
  ChevronRightIcon,
];

const filledIcons = [
  BellFilledIcon,
  SearchFilledIcon,
  PlayCircleFilledIcon,
  FileFilledIcon,
  BookmarkFilledIcon,
  BarChartFilledIcon,
  ClockFilledIcon,
  UserFilledIcon,
  ChevronRightFilledIcon,
];

const principles = [
  {
    Icon: EyeIcon,
    title: "Clarity First",
    body: "Every element should communicate clearly.",
  },
  {
    Icon: GridIcon,
    title: "Consistency",
    body: "Use components and patterns consistently across the platform.",
  },
  {
    Icon: TargetIcon,
    title: "Focus & Calm",
    body: "Remove noise and help learners focus on what matters.",
  },
  {
    Icon: AccessibilityIcon,
    title: "Accessible",
    body: "Design with accessibility and inclusivity in mind.",
  },
];

/**
 * The sheet shows the hover row as a static state, so that row hard-codes the
 * hover styling instead of relying on a real pointer hover.
 */
type ButtonRow = {
  label: string;
  disabled: boolean;
  primary?: string;
  secondary?: string;
  tertiary?: string;
  text?: string;
};

const buttonRows: ButtonRow[] = [
  { label: "Default", disabled: false },
  {
    label: "Hover",
    disabled: false,
    primary: "bg-primary-600",
    secondary: "bg-primary-100",
    tertiary: "border-neutral-300 bg-neutral-50",
    text: "text-primary-600",
  },
  { label: "Disabled", disabled: true },
];

export default function DesignSystemPage() {
  return (
    <main className="mx-auto w-full max-w-[1440px] min-w-0 px-4 py-10 sm:px-6">
      <div className="grid gap-4">
        {/* Intro + 01 Colors */}
        <div className="grid gap-4 lg:grid-cols-[minmax(340px,1fr)_2fr]">
          <section className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
            <div className="flex items-center gap-2 text-neutral-900">
              <VertexMark size={36} className="text-primary-500" />
              <span className="heading-1 font-semibold">Vertex</span>
            </div>
            <h1 className="display-2 mt-8 text-neutral-900 sm:display-1 lg:whitespace-nowrap">
              Design System
            </h1>
            <p className="body-lg mt-6 max-w-sm text-neutral-500">
              A unified design language for Vertex learning platform. Clean,
              modern and focused on clarity, consistency and intuitive learning
              experiences.
            </p>
            <p className="mt-10 text-xs font-semibold tracking-[0.14em] text-neutral-500 uppercase">
              Version 1.0 &nbsp;·&nbsp; May 2025
            </p>
          </section>

          <Section number="01" title="Colors">
            <h3 className="mb-4 text-sm font-semibold text-neutral-900">
              Primary
            </h3>
            <div className="flex flex-wrap gap-4">
              <Swatch name="Primary 500" hex="#F97316" className="bg-primary-500" />
              <Swatch name="Primary 400" hex="#FB923C" className="bg-primary-400" />
              <Swatch name="Primary 300" hex="#FDBA74" className="bg-primary-300" />
              <Swatch name="Primary 200" hex="#FED7AA" className="bg-primary-200" />
              <Swatch name="Primary 100" hex="#FFEEE5" className="bg-primary-100" />
            </div>
            <h3 className="mt-8 mb-4 text-sm font-semibold text-neutral-900">
              Neutral
            </h3>
            <div className="flex flex-wrap gap-4">
              <Swatch name="Neutral 900" hex="#0F172A" className="bg-neutral-900" />
              <Swatch name="Neutral 700" hex="#334155" className="bg-neutral-700" />
              <Swatch name="Neutral 500" hex="#64748B" className="bg-neutral-500" />
              <Swatch name="Neutral 300" hex="#CBD5E1" className="bg-neutral-300" />
              <Swatch name="Neutral 200" hex="#E2E8F0" className="bg-neutral-200" />
              <Swatch name="Neutral 100" hex="#F1F5F9" className="bg-neutral-100" />
              <Swatch name="Neutral 50" hex="#FAFAFC" className="bg-neutral-50" />
              <Swatch name="White" hex="#FFFFFF" className="bg-surface" />
            </div>
          </Section>
        </div>

        {/* 02 Typography + 03 Type scale */}
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <Section number="02" title="Typography">
            <div className="space-y-8">
              <div className="flex flex-wrap items-baseline gap-8">
                <span className="display-1 text-neutral-900">Ag</span>
                <div>
                  <p className="heading-2 font-semibold text-neutral-900">
                    Playfair Display
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Elegant &nbsp;·&nbsp; Readable &nbsp;·&nbsp; Timeless
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-baseline gap-8">
                <span className="text-[48px] leading-[56px] font-semibold text-neutral-900">
                  Ag
                </span>
                <div>
                  <p className="heading-2 font-semibold text-neutral-900">
                    Inter
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Clean &nbsp;·&nbsp; Modern &nbsp;·&nbsp; Highly legible
                  </p>
                </div>
              </div>
            </div>
          </Section>

          <Section number="03" title="Type Scale">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="text-neutral-500">
                    <th className="pb-3 font-normal">Style</th>
                    <th className="pb-3 font-normal">Font</th>
                    <th className="pb-3 font-normal">Size / Line Height</th>
                    <th className="pb-3 font-normal">Weight</th>
                    <th className="pb-3 font-normal">Use</th>
                  </tr>
                </thead>
                <tbody>
                  {typeScale.map(([style, font, size, weight, use]) => (
                    <tr key={style} className="align-baseline">
                      <td className="py-1.5 font-semibold text-neutral-900">
                        {style}
                      </td>
                      <td className="py-1.5 text-neutral-500">{font}</td>
                      <td className="py-1.5 text-neutral-500">{size}</td>
                      <td className="py-1.5 text-neutral-500">{weight}</td>
                      <td className="py-1.5 text-neutral-500">{use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>

        {/* 04 Spacing + 05 Radius & shadows */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Section number="04" title="Spacing System">
            <p className="text-sm font-semibold text-neutral-900">
              Base unit: 4px
            </p>
            <div className="mt-8 flex flex-wrap items-end gap-x-4 gap-y-6">
              {spacing.map(([px, rem, size]) => (
                <div key={px} className="text-center">
                  <div className="flex h-16 items-end justify-center">
                    <div className={`${size} rounded-xs bg-primary-200`} />
                  </div>
                  <p className="mt-3 text-sm font-medium text-neutral-900">
                    {px}
                  </p>
                  <p className="text-[10px] text-neutral-500">({rem})</p>
                </div>
              ))}
            </div>
          </Section>

          <Section number="05" title="Radius & Shadows">
            <p className="text-sm font-semibold text-neutral-900">Radius</p>
            <div className="mt-6 flex flex-wrap gap-6">
              {radii.map(([label, note, cls]) => (
                <div key={label} className="text-center">
                  <div
                    className={`size-14 border border-neutral-200 bg-surface ${cls}`}
                  />
                  <p className="mt-3 text-sm font-medium text-neutral-900">
                    {label}
                  </p>
                  <p className="text-xs text-neutral-500">{note}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm font-semibold text-neutral-900">
              Shadows
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {shadows.map(([name, offset, color, cls]) => (
                <div
                  key={name}
                  className={`rounded-md bg-surface p-4 ${cls}`}
                >
                  <p className="heading-3 font-semibold text-neutral-900">
                    {name}
                  </p>
                  <p className="mt-2 text-xs text-neutral-500">{offset}</p>
                  <p className="text-xs text-neutral-500">{color}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* 06 Icons + 07 Buttons + 08 Inputs */}
        <div className="grid gap-4 lg:grid-cols-[1fr_2.2fr_0.95fr]">
          <Section number="06" title="Icons">
            <p className="text-sm font-semibold text-neutral-900">
              Outline Style
            </p>
            <div className="mt-5 flex items-center justify-between gap-2 text-neutral-900">
              {outlineIcons.map((Icon, i) => (
                <Icon key={i} size={24} />
              ))}
            </div>
            <p className="mt-8 text-sm font-semibold text-neutral-900">
              Filled Style
            </p>
            <div className="mt-5 flex items-center justify-between gap-2 text-neutral-900">
              {filledIcons.map((Icon, i) => (
                <Icon key={i} size={24} />
              ))}
            </div>
            <p className="mt-8 mb-3 text-sm font-semibold text-neutral-900">
              Icon Specs
            </p>
            <SpecList
              items={[
                "24x24px grid",
                "2px stroke width (outline)",
                "Rounded line caps",
                "Consistent optical balance",
              ]}
            />
          </Section>

          <Section number="07" title="Buttons">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-neutral-500">
                    <th className="pb-3 font-normal" />
                    <th className="pb-3 font-normal">Primary</th>
                    <th className="pb-3 font-normal">Secondary</th>
                    <th className="pb-3 font-normal">Tertiary</th>
                    <th className="pb-3 font-normal">Text</th>
                  </tr>
                </thead>
                <tbody>
                  {buttonRows.map((row) => (
                    <tr key={row.label}>
                      <td className="py-2 pr-3 text-sm font-medium text-neutral-900">
                        {row.label}
                      </td>
                      <td className="py-2 pr-2">
                        <Button disabled={row.disabled} className={row.primary}>
                          Get Started
                        </Button>
                      </td>
                      <td className="py-2 pr-2">
                        <Button
                          variant="secondary"
                          disabled={row.disabled}
                          className={row.secondary}
                        >
                          Explore Courses
                        </Button>
                      </td>
                      <td className="py-2 pr-2">
                        <Button
                          variant="tertiary"
                          disabled={row.disabled}
                          className={row.tertiary}
                          iconRight={<ExternalLinkIcon size={18} />}
                        >
                          View Lesson
                        </Button>
                      </td>
                      <td className="py-2">
                        <Button
                          variant="text"
                          disabled={row.disabled}
                          className={row.text}
                          iconRight={<PlayCircleFilledIcon size={20} />}
                        >
                          Watch Video
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-8 mb-3 text-sm font-semibold text-neutral-900">
              Button Specs
            </p>
            <SpecList
              items={[
                "Height: 44px (default)",
                "Padding: 0 16px (lg), 0 12px (md)",
                "Radius: 12px",
                "Font: Inter Medium (14–16px)",
              ]}
            />
          </Section>

          <Section number="08" title="Inputs">
            <p className="mb-3 text-sm font-semibold text-neutral-900">
              Search / Text Input
            </p>
            <SearchInput />
            <p className="mt-8 mb-3 text-sm font-semibold text-neutral-900">
              Select
            </p>
            <Select defaultValue="relevant">
              <option value="relevant">Most Relevant</option>
              <option value="recent">Most Recent</option>
              <option value="duration">Shortest First</option>
            </Select>
            <p className="mt-8 mb-3 text-sm font-semibold text-neutral-900">
              Field Specs
            </p>
            <SpecList
              items={[
                "Height: 44px",
                "Radius: 12px",
                "Border: 1px solid #E2E8F0",
                "Padding: 0 16px",
                "Focus: Border color #FB923C",
              ]}
            />
          </Section>
        </div>

        {/* 09 Badges + 10 Status + 11 Progress */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Section number="09" title="Badges / Tags">
            <div className="flex flex-wrap gap-10">
              <div>
                <p className="mb-3 text-sm text-neutral-900">Video</p>
                <Badge tone="video">Video</Badge>
              </div>
              <div>
                <p className="mb-3 text-sm text-neutral-900">Lesson</p>
                <Badge tone="lesson">Lesson</Badge>
              </div>
              <div>
                <p className="mb-3 text-sm text-neutral-900">Popular</p>
                <Badge tone="popular">Popular</Badge>
              </div>
            </div>
          </Section>

          <Section number="10" title="Status / Indicators">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
              <StatusIndicator status="in-progress" />
              <StatusIndicator status="completed" />
              <StatusIndicator status="now-playing" />
              <StatusIndicator status="locked" />
            </div>
          </Section>

          <Section number="11" title="Progress Bar">
            <ProgressBar value={35} />
          </Section>
        </div>

        {/* 12 Cards */}
        <Section number="12" title="Cards">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="mb-3 text-sm text-neutral-500">Course Card</p>
              <CourseCard
                title="Next.js for Production"
                description="Build scalable, high-performance web applications with Next.js."
                level="Intermediate"
                duration="18h 24m"
                moduleCount={12}
                icon="N"
              />
            </div>
            <div>
              <p className="mb-3 text-sm text-neutral-500">
                Lesson Card (Video)
              </p>
              <LessonVideoCard
                title="Data Fetching in Server Components"
                description="Learn how to fetch data on the server using async/await and Next.js best practices."
                lessonLabel="Lesson 5.1"
                timestamp="12:45"
              />
            </div>
            <div>
              <p className="mb-3 text-sm text-neutral-500">
                Lesson Card (Lesson)
              </p>
              <LessonCard
                title="Data Fetching & Caching"
                description="Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance."
                moduleLabel="Module 5"
              />
            </div>
            <div>
              <p className="mb-3 text-sm text-neutral-500">Resource Card</p>
              <ResourceCard
                title="Caching and Revalidation Guide"
                description="Deep dive into Next.js caching strategies."
                type="PDF"
                size="1.2 MB"
              />
            </div>
          </div>
        </Section>

        {/* 13 Navigation */}
        <Section number="13" title="Navigation">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr_0.9fr]">
            <NavBar
              items={[
                { label: "Courses", href: "/courses", active: true },
                { label: "My Learning", href: "/my-learning" },
              ]}
            />
            <div>
              <p className="mb-3 text-sm text-neutral-500">Breadcrumbs</p>
              <Breadcrumbs
                items={[
                  { label: "All Courses", href: "/courses" },
                  { label: "Next.js for Production", href: "/courses/nextjs" },
                  { label: "Data Fetching & Caching" },
                ]}
              />
            </div>
            <div>
              <p className="mb-3 text-sm text-neutral-500">Pagination</p>
              <Pagination
                page={1}
                totalPages={8}
                hrefFor={(p) => `/courses?page=${p}`}
              />
            </div>
          </div>
        </Section>

        {/* 14 Principles */}
        <Section number="14" title="Principles">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {principles.map(({ Icon, title, body }) => (
              <div key={title} className="flex gap-4">
                <Icon size={24} className="mt-0.5 shrink-0 text-neutral-900" />
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {title}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
