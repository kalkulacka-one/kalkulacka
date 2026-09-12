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

  it("treats the theme's own token values as their real utility group", () => {
    expect(twMerge("ko:text-s ko:text-primary")).toBe("ko:text-s ko:text-primary");
    expect(twMerge("ko:drop-shadow-2xl ko:drop-shadow-hard")).toBe("ko:drop-shadow-hard");
    expect(twMerge("ko:font-sans ko:font-display")).toBe("ko:font-display");
  });

  it("ignores classes belonging to another package's prefix", () => {
    expect(twMerge("koa:p-2 koa:p-4")).toBe("koa:p-2 koa:p-4");
  });

  it("builds a merger for another prefix", () => {
    const koa = createTwMerge({ prefix: "koa" });
    expect(koa("koa:p-2 koa:p-4")).toBe("koa:p-4");
    expect(koa("ko:p-2 ko:p-4")).toBe("ko:p-2 ko:p-4");
  });
});
