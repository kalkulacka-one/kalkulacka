// Ported from kalkulacka-2026/apps/web/lib/share-mode.test.ts
import { describe, expect, it } from "vitest";

import { chooseShareMode } from "./share-mode";

describe("chooseShareMode", () => {
  it("offers the OS sheet on a touch device that can share files", () => {
    expect(chooseShareMode("touch", true)).toBe("sheet");
  });

  it("falls back to copy/download on a touch device that cannot share files", () => {
    expect(chooseShareMode("touch", false)).toBe("desktop");
  });

  it("never offers the sheet on a fine pointer, even when it claims file support", () => {
    // The macOS Safari case: `canShare({ files })` answers true, and its
    // sheet's own "Copy" pastes a temp-file path as text. Pointer kind must
    // win over whatever the capability check says.
    expect(chooseShareMode("mouse", true)).toBe("desktop");
  });

  it("is copy/download on a fine pointer with no file-share support either", () => {
    expect(chooseShareMode("mouse", false)).toBe("desktop");
  });
});
