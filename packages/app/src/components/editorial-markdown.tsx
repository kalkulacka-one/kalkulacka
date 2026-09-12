import Markdown from "react-markdown";

/**
 * Editorial text from the calculator data — the intro's `intro`, the guide's
 * `methodology` — with the same allow-list and link styling as the legacy
 * `Introduction`. One component so the two screens cannot drift on what a
 * paragraph of editor-written markdown is allowed to contain.
 */
export function EditorialMarkdown({ children }: { children: string }) {
  return (
    <div className="koa:grid koa:gap-2 koa:max-w-prose koa:text-[0.9375rem] koa:leading-[1.55] koa:text-(--ko-color-text-muted)">
      <Markdown
        allowedElements={["p", "strong", "em", "ul", "ol", "li", "a"]}
        skipHtml
        components={{
          a: ({ href, children }) => (
            <a href={href} className="koa:text-[var(--ko-color-primary)] koa:hover:text-[var(--ko-color-primary-hover)] koa:underline koa:hover:no-underline" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}
