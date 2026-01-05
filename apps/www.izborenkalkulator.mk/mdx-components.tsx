import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => (
      <h1 className="mb-4 text-3xl font-display font-bold text-slate-700" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="mb-4 text-2xl font-display font-bold text-slate-700" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="mb-4 text-lg font-display font-semibold text-slate-700" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 className="inline-block font-semibold text-slate-700" {...props}>
        {children}
      </h4>
    ),
    p: ({ children }) => <p className="text-slate-500 mb-4">{children}</p>,
    ul: ({ children }) => <ul className="list-disc list-outside mb-4 ml-8">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-outside mb-4 ml-8">{children}</ol>,
    li: ({ children }) => <li>{children}</li>,
    a: ({ href, children }) => {
      const isExternal = typeof href === "string" && /^https?:\/\//.test(href);
      return (
        <a href={href} className="text-blue-500 underline hover:no-underline font-medium" {...(isExternal ? { target: "_blank" } : {})}>
          {children}
        </a>
      );
    },
    strong: ({ children }) => <span className="font-medium">{children}</span>,
    ...components,
  };
}
