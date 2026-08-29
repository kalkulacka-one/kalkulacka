import fs from "node:fs";
import { z } from "zod";

// global schemas

const startSchema = z.union([z.iso.date(), z.iso.datetime()]);

const endSchema = z.union([z.iso.date(), z.iso.datetime()]);

z.globalRegistry.add(startSchema, {
  title: "Start time",
  description: "Start date (or time) of a voting period in the ISO 8601 format",
});

z.globalRegistry.add(endSchema, {
  title: "End time",
  description: "End date (or time) of a voting period in the ISO 8601 format",
});

// time-period test schema

const timePeriodSchema = z
  .object({
    start: startSchema,
    end: endSchema,
  })
  .strict();

// Manually register with metadata
z.globalRegistry.add(timePeriodSchema, {
  title: "Time period",
  description: "Time period from–to",
  $id: "https://schema.kalkulacka.one/time-period.schema.json",
});

const jsonData = z.toJSONSchema(timePeriodSchema, {
  metadata: z.globalRegistry,
});

// conversion

fs.writeFile("schemas/time-period.schema.json", JSON.stringify(jsonData, null, 2), "utf8", (err) => {
  if (err) {
    console.error("Error writing file:", err);
    return;
  }
  console.log("File written successfully!");
});
