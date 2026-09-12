import { createSessionImageRoute } from "@kalkulacka-one/next/api/routes/session-image";

export const { GET } = createSessionImageRoute({
  electionName: "Parlamentné voľby 2025",
  appTitle: "Volebná kalkulačka",
  shareHeading: "Takto mi vyšla Volebná kalkulačka",
  shareCta: "Vyplň si ju tiež na volebnakalkulacka.sk",
  fillCta: "Vyplniť kalkulačku",
});
