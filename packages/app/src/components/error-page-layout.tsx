import { Logo } from "@kalkulacka-one/design-system/client";
import { Card } from "@kalkulacka-one/design-system/server";

export type ErrorPageLayout = {
  title: string;
  compact?: boolean;
  children: React.ReactNode;
};

/** Renders after the app has already failed, so it reads no data and touches no store. */
export function ErrorPageLayout({ title, compact = false, children }: ErrorPageLayout) {
  if (compact) {
    return (
      <div className="koa:min-h-dvh koa:bg-slate-50 koa:flex koa:items-center koa:justify-center koa:p-4">
        <div className="koa:w-full koa:max-w-md">
          <Card border shadow="hard" className="koa:border-slate-200">
            <div className="koa:p-5">{children}</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="koa:relative koa:z-0 koa:min-h-dvh koa:bg-slate-50 koa:flex koa:flex-col">
      <div aria-hidden className="koa:pointer-events-none koa:absolute koa:inset-0 koa:z-0">
        <div className="koa:mx-auto koa:h-full koa:max-w-7xl koa:px-6 koa:sm:px-8">
          <div className="koa:relative koa:h-full koa:grid koa:grid-cols-6 koa:gap-x-6">
            {Array.from({ length: 6 }, (_, index) => index).map((columnIndex) => (
              <div key={`error-page-grid-column-${columnIndex}`} className="koa:relative">
                <div className="koa:absolute koa:inset-y-0 koa:left-0 koa:border-l-2 koa:border-dashed koa:border-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="koa:relative koa:z-10 koa:mx-auto koa:w-full koa:max-w-2xl koa:grow koa:flex koa:flex-col koa:justify-center koa:px-6 koa:sm:px-8 koa:py-12 koa:md:py-16">
        <div className="koa:mb-8 koa:text-slate-700">
          <Logo title={title} size="small" />
        </div>
        <Card border shadow="hard" className="koa:border-slate-200">
          <div className="koa:p-6 koa:md:p-10">{children}</div>
        </Card>
      </div>
    </div>
  );
}
