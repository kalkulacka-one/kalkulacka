import { createSessionImageRoute } from "@kalkulacka-one/next/api/routes/session-image";

export const { GET } = createSessionImageRoute({
  electionName: "Парламентарни избори 2025",
  appTitle: "Изборен калкулатор",
  shareHeading: "Така ми излезе Изборниот калкулатор",
  shareCta: "Пополни го и ти на izborenkalkulator.mk",
  fillCta: "Пополни калкулатор",
});
