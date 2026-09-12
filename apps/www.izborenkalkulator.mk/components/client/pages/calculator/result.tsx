import { ResultPage, type ResultPageShare } from "@kalkulacka-one/app";
import { useAnswersStore, useCalculatedMatches, useCalculator, useCalculatorStore } from "@kalkulacka-one/app/client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CalculatorMenu, useEmbed, useSessionStatus } from "@/components/client";
import { calculatorNames } from "@/config/calculator-names";
import { useAutoSave } from "@/hooks/auto-save";
import { trackEvent } from "@/lib/analytics";
import { saveSessionData, shareSession } from "@/lib/api";
import { reportError } from "@/lib/monitoring";
import { canonical, comparisonFilterQuery, type RouteSegments, routes, stripEmbed } from "@/lib/routing";
import { toProxiedAssetUrl } from "@/lib/share-asset-url";

export function ResultPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const baseUrl = useCalculatorStore((state) => state.baseUrl);
  const embed = useEmbed();
  const answersStore = useAnswersStore((state) => state.answers);
  const locale = useLocale();
  /*
   * Whether there is a backend to mint a public link on: the sessions
   * endpoint has answered this visit (see `SessionStatusProvider`). Without
   * one — a local checkout, a fork that configured none — the share dialog is
   * image-only rather than offering a "Копирај линк" that could only fail.
   */
  const sessionStatus = useSessionStatus();

  const algorithmMatches = useCalculatedMatches();

  /*
   * The ranking is what marks the session finished server-side and what a
   * shared result is drawn from: saved eagerly the moment there is one, and
   * again with the ranking whenever the tab is hidden or left.
   */
  useAutoSave({ matches: algorithmMatches });

  useEffect(() => {
    const hasValidMatches = algorithmMatches?.some((match) => match.match !== undefined);

    if (answersStore.length > 0 && hasValidMatches) {
      saveSessionData(calculator.id, answersStore, algorithmMatches, calculator.version).catch(reportError);
    }
  }, [algorithmMatches, answersStore, calculator.id, calculator.version]);

  // A standalone calculator is named by its own data; there is no election
  // group to name it after — see `config/calculator-names.ts`. The same two
  // keys are what the asset proxy needs to find the calculator's pictures
  // under the data endpoint.
  const calculatorGroup = "calculatorGroup" in calculator ? calculator.calculatorGroup.key : undefined;
  const calculatorKey = ("variant" in calculator ? calculator.variant?.key : undefined) ?? calculator.key;
  const { electionName, calculatorName } = calculatorNames({
    key: calculatorKey,
    title: calculator.title || undefined,
    shortTitle: calculator.shortTitle,
  });

  // In an embed the wordmark doubles as the attribution — the one way out of a
  // partner's iframe to the full site — unless the partner opted out of it.
  const attributionHref = embed.isEmbed && embed.config?.attribution !== false ? (process.env.NEXT_PUBLIC_CANONICAL_URL ?? "/") : undefined;
  const logoMonochrome = embed.isEmbed && embed.config?.logo === "monochrome";

  const comparisonRoute = routes.comparison(segments, locale);

  const handleBackClick = () => {
    router.push(routes.review(segments, locale));
  };

  const handleCompareClick = () => {
    router.push(comparisonRoute);
  };

  /*
   * The dashboard's deep links into the comparison — the same `?filter=` the
   * comparison page reads on arrival (see `lib/routing/comparison-filter.ts`).
   * The topic link is wired the way the other apps wire it, but this site's
   * topics are Cyrillic and the app package's `topicSlug` is Latin-only, so
   * the dashboard shows every topic row as plain text and never calls this
   * today; it starts working the day the slug learns the script.
   */
  const handleCompareTopicClick = (topicSlug: string) => {
    router.push(`${comparisonRoute}${comparisonFilterQuery({ topic: topicSlug })}`);
  };

  const handleCompareImportantClick = () => {
    router.push(`${comparisonRoute}${comparisonFilterQuery("important")}`);
  };

  /*
   * Everything that leaves the app — the address handed to the OS share sheet
   * and the public link — is addressed outside any embed (`stripEmbed`): a
   * link shared out of a partner's iframe should open the full site, not a
   * chrome-stripped embed orphaned from the page it was designed to sit in.
   */
  const canonicalSegments = useMemo(() => stripEmbed(segments), [segments]);

  /*
   * The sheet's address is the calculator's *intro*, never this results page
   * — a recipient who opened this page's own URL would see the sender's
   * ranking, not a blank calculator waiting for their own answers. The origin
   * comes from the page rather than from configuration: it has to be the
   * site the reader is actually on (staging, a preview deployment), and there
   * is no `window` to read it from during the server render, hence the
   * effect.
   */
  const [shareUrl, setShareUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    setShareUrl(new URL(routes.introduction(canonicalSegments, locale), window.location.origin).toString());
  }, [canonicalSegments, locale]);

  /*
   * "Копирај линк": the existing `sessions:share` endpoint mints the
   * session's public id (idempotently — a session that already has one gets
   * the same one back, so pressing twice cannot mint two links to one
   * result), and the link is the canonical public-result address the retired
   * share modal copied. A mint that fails is reported and answered with
   * `null`, which the dialog turns into its own message.
   */
  const requestShareLink = useCallback(async () => {
    try {
      const { publicId } = await shareSession(calculator.id);
      return canonical.publicResult(canonicalSegments, publicId, locale);
    } catch (error) {
      reportError(error);
      return null;
    }
  }, [calculator.id, canonicalSegments, locale]);

  /*
   * "Completed" the moment the ranking is first on screen for its owner —
   * the page gates it past the calculating beat and off a shared result, so
   * it means the same thing as the ranking `saveSessionData` marks the
   * session finished with.
   */
  const handleRankingShown = useCallback(() => {
    trackEvent("Calculator completed", { calculator: calculator.id });
  }, [calculator.id]);

  const share = useMemo<ResultPageShare>(
    () => ({
      url: shareUrl,
      onRequestShareLink: sessionStatus === "ready" ? requestShareLink : undefined,
      // The card's pictures go through the same-origin proxy: the canvas
      // export needs readable pixels, and the data CDN sends no CORS header.
      assetUrl: (url) => toProxiedAssetUrl(url, { assetBase: baseUrl, group: calculatorGroup, key: calculatorKey }) ?? url,
      // Only a completed hand-off reaches here — the dialog reports nothing for a dismissed sheet or a failure.
      onShared: (method) => trackEvent("Result shared", { calculator: calculator.id, method }),
    }),
    [shareUrl, sessionStatus, requestShareLink, baseUrl, calculatorGroup, calculatorKey, calculator.id],
  );

  /*
   * No donate card: this site has no donation platform (the legacy
   * `calculator/components/client/donate-card.tsx` is a stub that renders
   * nothing), so the slot the Czech and Slovak pages fill stays empty rather
   * than mounting a card with nothing in it.
   */
  return (
    <ResultPage
      appTitle="Изборен калкулатор"
      electionName={electionName}
      calculatorName={calculatorName}
      headerActions={<CalculatorMenu segments={segments} matches={algorithmMatches} />}
      attributionHref={attributionHref}
      logoMonochrome={logoMonochrome}
      onBackClick={handleBackClick}
      onCompareClick={handleCompareClick}
      onCompareTopicClick={handleCompareTopicClick}
      onCompareImportantClick={handleCompareImportantClick}
      onRankingShown={handleRankingShown}
      share={share}
    />
  );
}
