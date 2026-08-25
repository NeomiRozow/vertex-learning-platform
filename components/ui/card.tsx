import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "./badge";
import {
  ClockIcon,
  ExternalLinkIcon,
  FileIcon,
  FolderIcon,
  PlayCircleFilledIcon,
  SignalIcon,
} from "./icons";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-neutral-200 bg-surface p-5 shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function MetaItem({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-neutral-500">
      {icon}
      {children}
    </span>
  );
}

export type CourseCardProps = {
  title: string;
  description: string;
  level: string;
  duration: string;
  moduleCount: number;
  /** Square brand tile, e.g. a course logo. Falls back to the title initial. */
  icon?: ReactNode;
  href?: string;
  className?: string;
};

export function CourseCard({
  title,
  description,
  level,
  duration,
  moduleCount,
  icon,
  href,
  className,
}: CourseCardProps) {
  const heading = href ? (
    <Link href={href} className="hover:text-primary-500">
      {title}
    </Link>
  ) : (
    title
  );

  return (
    <Card className={cn("gap-4", className)}>
      <div className="flex gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-neutral-900 text-lg font-semibold text-white">
          {icon ?? title.charAt(0)}
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-neutral-900">
            {heading}
          </h3>
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-2">
        <MetaItem icon={<SignalIcon size={18} className="text-neutral-500" />}>
          {level}
        </MetaItem>
        <MetaItem icon={<ClockIcon size={18} className="text-neutral-500" />}>
          {duration}
        </MetaItem>
        <MetaItem icon={<FolderIcon size={18} className="text-neutral-500" />}>
          {moduleCount} modules
        </MetaItem>
      </div>
    </Card>
  );
}

export type LessonVideoCardProps = {
  title: string;
  description: string;
  /** Lesson label derived from order, e.g. "Lesson 5.1". */
  lessonLabel: string;
  /** Matched moment, formatted as mm:ss. */
  timestamp: string;
  href?: string;
  className?: string;
};

export function LessonVideoCard({
  title,
  description,
  lessonLabel,
  timestamp,
  href,
  className,
}: LessonVideoCardProps) {
  return (
    <Card className={cn("gap-3", className)}>
      <Badge tone="video" className="self-start">
        Video
      </Badge>
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      <p className="text-sm text-neutral-500">{description}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
        <span className="text-sm text-neutral-500">
          {lessonLabel} &nbsp;·&nbsp; {timestamp}
        </span>
        {href ? (
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-xs text-sm font-medium text-primary-500 hover:text-primary-600"
          >
            <PlayCircleFilledIcon size={20} />
            Watch from {timestamp}
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-500">
            <PlayCircleFilledIcon size={20} />
            Watch from {timestamp}
          </span>
        )}
      </div>
    </Card>
  );
}

export type LessonCardProps = {
  title: string;
  description: string;
  /** Module label derived from order, e.g. "Module 5". */
  moduleLabel: string;
  href?: string;
  className?: string;
};

export function LessonCard({
  title,
  description,
  moduleLabel,
  href,
  className,
}: LessonCardProps) {
  return (
    <Card className={cn("gap-3", className)}>
      <Badge tone="lesson" className="self-start">
        Lesson
      </Badge>
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      <p className="text-sm text-neutral-500">{description}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
        <span className="text-sm text-neutral-500">{moduleLabel}</span>
        {href ? (
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-xs text-sm font-medium text-primary-500 hover:text-primary-600"
          >
            View lesson
            <ExternalLinkIcon size={18} />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-500">
            View lesson
            <ExternalLinkIcon size={18} />
          </span>
        )}
      </div>
    </Card>
  );
}

export type ResourceCardProps = {
  title: string;
  description: string;
  /** Resource type shown in the meta row, e.g. "PDF". */
  type: string;
  size: string;
  href?: string;
  className?: string;
};

export function ResourceCard({
  title,
  description,
  type,
  size,
  href,
  className,
}: ResourceCardProps) {
  return (
    <Card className={cn("gap-4", className)}>
      <div className="flex gap-3">
        <FileIcon size={24} className="mt-0.5 shrink-0 text-neutral-900" />
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <span className="text-sm text-neutral-500">
          {type} &nbsp;·&nbsp; {size}
        </span>
        {href ? (
          <Link
            href={href}
            aria-label={`Open ${title}`}
            className="rounded-xs text-primary-500 hover:text-primary-600"
          >
            <ExternalLinkIcon size={20} />
          </Link>
        ) : (
          <ExternalLinkIcon size={20} className="text-primary-500" />
        )}
      </div>
    </Card>
  );
}
