import { describe, expect, it } from "vitest";

import { flattenMessages, MessageKeyCollisionError } from "./flatten-messages";

describe("flattenMessages", () => {
  it("flattens nested objects with dot notation", () => {
    expect(
      flattenMessages({
        components: {
          button: {
            yes: "Yes",
          },
        },
      }),
    ).toEqual({
      "components.button.yes": "Yes",
    });
  });

  it("handles mixed nesting levels", () => {
    expect(
      flattenMessages({
        title: "Title",
        components: {
          form: {
            submit: "Submit",
          },
        },
      }),
    ).toEqual({
      title: "Title",
      "components.form.submit": "Submit",
    });
  });

  it("handles empty objects", () => {
    expect(flattenMessages({})).toEqual({});

    expect(
      flattenMessages({
        empty: {},
        label: "Label",
      }),
    ).toEqual({
      label: "Label",
    });
  });

  it("throws MessageKeyCollisionError on duplicate keys", () => {
    const messagesWithCollision: Record<string, string | Record<string, string>> = {
      components: {
        button: "Button",
      },
    };
    messagesWithCollision["components.button"] = "Duplicate";

    expect(() => flattenMessages(messagesWithCollision)).toThrow(MessageKeyCollisionError);
  });
});
