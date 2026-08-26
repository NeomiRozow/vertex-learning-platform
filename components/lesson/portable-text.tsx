import {
  PortableText,
  type PortableTextComponents,
  type PortableTextProps,
} from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

/**
 * Serializers for lesson notes. Matches the project's type scale rather than
 * relying on prose defaults, so notes sit in the page like everything else.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-4 text-[15px] leading-7 text-neutral-700 first:mt-0">
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h3 className="mt-8 text-xl font-semibold text-neutral-900 first:mt-0">
        {children}
      </h3>
    ),
    h2: ({ children }) => (
      <h3 className="mt-8 text-xl font-semibold text-neutral-900 first:mt-0">
        {children}
      </h3>
    ),
    h3: ({ children }) => (
      <h4 className="mt-6 text-base font-semibold text-neutral-900 first:mt-0">
        {children}
      </h4>
    ),
    h4: ({ children }) => (
      <h5 className="mt-6 text-[15px] font-semibold text-neutral-900 first:mt-0">
        {children}
      </h5>
    ),
    h5: ({ children }) => (
      <h6 className="mt-6 text-sm font-semibold text-neutral-900 first:mt-0">
        {children}
      </h6>
    ),
    h6: ({ children }) => (
      <h6 className="mt-6 text-sm font-semibold text-neutral-900 first:mt-0">
        {children}
      </h6>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-primary-500 pl-4 text-[15px] leading-7 text-neutral-700 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 marker:text-neutral-300">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 flex list-decimal flex-col gap-2 pl-5 marker:text-neutral-500">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-[15px] leading-7 text-neutral-700">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-[15px] leading-7 text-neutral-700">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-neutral-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded-xs bg-neutral-100 px-1.5 py-0.5 text-[13px] text-neutral-900">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : null;
      if (!href) return <>{children}</>;
      const external = /^https?:\/\//.test(href);
      return (
        <Link
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          className="text-primary-500 underline underline-offset-2 hover:text-primary-600"
        >
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      return (
        <Image
          src={urlFor(value).width(1200).fit("max").url()}
          alt={typeof value.alt === "string" ? value.alt : ""}
          width={1200}
          height={675}
          sizes="(min-width: 1280px) 900px, 100vw"
          className="mt-6 h-auto w-full rounded-md"
        />
      );
    },
  },
};

export function LessonPortableText({ value }: { value: PortableTextProps["value"] }) {
  return <PortableText value={value} components={components} />;
}
