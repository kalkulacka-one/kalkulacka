import fs from "node:fs";
import { z } from "zod";

// Define base schemas that will be reused
const idSchema = z.uuid();
const keySchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);
const versionSchema = z.string().regex(/^\d+\.\d+\.\d+$/);
const createdAtSchema = z.iso.datetime({ offset: true });
const updatedAtSchema = z.iso.datetime({ offset: true });
const publishedAtSchema = z.iso.datetime({ offset: true });
const titleSchema = z.string();
const shortTitleSchema = z.string().max(25);
const descriptionSchema = z.string();
const methodologySchema = z.string();
const introSchema = z.string();

// Register schemas with metadata
z.globalRegistry.add(idSchema, {
  title: "ID",
  description: "Unique identifier of a calculator in the format of UUID",
  examples: ["e2cf4fec-81e0-490c-a056-7f63177dc6a7"],
});

z.globalRegistry.add(keySchema, {
  title: "Key",
  description: "Human-friendly unique key of a standalone calculator in the hyphen-separated lowercased format",
  examples: ["doprava-v-praze"],
});

z.globalRegistry.add(versionSchema, {
  title: "Version",
  description: "Semantic version of the calculator",
  examples: ["1.2.3"],
});

z.globalRegistry.add(createdAtSchema, {
  title: "Created at",
  description: "Time of the creation of a calculator in the ISO 8601 format",
  examples: ["2021-01-01T00:00:00+01:00"],
});

z.globalRegistry.add(updatedAtSchema, {
  title: "Updated at",
  description: "Time of the last update of a calculator in the ISO 8601 format",
  examples: ["2021-01-01T00:00:00+01:00"],
});

z.globalRegistry.add(publishedAtSchema, {
  title: "Published at",
  description: "Time when a calculator should be published in the ISO 8601 format",
  examples: ["2021-01-01T00:00:00+01:00"],
});

z.globalRegistry.add(titleSchema, {
  title: "Title",
  description: "Title of a calculator",
  examples: ["2. kolo prezidentských voleb 2023"],
});

z.globalRegistry.add(shortTitleSchema, {
  title: "shortTitle",
  description: "Short title of a calculator with a maximum of 25 characters",
  examples: ["Prezidentské (2. kolo)"],
});

z.globalRegistry.add(descriptionSchema, {
  title: "Description",
  description: "Description of a calculator",
  examples: ["Volební kalkulačka pro 2. kolo prezidentských voleb 2023"],
});

z.globalRegistry.add(methodologySchema, {
  title: "Methodology",
  description: "Methodology of a calculator",
  examples: ["Pokud kandidát neodpověděl na otázku, jeho odpověď se nezapočítává do výsledku kalkulačky."],
});

z.globalRegistry.add(introSchema, {
  title: "Intro",
  description: "Intro text displayed before starting the calculator",
});

// Reference schemas
const calculatorGroupSchema = z
  .object({
    id: idSchema,
    key: keySchema,
  })
  .strict();

const electionSchema = z
  .object({
    id: idSchema,
    key: keySchema,
  })
  .strict();

const variantSchema = z
  .object({
    key: keySchema,
  })
  .strict();

const districtSchema = z
  .object({
    key: keySchema,
  })
  .strict();

const roundSchema = z
  .object({
    number: z.number(),
  })
  .strict();

// Checksum and changes schemas
const checksumSchema = z
  .object({
    algorithm: z.enum(["sha256"]),
    value: z.string(),
  })
  .strict();

const checksumsSchema = z
  .object({
    questions: checksumSchema,
  })
  .strict();

const changeSchema = z
  .object({
    version: versionSchema,
    updatedAt: updatedAtSchema,
    title: z.string().optional(),
    description: z.string().optional(),
  })
  .strict();

const changesSchema = z.array(changeSchema);

// Register reference schemas
z.globalRegistry.add(calculatorGroupSchema, {
  title: "Calculator group",
  description: "Reference to a calculator group the calculator belongs to",
});

z.globalRegistry.add(electionSchema, {
  title: "Election",
  description: "Reference to an election the calculator belongs to",
});

z.globalRegistry.add(variantSchema, {
  title: "Variant",
  description: "Reference to a variant the calculator belongs to",
});

z.globalRegistry.add(districtSchema, {
  title: "District",
  description: "Reference to a district the calculator belongs to",
});

z.globalRegistry.add(roundSchema, {
  title: "Round",
  description: "Reference to a round the calculator belongs to",
});

z.globalRegistry.add(checksumsSchema, {
  title: "Checksums",
  description: "Checksums for calculator data",
});

z.globalRegistry.add(changesSchema, {
  title: "Changes",
  description: "Changelog of the calculator data",
});

// Common properties shared by all calculator types
const baseCalculatorProperties = {
  id: idSchema,
  version: versionSchema,
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema.optional(),
  publishedAt: publishedAtSchema.optional(),
  title: titleSchema.optional(),
  description: descriptionSchema.optional(),
  methodology: methodologySchema.optional(),
  intro: introSchema.optional(),
  tags: z.unknown().optional(),
  images: z.unknown().optional(),
  checksums: checksumsSchema.optional(),
  changes: changesSchema.optional(),
};

// Create three calculator variants using z.union to match original oneOf structure
const standaloneCalculatorSchema = z
  .object({
    ...baseCalculatorProperties,
    key: keySchema,
    shortTitle: shortTitleSchema,
  })
  .strict()
  .refine((data) => !("calculatorGroup" in data) && !("election" in data), {
    message: "Standalone calculator cannot have calculatorGroup or election",
  });

const groupCalculatorSchema = z
  .object({
    ...baseCalculatorProperties,
    calculatorGroup: calculatorGroupSchema,
    variant: variantSchema,
    shortTitle: shortTitleSchema.optional(),
  })
  .strict()
  .refine((data) => !("election" in data), {
    message: "Group calculator cannot have election",
  });

const electionCalculatorSchema = z
  .object({
    ...baseCalculatorProperties,
    calculatorGroup: calculatorGroupSchema,
    election: electionSchema,
    variant: variantSchema.optional(),
    district: districtSchema.optional(),
    round: roundSchema.optional(),
    shortTitle: shortTitleSchema.optional(),
  })
  .strict()
  .refine((data) => ("variant" in data && data.variant) || ("district" in data && data.district) || ("round" in data && data.round), {
    message: "Election calculator must have at least one of: variant, district, or round",
  });

// Register individual calculator types
z.globalRegistry.add(standaloneCalculatorSchema, {
  title: "Standalone calculator",
  description: "Standalone calculator is a calculator that is not part of a calculator group",
});

z.globalRegistry.add(groupCalculatorSchema, {
  title: "Calculator from a group",
  description: "Calculator that is part of a calculator group",
});

z.globalRegistry.add(electionCalculatorSchema, {
  title: "Calculator from an election",
  description: "Calculator that is part of an election",
});

// Main calculator schema using union (translates to oneOf in JSON Schema)
const calculatorSchema = z.union([standaloneCalculatorSchema, groupCalculatorSchema, electionCalculatorSchema]);

// Register main schema
z.globalRegistry.add(calculatorSchema, {
  title: "Calculator",
  description: "Calculator is a set of questions, candidates and their answers",
  $id: "https://schema.kalkulacka.one/calculator.schema.json",
});

// Generate JSON Schema with proper structure
const jsonData = z.toJSONSchema(calculatorSchema, {
  metadata: z.globalRegistry,
  definitions: true,
  $refStrategy: "relative",
  unionStrategy: "anyOf",
});

// Add the JSON Schema version
jsonData.$schema = "https://json-schema.org/draft/2020-12/schema";

// conversion
fs.writeFile("schemas/calculator.schema.json", JSON.stringify(jsonData, null, 2), "utf8", (err) => {
  if (err) {
    console.error("Error writing file:", err);
    return;
  }
  console.log("File written successfully!");
});
