import { OptionList, type OptionListHandle, SearchField } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";
import { createContext, Fragment, type KeyboardEvent, type ReactNode, type RefObject, useContext, useEffect, useId, useMemo, useRef, useState } from "react";

import type { DistrictPickerRowViewModel, DistrictPickerViewModel } from "@/view-models";

import { collectTargets, type DistrictPickerMatch, searchRows } from "./district-picker-search";

type DistrictPickerState = {
  picker: DistrictPickerViewModel;
  query: string;
  setQuery: (query: string) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  matches: DistrictPickerMatch[];
  targets: string[];
  listRef: RefObject<OptionListHandle | null>;
  listId: string;
  navigate: (href: string) => void;
};

const DistrictPickerContext = createContext<DistrictPickerState | undefined>(undefined);

function useDistrictPicker(): DistrictPickerState {
  const state = useContext(DistrictPickerContext);
  if (!state) throw new Error("DistrictPicker parts must be rendered inside <DistrictPicker>");
  return state;
}

export type DistrictPicker = {
  picker: DistrictPickerViewModel;
  onNavigate?: (href: string) => void;
  children: ReactNode;
};

export function DistrictPicker({ picker, onNavigate, children }: DistrictPicker) {
  const listRef = useRef<OptionListHandle>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const matches = useMemo(() => searchRows(picker.sections, query), [picker.sections, query]);
  const targets = useMemo(() => {
    if (query) return matches.flatMap((match) => (match.href ? [match.href] : []));
    const hrefs: string[] = [];
    for (const section of picker.sections) collectTargets(section.rows, hrefs);
    return hrefs;
  }, [picker.sections, matches, query]);

  // Runs after the highlight moved, so the list's handle already targets the new active row.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `activeIndex` is a dependency on purpose: the list's handle scrolls whichever row is active now
  useEffect(() => {
    if (query) listRef.current?.scrollActiveIntoView();
  }, [activeIndex, query]);

  const changeQuery = (value: string) => {
    setQuery(value);
    setActiveIndex(0);
  };

  const navigate = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    } else {
      window.location.assign(href);
    }
  };

  return (
    <DistrictPickerContext.Provider value={{ picker, query, setQuery: changeQuery, activeIndex, setActiveIndex, matches, targets, listRef, listId, navigate }}>
      {children}
    </DistrictPickerContext.Provider>
  );
}

export function DistrictPickerSearch() {
  const t = useTranslations("koa.pages.districtPicker");
  const { picker, query, setQuery, activeIndex, matches, targets, listRef, listId, navigate } = useDistrictPicker();
  const highlightedHref = query ? targets[activeIndex] : undefined;

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      listRef.current?.focusActive();
    } else if (event.key === "Enter" && highlightedHref) {
      event.preventDefault();
      navigate(highlightedHref);
    }
  };

  return (
    <>
      <SearchField
        value={query}
        onValueChange={setQuery}
        label={t("searchLabel")}
        placeholder={picker.searchPlaceholder ?? t("searchPlaceholder")}
        clearLabel={t("clearSearch")}
        aria-controls={listId}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      <output aria-live="polite" className="koa:sr-only">
        {query ? t("resultsCount", { count: matches.length }) : ""}
      </output>
    </>
  );
}

export function DistrictPickerResults() {
  const t = useTranslations("koa.pages.districtPicker");
  const { picker, query, activeIndex, setActiveIndex, matches, targets, listRef, listId } = useDistrictPicker();
  const searching = query.length > 0;

  const renderRow = (row: DistrictPickerMatch, parent?: DistrictPickerRowViewModel): ReactNode => {
    const code = picker.showCode && row.code && (
      <OptionList.Badge>
        <span className="koa:inline-grid koa:h-7 koa:min-w-7 koa:place-items-center koa:rounded-lg koa:bg-slate-100 koa:px-1.5 koa:text-sm koa:font-medium koa:tabular-nums koa:text-slate-500">
          <span className="koa:sr-only">{t("codeLabel")} </span>
          {row.code}
        </span>
      </OptionList.Badge>
    );
    const context = row.matchedAlias ?? row.parentTitle ?? parent?.title;
    const children = row.children?.map((child) => renderRow(child, row));
    const active = row.href !== undefined && targets.indexOf(row.href) === activeIndex;
    const description = row.href ? context : context ? `${context} · ${t("unavailable")}` : t("unavailable");

    return (
      <Fragment key={row.key}>
        <OptionList.Row href={row.href} disabled={row.href === undefined} highlighted={active && searching} tabIndex={active ? 0 : -1} className="koa:scroll-mt-64">
          {code}
          <OptionList.Title>{row.title}</OptionList.Title>
          {description && <OptionList.Description>{description}</OptionList.Description>}
        </OptionList.Row>
        {children}
      </Fragment>
    );
  };

  return (
    <div id={listId}>
      {searching && matches.length === 0 ? (
        <p className="koa:px-4 koa:py-6 koa:text-slate-500">{t("empty", { query })}</p>
      ) : (
        <OptionList ref={listRef} activeIndex={activeIndex} onActiveIndexChange={setActiveIndex} aria-label={picker.title ?? t("title")} className="koa:grid koa:gap-6">
          {searching
            ? matches.map((match) => renderRow(match))
            : picker.sections.map((section) => {
                const headingId = `${listId}-${section.key}`;
                return (
                  <section key={section.key} aria-labelledby={section.title ? headingId : undefined} className="koa:grid koa:gap-2.5">
                    {section.title && (
                      <h3 id={headingId} className="koa:px-1 koa:text-xs koa:font-semibold koa:uppercase koa:tracking-[0.04em] koa:text-slate-500">
                        {section.title}
                      </h3>
                    )}
                    {section.rows.map((row) => renderRow(row))}
                  </section>
                );
              })}
        </OptionList>
      )}
    </div>
  );
}
