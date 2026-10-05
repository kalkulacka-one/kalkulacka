// Ecomail list records + Subscription rows → planned row updates and a report. Pure; `pull.ts` does the I/O.

/** Ecomail's `status` filter only accepts these as strings; numeric values are silently ignored. */
export const ECOMAIL_STATUSES = ["subscribed", "unsubscribed", "bounced", "complained"] as const;
export type EcomailStatus = (typeof ECOMAIL_STATUSES)[number];

export type EcomailRecord = {
  email: string;
  unsubscribed_at_utc?: string | null;
  subscribed_at_utc?: string | null;
  subscriber?: { bounced_hard?: number | boolean | null; last_delivery?: string | null } | null;
};

/** Best first; `sync_time` means Ecomail gave nothing usable. */
export const UNSUBSCRIBE_SOURCES = ["unsubscribed_at_utc", "last_delivery", "subscribed_at_utc", "sync_time"] as const;
export type UnsubscribeSource = (typeof UNSUBSCRIBE_SOURCES)[number];

export type EcomailContact = {
  email: string;
  statuses: Set<EcomailStatus>;
  unsubscribed: boolean;
  unsubscribedAt: Date | null;
  unsubscribedAtSource: Exclude<UnsubscribeSource, "sync_time"> | null;
  hardBounced: boolean;
};

export type CollectIssues = {
  multipleStatuses: string[];
  bouncedWithoutHardFlag: string[];
};

const ZONED = /(Z|[+-]\d{2}:?\d{2})$/i;
const NAIVE = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/;

function toDate(ms: number): Date | null {
  return Number.isNaN(ms) ? null : new Date(ms);
}

/** A value without a zone designator is read as UTC. */
export function parseUtcTimestamp(value: string | null | undefined): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (ZONED.test(trimmed)) return toDate(Date.parse(trimmed));
  if (NAIVE.test(trimmed)) return toDate(Date.parse(`${trimmed.replace(" ", "T")}Z`));
  return null;
}

/** Only accepts timestamps with an explicit zone. */
export function parseZonedTimestamp(value: string | null | undefined): Date | null {
  if (!value || !ZONED.test(value.trim())) return null;
  return toDate(Date.parse(value.trim()));
}

/**
 * Ecomail's unsubscribe time. Naive API timestamps are UTC – verified 2026-10-05 against campaign `sent_at`: `_utc` read as UTC
 * aligns with send times, while the Z-suffixed `unsubscribed_at` is 1–2 h early, so `unsubscribed_at` is never used.
 * When `unsubscribed_at_utc` is empty (contacts imported already unsubscribed, spam complaints), fall back to the last delivery
 * (an unsubscribe/complaint follows it), then to `subscribed_at_utc` (the import, when the status was set); `null` → sync time.
 * Caveat: `subscriber.last_delivery` is account-wide, not per list.
 */
export function ecomailUnsubscribedAt(record: EcomailRecord): { at: Date; source: Exclude<UnsubscribeSource, "sync_time"> } | null {
  const candidates = [
    ["unsubscribed_at_utc", record.unsubscribed_at_utc],
    ["last_delivery", record.subscriber?.last_delivery],
    ["subscribed_at_utc", record.subscribed_at_utc],
  ] as const;
  for (const [source, value] of candidates) {
    const at = parseUtcTimestamp(value);
    if (at) return { at, source };
  }
  return null;
}

function isHardBounced(record: EcomailRecord): boolean {
  const flag = record.subscriber?.bounced_hard;
  return flag === true || (typeof flag === "number" && flag > 0);
}

const sourceRank = (source: UnsubscribeSource) => UNSUBSCRIBE_SOURCES.indexOf(source);

function isBetterUnsubscribe(found: { at: Date; source: UnsubscribeSource }, contact: EcomailContact): boolean {
  if (!contact.unsubscribedAt || !contact.unsubscribedAtSource) return true;
  const rank = sourceRank(found.source) - sourceRank(contact.unsubscribedAtSource);
  return rank < 0 || (rank === 0 && found.at < contact.unsubscribedAt);
}

export function collectContacts(byStatus: Partial<Record<EcomailStatus, EcomailRecord[]>>): { contacts: Map<string, EcomailContact>; issues: CollectIssues } {
  const contacts = new Map<string, EcomailContact>();
  const issues: CollectIssues = { multipleStatuses: [], bouncedWithoutHardFlag: [] };

  for (const status of ECOMAIL_STATUSES) {
    for (const record of byStatus[status] ?? []) {
      const email = record.email.trim().toLowerCase();
      if (!email) continue;
      let contact = contacts.get(email);
      if (!contact) {
        contact = { email, statuses: new Set(), unsubscribed: false, unsubscribedAt: null, unsubscribedAtSource: null, hardBounced: false };
        contacts.set(email, contact);
      } else if (!contact.statuses.has(status)) {
        issues.multipleStatuses.push(email);
      }
      contact.statuses.add(status);

      if (isHardBounced(record)) contact.hardBounced = true;
      else if (status === "bounced") issues.bouncedWithoutHardFlag.push(email);

      if (status === "unsubscribed" || status === "complained") {
        contact.unsubscribed = true;
        const found = ecomailUnsubscribedAt(record);
        // Across several records of one email, a better-ranked source wins; within the same source, the earliest time.
        if (found && isBetterUnsubscribe(found, contact)) {
          contact.unsubscribedAt = found.at;
          contact.unsubscribedAtSource = found.source;
        }
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
  ecomail: EcomailMarker | null;
  unsubscribedAt: Date | null;
  bounced: boolean;
};

export type BySource = Record<UnsubscribeSource, string[]>;

export type SyncReport = {
  newlyMarked: string[];
  unsubscribedSet: string[];
  unsubscribedChanged: string[];
  unsubscribeSources: { set: BySource; changed: BySource; newerConsent: BySource };
  newerConsent: string[];
  bouncedSet: string[];
  unchanged: number;
  notInEcomail: number;
  ecomailOnly: string[];
  resubscribed: string[];
  bouncedNoLongerInEcomail: string[];
  unmergeableMetadata: string[];
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function emptyBySource(): BySource {
  return { unsubscribed_at_utc: [], last_delivery: [], subscribed_at_utc: [], sync_time: [] };
}

/**
 * An Ecomail unsubscribe only applies if it is later than the last consent on our side (row creation or a recorded re-subscribe):
 * a newer sign-up on the web is a fresh consent that the pull must not clobber.
 */
export function lastConsentAt(row: SubscriptionRow): Date {
  const resubscribedAt = isPlainObject(row.metadata) && typeof row.metadata.resubscribedAt === "string" ? parseZonedTimestamp(row.metadata.resubscribedAt) : null;
  return resubscribedAt && resubscribedAt > row.createdAt ? resubscribedAt : row.createdAt;
}

export function planSync({ contacts, rows, listId, now }: { contacts: Map<string, EcomailContact>; rows: SubscriptionRow[]; listId: number; now: Date }): { updates: RowUpdate[]; report: SyncReport } {
  const report: SyncReport = {
    newlyMarked: [],
    unsubscribedSet: [],
    unsubscribedChanged: [],
    unsubscribeSources: { set: emptyBySource(), changed: emptyBySource(), newerConsent: emptyBySource() },
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

    if (row.metadata === null || row.metadata === undefined || isPlainObject(row.metadata)) {
      if (!isPlainObject(row.metadata) || row.metadata.ecomail === undefined) {
        update.ecomail = marker;
        report.newlyMarked.push(row.email);
      }
    } else {
      report.unmergeableMetadata.push(row.email);
    }

    if (contact.unsubscribed) {
      if (contact.unsubscribedAt === null) {
        // No usable Ecomail timestamp: conservatively unsubscribe at the sync time, regardless of consent, and only once.
        if (row.unsubscribedAt === null) {
          update.unsubscribedAt = now;
          report.unsubscribedSet.push(row.email);
          report.unsubscribeSources.set.sync_time.push(row.email);
        }
      } else {
        const source = contact.unsubscribedAtSource ?? "sync_time";
        if (contact.unsubscribedAt <= lastConsentAt(row)) {
          report.newerConsent.push(row.email);
          report.unsubscribeSources.newerConsent[source].push(row.email);
        } else if (row.unsubscribedAt === null) {
          update.unsubscribedAt = contact.unsubscribedAt;
          report.unsubscribedSet.push(row.email);
          report.unsubscribeSources.set[source].push(row.email);
        } else if (row.unsubscribedAt.getTime() !== contact.unsubscribedAt.getTime()) {
          update.unsubscribedAt = contact.unsubscribedAt;
          report.unsubscribedChanged.push(row.email);
          report.unsubscribeSources.changed[source].push(row.email);
        }
      }
    } else if (row.unsubscribedAt !== null && contact.statuses.has("subscribed")) {
      report.resubscribed.push(row.email);
    }

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
