import { describe, expect, it } from "vitest";

import { twMerge } from "./tailwind";

describe("twMerge", () => {
  it("merges the app package's own koa: classes", () => {
    expect(twMerge("koa:p-2 koa:p-4")).toBe("koa:p-4");
    expect(twMerge("koa:grid-rows-[3rem] koa:grid-rows-[3rem_auto]")).toBe("koa:grid-rows-[3rem_auto]");
  });

  it("leaves the design system's ko: classes alone", () => {
    expect(twMerge("ko:p-2 ko:p-4")).toBe("ko:p-2 ko:p-4");
  });

  it("keeps classes that do not conflict", () => {
    expect(twMerge("koa:fixed koa:bottom-0 koa:left-0 koa:right-0")).toBe("koa:fixed koa:bottom-0 koa:left-0 koa:right-0");
  });
});
