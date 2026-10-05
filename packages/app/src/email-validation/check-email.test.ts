import { describe, expect, it } from "vitest";

import { checkEmailSyntaxAndTypos, emailDomain, suggestDomain } from "./check-email";

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
    ["a@hotmail.con", "a@hotmail.com"],
    ["a@firma.cpm", "a@firma.com"],
    ["a@seznam.cu", "a@seznam.cz"],
    ["a@outlok.com", "a@outlook.com"],
    ["a@cnetrum.cz", "a@centrum.cz"],
  ])("flags %s as a typo of %s", (email, suggestion) => {
    expect(checkEmailSyntaxAndTypos(email)).toEqual({ ok: false, reason: "typo", suggestion });
  });

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
  });

  it("never treats the big Czech providers as typos of each other", () => {
    for (const domain of ["email.cz", "post.cz", "centrum.cz", "seznam.cz"]) expect(suggestDomain(domain)).toBeUndefined();
  });
});

describe("emailDomain", () => {
  it("returns the lowercase domain after the last @", () => {
    expect(emailDomain("A@B@Gmail.COM")).toBe("gmail.com");
    expect(emailDomain("nothing")).toBeUndefined();
  });
});
