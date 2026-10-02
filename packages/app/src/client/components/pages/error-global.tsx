import { Button } from "@kalkulacka-one/design-system/client";

import { ErrorPageLayout } from "@/components/error-page-layout";

export type ErrorGlobalPage = {
  title: string;
  eyebrow: string;
  heading: string;
  paragraph: string;
  reload: string;
  home: string;
  reference: string;
  digest?: string;
  homeHref?: string;
};

/** The error page for global-error.tsx, which replaces the document: it has no provider, so it is given its words. */
export function ErrorGlobalPage({ title, eyebrow, heading, paragraph, reload, home, reference, digest, homeHref = "/" }: ErrorGlobalPage) {
  return (
    <ErrorPageLayout title={title}>
      <p className="koa:text-xs koa:font-semibold koa:uppercase koa:tracking-widest koa:text-slate-400">{eyebrow}</p>
      <h1 className="koa:mt-2 koa:font-display koa:font-bold koa:tracking-tight koa:text-slate-700 koa:text-2xl koa:md:text-3xl">{heading}</h1>
      <p className="koa:mt-3 koa:text-slate-500">{paragraph}</p>
      <div className="koa:mt-6 koa:grid koa:gap-2">
        <Button onClick={() => window.location.reload()}>{reload}</Button>
        <a href={homeHref} className="koa:grid">
          <Button variant="link" color="neutral">
            {home}
          </Button>
        </a>
      </div>
      {digest && (
        <p className="koa:mt-6 koa:text-xs koa:text-slate-400">
          {reference}: <code className="koa:font-mono">{digest}</code>
        </p>
      )}
    </ErrorPageLayout>
  );
}
