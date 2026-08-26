import Link from "next/link";
import {
  BellIcon,
  CloseIcon,
  MenuIcon,
  UserFilledIcon,
} from "@/components/ui/icons";
import { NavBar, type NavItem } from "@/components/ui/navigation";

const items: NavItem[] = [
  { label: "Courses", href: "/courses" },
  { label: "My Learning", href: "/my-learning" },
];

/**
 * Placeholder for the signed-in learner. Clerk supplies the real image once
 * authentication is wired up.
 */
function Avatar() {
  return (
    <span
      role="img"
      aria-label="Your account"
      className="flex size-12 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 text-neutral-500"
    >
      <UserFilledIcon size={28} />
    </span>
  );
}

/**
 * The nav links below md, where the header has no room for them. A `details`
 * disclosure keeps this a server component — no state, no client bundle.
 */
function MobileMenu() {
  return (
    <details className="group relative md:hidden">
      <summary
        aria-label="Menu"
        className="flex size-10 cursor-pointer list-none items-center justify-center rounded-xs text-neutral-900 transition-colors hover:text-primary-500 [&::-webkit-details-marker]:hidden"
      >
        <MenuIcon size={24} className="group-open:hidden" />
        <CloseIcon size={24} className="hidden group-open:block" />
      </summary>
      <ul className="absolute top-full right-0 z-10 mt-3 w-48 rounded-md border border-neutral-200 bg-surface p-2 shadow-md">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-xs px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50 hover:text-primary-500"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-neutral-200">
      <NavBar
        items={items}
        // The inline links collapse below md; MobileMenu carries them there.
        className="h-24 flex-nowrap gap-x-8 px-6 sm:px-12 xl:px-20 [&>ul]:hidden md:gap-x-16 md:[&>ul]:flex"
        actions={
          <>
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-xs text-neutral-900 transition-colors hover:text-primary-500"
            >
              <BellIcon size={24} />
            </button>
            <Avatar />
            <MobileMenu />
          </>
        }
      />
    </header>
  );
}
