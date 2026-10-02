import { createSessionImageRoute } from "@kalkulacka-one/next/api/routes/session-image";

export const { GET } = createSessionImageRoute({
  electionName: "Komunální a senátní volby 2026",
  appTitle: "Volební kalkulačka",
  shareHeading: "Takhle mi vyšla Volební kalkulačka",
  shareCta: "Vyplň si ji taky na volebnikalkulacka.cz",
  fillCta: "Vyplnit kalkulačku",
});
