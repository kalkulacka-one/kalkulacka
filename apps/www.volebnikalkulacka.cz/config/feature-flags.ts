/**
 * Flags for work that is finished but not yet the public face of the site.
 *
 * The 2026 calculators land long before the 2026 campaign starts, so the
 * homepage has to be able to show either state: the "coming soon" teaser with
 * its subscribe form, or the elections themselves. One env var switches
 * between them, so turning the campaign on is a deploy, not a code change.
 */
export function elections2026Live(): boolean {
  return process.env.ELECTIONS_2026 === "true";
}
