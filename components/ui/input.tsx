import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { ChevronDownIcon, SearchIcon } from "./icons";

const field =
  "h-11 w-full rounded-md border border-neutral-200 bg-surface px-4 text-sm text-neutral-900 " +
  "transition-colors";

export type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Keyboard hint shown at the trailing edge, e.g. "⌘ K". */
  shortcut?: string;
};

export function SearchInput({
  className,
  shortcut = "⌘ K",
  placeholder = "Search anything...",
  ...props
}: SearchInputProps) {
  return (
    <div
      className={cn(
        field,
        "flex items-center gap-3 px-4",
        "focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-400/25",
        className,
      )}
    >
      <SearchIcon size={20} className="shrink-0 text-neutral-900" />
      <input
        type="search"
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
        {...props}
      />
      {shortcut ? (
        <kbd className="hidden shrink-0 rounded-xs border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs font-medium text-neutral-500 sm:block">
          {shortcut}
        </kbd>
      ) : null}
    </div>
  );
}

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative w-full">
      <select
        className={cn(
          field,
          "appearance-none pr-11 focus:border-primary-400 focus:outline-none",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon
        size={20}
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-neutral-900"
      />
    </div>
  );
}
