import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ChevronLeftIcon, ChevronRightIcon, VertexMark } from "./icons";

export type LogoProps = {
  href?: string;
  className?: string;
};

export function Logo({ href = "/", className }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-xs text-neutral-900",
        className,
      )}
    >
      <VertexMark size={28} className="text-primary-500" />
      <span className="heading-2 font-semibold text-neutral-900">Vertex</span>
    </Link>
  );
}

export type NavItem = {
  label: string;
  href: string;
  active?: boolean;
};

export type NavBarProps = HTMLAttributes<HTMLElement> & {
  items: NavItem[];
  /** Right-aligned slot, e.g. the notifications bell and the account avatar. */
  actions?: ReactNode;
};

export function NavBar({ items, actions, className, ...props }: NavBarProps) {
  return (
    <nav
      aria-label="Main"
      className={cn("flex flex-wrap items-center gap-x-10 gap-y-4", className)}
      {...props}
    >
      <Logo />
      <ul className="flex items-center gap-x-8">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "rounded-xs text-sm font-medium hover:text-primary-500",
                item.active ? "text-primary-500" : "text-neutral-900",
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      {actions ? (
        <div className="ml-auto flex items-center gap-5">{actions}</div>
      ) : null}
    </nav>
  );
}

export type Crumb = {
  label: string;
  href?: string;
};

export type BreadcrumbsProps = HTMLAttributes<HTMLElement> & {
  items: Crumb[];
};

export function Breadcrumbs({ items, className, ...props }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className} {...props}>
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-x-3">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="rounded-xs text-neutral-500 hover:text-primary-500"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={
                    isLast
                      ? "font-medium text-neutral-900"
                      : "text-neutral-500"
                  }
                >
                  {item.label}
                </span>
              )}
              {isLast ? null : (
                <ChevronRightIcon size={16} className="text-neutral-300" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export type PaginationProps = HTMLAttributes<HTMLElement> & {
  page: number;
  totalPages: number;
  /** Builds the href for a page number. */
  hrefFor: (page: number) => string;
};

function pageItems(page: number, totalPages: number): Array<number | "gap"> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const items: Array<number | "gap"> = [];
  const window = [page - 1, page, page + 1].filter(
    (n) => n > 1 && n < totalPages,
  );
  items.push(1);
  if (window[0] !== undefined && window[0] > 2) items.push("gap");
  items.push(...window);
  const last = window[window.length - 1];
  if (last === undefined || last < totalPages - 1) items.push("gap");
  items.push(totalPages);
  return items;
}

const cell =
  "inline-flex size-9 items-center justify-center rounded-xs text-sm font-medium";

export function Pagination({
  page,
  totalPages,
  hrefFor,
  className,
  ...props
}: PaginationProps) {
  const items = pageItems(page, totalPages);
  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      {page === 1 ? (
        <span className={cn(cell, "text-neutral-300")} aria-hidden>
          <ChevronLeftIcon size={18} />
        </span>
      ) : (
        <Link
          href={hrefFor(prev)}
          aria-label="Previous page"
          className={cn(cell, "text-neutral-700 hover:text-primary-500")}
        >
          <ChevronLeftIcon size={18} />
        </Link>
      )}

      {items.map((item, i) =>
        item === "gap" ? (
          <span
            key={`gap-${i}`}
            className={cn(cell, "text-neutral-300")}
            aria-hidden
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-current={item === page ? "page" : undefined}
            aria-label={`Page ${item}`}
            className={cn(
              cell,
              item === page
                ? "border border-primary-500 text-primary-500"
                : "text-neutral-700 hover:text-primary-500",
            )}
          >
            {item}
          </Link>
        ),
      )}

      {page === totalPages ? (
        <span className={cn(cell, "text-neutral-300")} aria-hidden>
          <ChevronRightIcon size={18} />
        </span>
      ) : (
        <Link
          href={hrefFor(next)}
          aria-label="Next page"
          className={cn(cell, "text-neutral-700 hover:text-primary-500")}
        >
          <ChevronRightIcon size={18} />
        </Link>
      )}
    </nav>
  );
}
