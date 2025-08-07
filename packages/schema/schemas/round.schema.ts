import { z } from "zod";

export const roundSchema = z.object({
  number: z.number().int().min(0).describe("Round ordinal number from 0"),
  // timePeriod
  //   votingHours: z.array()
});

// {
//   "$schema": "https://json-schema.org/draft/2020-12/schema",
//   "$id": "https://schema.kalkulacka.one/round.schema.json",
//   "title": "Round",
//   "description": "Round of an election",
//   "type": "object",
//   "properties": {
//     "number": {
//       "title": "Number",
//       "description": "Round ordinal number from 0",
//       "type": "integer",
//       "minimum": 0,
//       "examples": [0, 1]
//     },
//     "votingHours": {
//       "title": "Voting hours",
//       "description": "One or multiple voting hours for the round",
//       "type": "array",
//       "minItems": 1,
//       "items": {
//         "$ref": "./time-period.schema.json"
//       }
//     }
//   },
//   "unevaluatedProperties": false,
//   "required": ["number"]
// }
