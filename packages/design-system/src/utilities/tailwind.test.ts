import { describe, expect, it } from "vitest";

import { createTwMerge, twMerge } from "./tailwind";

describe("twMerge", () => {
  it("merges conflicting prefixed classes, keeping the last", () => {
    expect(twMerge("ko:p-2 ko:p-4")).toBe("ko:p-4");
    expect(twMerge("ko:text-sm ko:text-lg")).toBe("ko:text-lg");
    expect(twMerge("ko:bg-red-500 ko:bg-blue-500")).toBe("ko:bg-blue-500");
  });

  it("merges conflicting classes behind a variant", () => {
    expect(twMerge("ko:lg:grid-cols-2 ko:lg:grid-cols-3")).toBe("ko:lg:grid-cols-3");
    expect(twMerge("ko:data-hover:bg-primary ko:data-hover:bg-secondary")).toBe("ko:data-hover:bg-secondary");
  });

  it("keeps classes that do not conflict", () => {
    expect(twMerge("ko:grid ko:items-center ko:gap-2")).toBe("ko:grid ko:items-center ko:gap-2");
    expect(twMerge("ko:col-span-2 ko:col-start-2")).toBe("ko:col-span-2 ko:col-start-2");
  });

  it("leaves a general radius and a single-corner override side by side", () => {
    expect(twMerge("ko:rounded-2xl ko:rounded-br-none")).toBe("ko:rounded-2xl ko:rounded-br-none");
  });

  it("ignores classes belonging to another package's prefix", () => {
    expect(twMerge("koa:p-2 koa:p-4")).toBe("koa:p-2 koa:p-4");
  });

  it("builds a merger for another prefix", () => {
    const koa = createTwMerge("koa");
    expect(koa("koa:p-2 koa:p-4")).toBe("koa:p-4");
    expect(koa("ko:p-2 ko:p-4")).toBe("ko:p-2 ko:p-4");
  });

  it("merges a built-in radius with the card radius token", () => {
    expect(twMerge("ko:rounded-lg ko:rounded-card")).toBe("ko:rounded-card");
    expect(twMerge("ko:rounded-pill ko:rounded-chip")).toBe("ko:rounded-chip");
  });

  it("merges a built-in shadow with an elevation token", () => {
    expect(twMerge("ko:shadow-md ko:shadow-card")).toBe("ko:shadow-card");
    expect(twMerge("ko:shadow-card-next ko:shadow-card-lifted")).toBe("ko:shadow-card-lifted");
  });

  it("merges the drop-shadow token with a built-in drop-shadow", () => {
    expect(twMerge("ko:drop-shadow-md ko:drop-shadow-hard")).toBe("ko:drop-shadow-hard");
  });

  it("merges a built-in font size with a fluid text token", () => {
    expect(twMerge("ko:text-sm ko:text-fluid-question")).toBe("ko:text-fluid-question");
    expect(twMerge("ko:text-fluid-gist ko:text-title")).toBe("ko:text-title");
  });

  it("merges a built-in spacing utility with a fluid spacing token", () => {
    expect(twMerge("ko:p-4 ko:p-fluid-gutter")).toBe("ko:p-fluid-gutter");
    expect(twMerge("ko:h-10 ko:h-fluid-nav")).toBe("ko:h-fluid-nav");
  });

  it("merges a built-in easing function with a motion token", () => {
    expect(twMerge("ko:ease-in ko:ease-spring")).toBe("ko:ease-spring");
    expect(twMerge("ko:ease-spring ko:ease-exit")).toBe("ko:ease-exit");
  });
});
