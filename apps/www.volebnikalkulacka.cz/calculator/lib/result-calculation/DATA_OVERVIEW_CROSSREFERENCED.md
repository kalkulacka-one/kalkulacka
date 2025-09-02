# Data Overview - Cross-Referenced

This document provides an overview of the data structures, using a single candidate as an example to demonstrate the relationships between the different JSON files.

We will use the candidate with ID `71bc21a9-0a74-4614-a406-05ec6a9b6115` as an example.

## `candidates-answers.json`

This file links candidates to their answers. The key is the candidate's ID.

```json
{
  "71bc21a9-0a74-4614-a406-05ec6a9b6115": [
    {
      "questionId": "5c10c409-b4a0-4cff-88a2-6ed47af067d7",
      "answer": true,
      "respondent": "candidate"
    }
  ]
}
```

-   **`71bc21a9-0a74-4614-a406-05ec6a9b6115`**: This is the ID of our example candidate.
-   **`questionId`**: `5c10c409-b4a0-4cff-88a2-6ed47af067d7` links to a specific question in `questions.json`.

## `questions.json`

This file contains the details of the questions.

```json
[
  {
    "id": "5c10c409-b4a0-4cff-88a2-6ed47af067d7",
    "title": "Novela pandemického zákona",
    "statement": "Hlasovali byste pro prodloužení účinnosti pandemického zákona a rozšíření pravomocí k přijímání proticovidových opatření?",
    "detail": "V roce 2022 Poslanecká sněmovna schvalovala novelu pandemického zákona. Ta prodlužovala platnost zákona do konce listopadu a umožnila úřadům dále nařizovat karantény či izolace i prostřednictvím SMS nebo telefonátu. Novela zároveň dávala rámec pro případná protikoronavirová opatření, například povinnost testování, omezení návštěv či nošení respirátorů.",
    "tags": [
      "COVID-19"
    ]
  }
]
```

-   **`id`**: This matches the `questionId` from `candidates-answers.json`.

## `candidates.json`

This file defines the candidates and their affiliations.

```json
[
  {
    "id": "4bc67746-dc67-4d3e-9685-47567f905554",
    "displayName": "SPOLU - ODS, TOP 09, KDU-ČSL",
    "references": [
      {
        "id": "136c726a-743b-4756-a4df-6662f426065f",
        "type": "organization"
      }
    ],
    "nestedCandidates": [
      {
        "id": "71bc21a9-0a74-4614-a406-05ec6a9b6115",
        "references": [
          {
            "id": "4b2fe93d-ef8d-4326-aa81-330bfcf7269b",
            "type": "person"
          }
        ],
        "displayName": "Marek Benda",
        "number": 1760
      }
    ]
  }
]
```

-   The `nestedCandidates` array contains our candidate with **`id`**: `71bc21a9-0a74-4614-a406-05ec6a9b6115`.
-   This candidate references a person with **`id`**: `4b2fe93d-ef8d-4326-aa81-330bfcf7269b` in `persons.json`.
-   The candidate belongs to the political group with **`id`**: `4bc67746-dc67-4d3e-9685-47567f905554`, which references an organization with **`id`**: `136c726a-743b-4756-a4df-6662f426065f` in `organizations.json`.

## `persons.json`

This file contains personal information about the candidates.

```json
[
  {
    "id": "4b2fe93d-ef8d-4326-aa81-330bfcf7269b",
    "name": "Marek Benda",
    "familyName": "Benda",
    "givenName": "Marek",
    "images": [
      {
        "type": "portrait",
        "urls": {
          "original": "images/avatars/4b2fe93d-ef8d-4326-aa81-330bfcf7269b/i4.jpg"
        }
      }
    ]
  }
]
```

-   **`id`**: This matches the person `id` from `candidates.json`.

## `organizations.json`

This file contains information about the political organizations.

```json
[
  {
    "id":"136c726a-743b-4756-a4df-6662f426065f",
    "name":"SPOLU - ODS, TOP 09, KDU-ČSL",
    "shortName":"SPOLU"
  }
]
```

-   **`id`**: This matches the organization `id` from `candidates.json`.

## `calculator.json`

This file contains general metadata about the calculator and is not directly linked to a specific candidate.
