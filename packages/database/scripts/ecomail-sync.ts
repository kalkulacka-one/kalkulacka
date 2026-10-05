// Pure core of the Ecomail → DB pull (`ecomail-pull.mts`): Ecomail list records + Subscription rows → planned row updates and
// a report. No I/O here, so it can be unit-tested; the CLI does the fetching and the writing.

/** The values Ecomail's `status` filter accepts as strings (numeric values are silently ignored by the API). */
export const ECOMAIL_STATUSES = ["subscribed", "unsubscribed", "bounced", "complained"] as const;
export type EcomailStatus = (typeof ECOMAIL_STATUSES)[number];

/** The subset of an Ecomail `GET /lists/{id}/subscribers` record this sync reads. */
export type EcomailRecord = {
  email: string;
  unsubscribed_at?: string | null;
  unsubscribed_at_utc?: string | null;
  subscriber?: { bounced_hard?: number | boolean | null } | null;
};

export type EcomailContact = {
  /** Lower-cased email – the match key. */
  email: string;
  statuses: Set<EcomailStatus>;
  unsubscribed: boolean;
  /** When the person unsubscribed or complained in Ecomail; `null` when Ecomail gives no usable timestamp. */
  unsubscribedAt: Date | null;
  hardBounced: boolean;
};

export type CollectIssues = {
  /** Emails returned under more than one status (e.g. the list changed mid-scan); unsubscribe wins. */
  multipleStatuses: string[];
  /** Records under the `bounced` status whose subscriber has no hard-bounce flag – not treated as hard bounces. */
  bouncedWithoutHardFlag: string[];
  /** Unsubscribed/complained records whose unsubscribe time came from `unsubscribed_at` because `unsubscribed_at_utc` was empty. */
  timestampFromZonedField: string[];
};

const ZONED = /(Z|[+-]\d{2}:?\d{2})$/i;
const NAIVE = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/;

function toDate(ms: number): Date | null {
  return Number.isNaN(ms) ? null : new Date(ms);
}

/** Parses a timestamp known to be UTC; a value without a zone designator is read as UTC. */
export function parseUtcTimestamp(value: string | null | undefined): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (ZONED.test(trimmed)) return toDate(Date.parse(trimmed));
  if (NAIVE.test(trimmed)) return toDate(Date.parse(`${trimmed.replace(" ", "T")}Z`));
  return null;
}

/** Parses a timestamp only when it carries an explicit zone; a naive local time is ambiguous and yields `null`. */
export function parseZonedTimestamp(value: string | null | undefined): Date | null {
  if (!value || !ZONED.test(value.trim())) return null;
  return toDate(Date.parse(value.trim()));
}

/**
 * Ecomail's unsubscribe time: `unsubscribed_at_utc` first (read as UTC), then `unsubscribed_at` only if it carries an explicit
 * zone (a naive `unsubscribed_at` is the account's local time and would be off by the UTC offset).
 */
export function ecomailUnsubscribedAt(record: EcomailRecord): { at: Date | null; fromZonedField: boolean } {
  const utc = parseUtcTimestamp(record.unsubscribed_at_utc);
  if (utc) return { at: utc, fromZonedField: false };
  const zoned = parseZonedTimestamp(record.unsubscribed_at);
  return { at: zoned, fromZonedField: zoned !== null };
}

function isHardBounced(record: EcomailRecord): boolean {
  const flag = record.subscriber?.bounced_hard;
  return flag === true || (typeof flag === "number" && flag > 0);
}

/** Folds the per-status listings into one contact per lower-cased email. */
export function collectContacts(byStatus: Partial<Record<EcomailStatus, EcomailRecord[]>>): { contacts: Map<string, EcomailContact>; issues: CollectIssues } {
  const contacts = new Map<string, EcomailContact>();
  const issues: CollectIssues = { multipleStatuses: [], bouncedWithoutHardFlag: [], timestampFromZonedField: [] };

  for (const status of ECOMAIL_STATUSES) {
    for (const record of byStatus[status] ?? []) {
      const email = record.email.trim().toLowerCase();
      if (!email) continue;
      let contact = contacts.get(email);
      if (!contact) {
        contact = { email, statuses: new Set(), unsubscribed: false, unsubscribedAt: null, hardBounced: false };
        contacts.set(email, contact);
      } else if (!contact.statuses.has(status)) {
        issues.multipleStatuses.push(email);
      }
      contact.statuses.add(status);

      if (isHardBounced(record)) contact.hardBounced = true;
      else if (status === "bounced") issues.bouncedWithoutHardFlag.push(email);

      if (status === "unsubscribed" || status === "complained") {
        contact.unsubscribed = true;
        const { at, fromZonedField } = ecomailUnsubscribedAt(record);
        if (fromZonedField) issues.timestampFromZonedField.push(email);
        // Keep the earliest known unsubscribe if an email shows up twice.
        if (at && (!contact.unsubscribedAt || at < contact.unsubscribedAt)) contact.unsubscribedAt = at;
      }
    }
  }
  issues.multipleStatuses = [...new Set(issues.multipleStatuses)];
  return { contacts, issues };
}

export type SubscriptionRow = {
  id: string;
  email: string;
  createdAt: Date;
  metadata: unknown;
  emailStatus: string;
  unsubscribedAt: Date | null;
};

export type EcomailMarker = { listId: number; syncedAt: string };

export type RowUpdate = {
  id: string;
  email: string;
  /** Merge `metadata.ecomail = marker` (only ever added, never rewritten). */
  ecomail: EcomailMarker | null;
  unsubscribedAt: Date | null;
  bounced: boolean;
};

export type SyncReport = {
  newlyMarked: string[];
  unsubscribedSet: string[];
  unsubscribedChanged: string[];
  /** Subset of `unsubscribedSet`: Ecomail gave no usable timestamp, so the sync time was used. */
  unsubscribedFallback: string[];
  /** Ecomail unsubscribe predates the row's last consent (createdAt / metadata.resubscribedAt) – left alone, needs a re-subscribe push. */
  newerConsent: string[];
  bouncedSet: string[];
  /** Matched rows that need no write. */
  unchanged: number;
  /** DB rows with no contact in the Ecomail list. */
  notInEcomail: number;
  ecomailOnly: string[];
  /** Conflicts – reported, never auto-resolved. */
  resubscribed: string[];
  bouncedNoLongerInEcomail: string[];
  unmergeableMetadata: string[];
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Last time the person gave consent on our side: the row's creation, or a later re-subscribe if recorded. */
export function lastConsentAt(row: SubscriptionRow): Date {
  const resubscribedAt = isPlainObject(row.metadata) && typeof row.metadata.resubscribedAt === "string" ? parseZonedTimestamp(row.metadata.resubscribedAt) : null;
  return resubscribedAt && resubscribedAt > row.createdAt ? resubscribedAt : row.createdAt;
}

export function planSync({ contacts, rows, listId, now }: { contacts: Map<string, EcomailContact>; rows: SubscriptionRow[]; listId: number; now: Date }): { updates: RowUpdate[]; report: SyncReport } {
  const report: SyncReport = {
    newlyMarked: [],
    unsubscribedSet: [],
    unsubscribedChanged: [],
    unsubscribedFallback: [],
    newerConsent: [],
    bouncedSet: [],
    unchanged: 0,
    notInEcomail: 0,
    ecomailOnly: [],
    resubscribed: [],
    bouncedNoLongerInEcomail: [],
    unmergeableMetadata: [],
  };
  const updates: RowUpdate[] = [];
  const matched = new Set<string>();
  const marker: EcomailMarker = { listId, syncedAt: now.toISOString() };

  for (const row of rows) {
    const key = row.email.trim().toLowerCase();
    const contact = contacts.get(key);
    if (!contact) {
      report.notInEcomail++;
      continue;
    }
    matched.add(key);
    const update: RowUpdate = { id: row.id, email: row.email, ecomail: null, unsubscribedAt: null, bounced: false };

    // Presence marker – merged into metadata, so other keys (e.g. `cities`) survive.
    if (row.metadata === null || row.metadata === undefined || isPlainObject(row.metadata)) {
      if (!isPlainObject(row.metadata) || row.metadata.ecomail === undefined) {
        update.ecomail = marker;
        report.newlyMarked.push(row.email);
      }
    } else {
      report.unmergeableMetadata.push(row.email);
    }

    // Unsubscribe / complaint.
    if (contact.unsubscribed) {
      if (contact.unsubscribedAt === null) {
        // No usable Ecomail timestamp: be conservative, set the sync time – but only once.
        if (row.unsubscribedAt === null) {
          update.unsubscribedAt = now;
          report.unsubscribedSet.push(row.email);
          report.unsubscribedFallback.push(row.email);
        }
      } else if (contact.unsubscribedAt <= lastConsentAt(row)) {
        report.newerConsent.push(row.email);
      } else if (row.unsubscribedAt === null) {
        update.unsubscribedAt = contact.unsubscribedAt;
        report.unsubscribedSet.push(row.email);
      } else if (row.unsubscribedAt.getTime() !== contact.unsubscribedAt.getTime()) {
        update.unsubscribedAt = contact.unsubscribedAt;
        report.unsubscribedChanged.push(row.email);
      }
    } else if (row.unsubscribedAt !== null && contact.statuses.has("subscribed")) {
      report.resubscribed.push(row.email);
    }

    // Hard bounce – set only, never cleared.
    if (contact.hardBounced) {
      if (row.emailStatus !== "bounced") {
        update.bounced = true;
        report.bouncedSet.push(row.email);
      }
    } else if (row.emailStatus === "bounced") {
      report.bouncedNoLongerInEcomail.push(row.email);
    }

    if (update.ecomail || update.unsubscribedAt || update.bounced) updates.push(update);
    else report.unchanged++;
  }

  for (const email of contacts.keys()) if (!matched.has(email)) report.ecomailOnly.push(email);

  return { updates, report };
}
