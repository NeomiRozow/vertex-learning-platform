import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "text";
export type ButtonSize = "lg" | "md";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon rendered after the label, e.g. an external-link or play glyph. */
  iconRight?: ReactNode;
  /** Icon rendered before the label. */
  iconLeft?: ReactNode;
};

const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap " +
  "transition-colors disabled:cursor-not-allowed";

const sizes: Record<ButtonSize, string> = {
  lg: "px-4 text-base",
  md: "px-3 text-sm",
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-600 " +
    "disabled:bg-primary-200 disabled:text-primary-400 disabled:hover:bg-primary-200",
  secondary:
    "border border-primary-500 bg-surface text-primary-500 hover:bg-primary-100 " +
    "disabled:border-primary-200 disabled:text-primary-300 disabled:hover:bg-surface",
  tertiary:
    "border border-neutral-200 bg-surface text-neutral-900 hover:border-neutral-300 hover:bg-neutral-50 " +
    "disabled:text-neutral-300 disabled:hover:border-neutral-200 disabled:hover:bg-surface",
  text:
    "text-primary-500 hover:text-primary-600 " +
    "disabled:text-primary-300 disabled:hover:text-primary-300",
};

export function Button({
  variant = "primary",
  size = "lg",
  iconLeft,
  iconRight,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        base,
        sizes[size],
        variants[variant],
        variant === "text" && "px-0",
        className,
      )}
      {...props}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
