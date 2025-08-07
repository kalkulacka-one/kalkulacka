import { z } from "zod";

// quick qorkaround, will accept invalid date,
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const dateTimeSchema = z.string().datetime();

export const timePeriodSchema = z.object({});

// {
//   "$schema": "https://json-schema.org/draft/2020-12/schema",
//   "$id": "https://schema.kalkulacka.one/time-period.schema.json",
//   "title": "Time period",
//   "description": "Time period from–to",
//   "type": "object",
//   "properties": {
//     "start": {
//       "title": "Start time",
//       "description": "Start date (or time) of a voting period in the ISO 8601 format",
//       "oneOf": [
//         {
//           "type": "string",
//           "format": "date",
//           "examples": ["2023-01-13"]
//         },
//         {
//           "type": "string",
//           "format": "date-time",
//           "examples": ["2023-01-13T14:00:00+01:00"]
//         }
//       ]
//     },
//     "end": {
//       "title": "End time",
//       "description": "End date (or time) of a voting period in the ISO 8601 format",
//       "oneOf": [
//         {
//           "type": "string",
//           "format": "date",
//           "examples": ["2023-01-13"]
//         },
//         {
//           "type": "string",
//           "format": "date-time",
//           "examples": ["2023-01-13T14:00:00+01:00"]
//         }
//       ]
//     }
//   },
//   "unevaluatedProperties": false,
//   "required": ["start", "end"]
// }
