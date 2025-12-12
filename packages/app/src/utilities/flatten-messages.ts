type NestedMessages = {
  [key: string]: string | NestedMessages;
};

type FlatMessages = {
  [key: string]: string;
};

export class MessageKeyCollisionError extends Error {
  constructor(key: string) {
    super(`Duplicate message key \`${key}\` detected`);
    this.name = "MessageKeyCollisionError";
  }
}

export function flattenMessages(messages: NestedMessages, prefix = ""): FlatMessages {
  const result: FlatMessages = {};

  for (const [key, value] of Object.entries(messages)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      if (fullKey in result) {
        throw new MessageKeyCollisionError(fullKey);
      }

      result[fullKey] = value;
    } else if (typeof value === "object" && value !== null) {
      const nested = flattenMessages(value as NestedMessages, fullKey);

      for (const nestedKey of Object.keys(nested)) {
        if (nestedKey in result) {
          throw new MessageKeyCollisionError(nestedKey);
        }
      }

      Object.assign(result, nested);
    }
  }

  return result;
}
