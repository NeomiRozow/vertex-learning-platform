import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { ChevronDownIcon, SearchIcon } from "./icons";

const field =
  "h-11 w-full rounded-md border border-neutral-200 bg-surface px-4 text-sm text-neutral-900 " +
  "transition-colors";

export type SearchInputSize = "md" | "lg";

export type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  /** Keyboard hint shown at the trailing edge, e.g. "⌘ K". */
  shortcut?: string;
  /** "lg" is the hero-sized field used on the home page. */
  size?: SearchInputSize;
};

const searchSizes: Record<
  SearchInputSize,
  { shell: string; icon: number; input: string; kbd: string }
> = {
  md: {
    shell: "gap-3 px-4",
    icon: 20,
    input: "text-sm",
    kbd: "rounded-xs px-2 py-1 text-xs",
  },
  lg: {
    shell: "h-16 gap-4 rounded-lg px-6 sm:h-20",
    icon: 24,
    input: "text-base sm:text-lg",
    kbd: "rounded-sm px-3 py-2 text-sm",
  },
};

export function SearchInput({
  className,
  shortcut = "⌘ K",
  placeholder = "Search anything...",
  size = "md",
  ...props
}: SearchInputProps) {
  const s = searchSizes[size];
  return (
    <div
      className={cn(
        field,
        "flex items-center",
        s.shell,
        "focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-400/25",
        className,
      )}
    >
      <SearchIcon size={s.icon} className="shrink-0 text-neutral-900" />
      <input
        type="search"
        placeholder={placeholder}
        className={cn(
          "min-w-0 flex-1 bg-transparent text-neutral-900 placeholder:text-neutral-500 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none",
          s.input,
        )}
        {...props}
      />
      {shortcut ? (
        <kbd
          className={cn(
            "hidden shrink-0 border border-neutral-200 bg-neutral-50 font-medium text-neutral-500 sm:block",
            s.kbd,
          )}
        >
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
