import { describe, expect, it } from "vitest";

import { checkEmailSyntaxAndTypos, correctTypoDomain, emailDomain, suggestDomain } from "./check-email.ts";

describe("checkEmailSyntaxAndTypos", () => {
  it.each([
    "jana.novakova@seznam.cz",
    "petr@email.cz",
    "petr@post.cz",
    "petr@centrum.cz",
    "x@gmail.com",
    "x@azet.sk",
    "x@proton.me",
    "x@protonmail.ch",
    "x@mail.com",
    "x@ymail.com",
    "x@email.com",
    "x@firma.cz",
    "x@host.cz",
    "x+tag@outlook.cz",
  ])("accepts %s", (email) => {
    expect(checkEmailSyntaxAndTypos(email)).toEqual({ ok: true });
  });

  it.each(["", "no-at-sign", "a@b", "two@@gmail.com", "space in@gmail.com", " lead@gmail.com", "a..b@gmail.com", ".a@gmail.com", "a@-firma.cz", "a@firma..cz"])("rejects syntax of %j", (email) => {
    expect(checkEmailSyntaxAndTypos(email)).toEqual({ ok: false, reason: "syntax" });
  });

  it.each([
    ["a@gmail.cz", "a@gmail.com"],
    ["a@gmail.con", "a@gmail.com"],
    ["a@gmail.cpm", "a@gmail.com"],
    ["a@gmail.co", "a@gmail.com"],
    ["a@gamil.com", "a@gmail.com"],
    ["a@gmai.com", "a@gmail.com"],
    ["a@gmal.com", "a@gmail.com"],
    ["a@gmial.com", "a@gmail.com"],
    ["a@gmaill.com", "a@gmail.com"],
    ["a@gnail.com", "a@gmail.com"],
    ["a@sezam.cz", "a@seznam.cz"],
    ["a@seznma.cz", "a@seznam.cz"],
    ["a@emial.cz", "a@email.cz"],
    ["a@cetrum.cz", "a@centrum.cz"],
    ["a@icloud.con", "a@icloud.com"],
    ["a@protonmail.con", "a@protonmail.com"],
    ["a@hmail.vom", "a@gmail.com"],
    ["a@gmail.comj", "a@gmail.com"],
    ["a@gmail.cu", "a@gmail.com"],
    ["a@seznam.cu", "a@seznam.cz"],
    ["a@seznam.czo", "a@seznam.cz"],
    ["a@sreznam.cz", "a@seznam.cz"],
    ["a@emaoil.cz", "a@email.cz"],
    ["a@centrum.ct", "a@centrum.cz"],
    ["a@icloud.cim", "a@icloud.com"],
    ["a@protonmaill.com", "a@protonmail.com"],
    ["a@volny.vz", "a@volny.cz"],
    ["a@post.cu", "a@post.cz"],
    ["a@outlook.cu", "a@outlook.cz"],
  ])("flags %s from the typo map as a typo of %s", (email, suggestion) => {
    expect(checkEmailSyntaxAndTypos(email)).toEqual({ ok: false, reason: "typo", suggestion });
  });

  it.each([
    ["a@hotmail.con", "a@hotmail.com"],
    ["a@firma.cpm", "a@firma.com"],
    ["a@firma.cu", "a@firma.cz"],
    ["a@outlok.com", "a@outlook.com"],
    ["a@cnetrum.cz", "a@centrum.cz"],
    // Real, deliverable domains the heuristic matches: only a warning, DNS decides.
    ["a@xmail.cz", "a@email.cz"],
    ["a@smail.cz", "a@email.cz"],
    ["a@cloud.com", "a@icloud.com"],
    ["a@volna.cz", "a@volny.cz"],
    ["a@volno.cz", "a@volny.cz"],
  ])("passes %s on to DNS as a suspect of %s", (email, suspect) => {
    expect(checkEmailSyntaxAndTypos(email)).toEqual({ ok: true, suspect });
  });

  it.each(["cmail.cz", "fmail.com", "kcloud.com", "avlas.cz", "iclout.net", "gmail.commusi", "gmail.l.com", "srznsm.cz", "swznqm.cz"])(
    "leaves %s, deliberately not in the typo map, to DNS",
    (domain) => {
      expect(checkEmailSyntaxAndTypos(`a@${domain}`).ok).toBe(true);
      expect(correctTypoDomain(`a@${domain}`)).toBeUndefined();
    },
  );

  it("reports a broken TLD as syntax, still with a suggestion", () => {
    expect(checkEmailSyntaxAndTypos("a@seznam.c")).toEqual({ ok: false, reason: "syntax", suggestion: "a@seznam.cz" });
    expect(checkEmailSyntaxAndTypos("a@centrum.c")).toEqual({ ok: false, reason: "syntax", suggestion: "a@centrum.cz" });
  });

  it("omits a suggestion that would still be invalid", () => {
    expect(checkEmailSyntaxAndTypos("a b@gmail.con")).toEqual({ ok: false, reason: "syntax" });
  });

  it("ignores case and keeps the local part as typed in the suggestion", () => {
    expect(checkEmailSyntaxAndTypos("Jana.Novak@Seznam.CZ")).toEqual({ ok: true });
    expect(checkEmailSyntaxAndTypos("Jana.Novak@GMAIL.CON")).toEqual({ ok: false, reason: "typo", suggestion: "Jana.Novak@gmail.com" });
    expect(checkEmailSyntaxAndTypos("Jana.Novak@Hotmail.CON")).toEqual({ ok: true, suspect: "Jana.Novak@hotmail.com" });
  });

  it("ignores inherited object keys", () => {
    expect(suggestDomain("constructor")).toBeUndefined();
    expect(suggestDomain("firma.constructor")).toBeUndefined();
  });

  it("never treats the big Czech providers as typos of each other", () => {
    for (const domain of ["email.cz", "post.cz", "centrum.cz", "seznam.cz"]) expect(suggestDomain(domain)).toBeUndefined();
  });
});

describe("correctTypoDomain", () => {
  it("replaces only the domain, keeping the local part exactly as typed", () => {
    expect(correctTypoDomain("Jana.Novak+tag@gamil.com")).toBe("Jana.Novak+tag@gmail.com");
    expect(correctTypoDomain("a@b@seznam.cu")).toBe("a@b@seznam.cz");
  });

  it("matches the domain case-insensitively and writes the target in lowercase", () => {
    expect(correctTypoDomain("Petr@SEZNAM.CU")).toBe("Petr@seznam.cz");
  });

  it("returns undefined outside the typo map", () => {
    expect(correctTypoDomain("a@gmail.com")).toBeUndefined();
    expect(correctTypoDomain("a@xmail.cz")).toBeUndefined();
    expect(correctTypoDomain("no-at-sign")).toBeUndefined();
  });
});

describe("emailDomain", () => {
  it("returns the lowercase domain after the last @", () => {
    expect(emailDomain("A@B@Gmail.COM")).toBe("gmail.com");
    expect(emailDomain("nothing")).toBeUndefined();
  });
});
