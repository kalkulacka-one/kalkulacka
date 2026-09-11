#!/usr/bin/env python3

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def clean(value: str | None) -> str:
    if value is None:
        return ""
    return value.replace("\ufeff", "").strip()


def dump_json(data: Any) -> str:
    return json.dumps(data, ensure_ascii=False, indent=2) + "\n"


def build_logo_images(logo_path: str) -> list[dict[str, Any]] | None:
    if not logo_path:
        return None

    return [{"type": "logo", "urls": {"original": logo_path}}]


def parse_parties(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as file:
        rows = [row for row in csv.reader(file) if row]

    if not rows:
        raise ValueError(f"Parties CSV is empty: {path}")

    table: dict[str, list[str]] = {}
    for row in rows:
        key = clean(row[0])
        values = [clean(cell) for cell in row[1:]]
        table[key] = values

    ids = table.get("id", [])
    codes = table.get("code", [])
    names = table.get("name", [])
    logos = table.get("logo", [])

    if not ids or not codes or not names:
        raise ValueError("Parties CSV must contain rows: id, code, name")
    if not (len(ids) == len(codes) == len(names)):
        raise ValueError(
            "Rows id/code/name in parties CSV must have the same number of columns"
        )

    parties: list[dict[str, str]] = []
    for index in range(len(ids)):
        logo = logos[index] if index < len(logos) else ""
        parties.append(
            {
                "id": ids[index],
                "code": codes[index],
                "name": names[index],
                "logo": logo,
            }
        )
    return parties


def parse_answer(value: str) -> bool | None:
    normalized = clean(value).lower()
    normalized = " ".join(normalized.split())

    if normalized in {"", "-"}:
        return None
    if normalized in {"igen"}:
        return True
    if normalized in {"nem"}:
        return False
    if normalized in {
        "nem tudja/nem válaszol",
        "nem tudja / nem válaszol",
        "nem tudom/nem válaszol",
        "nem tudom / nem válaszol",
        "nem tudja",
        "nem tudom",
    }:
        return None

    return None


def extract_sources(text: str) -> tuple[str, list[dict[str, str]]]:
    """Extract trailing markdown links from text.

    Returns the remaining comment text and a list of source dicts.
    """
    pattern = re.compile(r"\[([^\]]+)\]\((https?://[^)]+)\)")
    sources: list[dict[str, str]] = []
    matches = list(pattern.finditer(text))

    if not matches:
        return text, []

    # Find the contiguous block of markdown links at the end of the text.
    # Walk backwards from the end to find where the trailing links start.
    trailing_start = len(text)
    for match in reversed(matches):
        # Check that only whitespace/newlines exist between this match's end
        # and the previous trailing_start
        between = text[match.end() : trailing_start]
        if between.strip() == "":
            trailing_start = match.start()
        else:
            break

    for match in matches:
        if match.start() >= trailing_start:
            sources.append({"url": match.group(2), "title": match.group(1)})

    comment = text[:trailing_start].strip()
    return comment, sources


def find_comment_column(fieldnames: list[str], code: str) -> str | None:
    code_lower = code.lower()
    for field in fieldnames:
        normalized = clean(field).lower()
        if normalized.startswith(code_lower) and "megjegyz" in normalized:
            return field
    return None


def parse_questions_and_answers(
    path: Path, parties: list[dict[str, str]]
) -> tuple[list[dict[str, Any]], dict[str, list[dict[str, Any]]]]:
    with path.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        if reader.fieldnames is None:
            raise ValueError(f"Questions CSV has no header: {path}")

        fieldnames = list(reader.fieldnames)

        # Detect if this is the English CSV (angol.csv) by checking for 'Topic' and 'Question' columns
        is_english = "Topic" in fieldnames and "Question" in fieldnames

        # Map columns depending on language
        if is_english:
            col_id = "Id"
            col_broad_topic = "Topic"
            col_statement = "Question"
            col_detail = "Explanation"
        else:
            col_id = "Id"
            col_broad_topic = "Átfogó téma"
            col_statement = "Kérdés"
            col_detail = "Kifejtés"

        # Build party code to comment column mapping (works for both languages)
        comment_columns = {
            party["code"]: find_comment_column(fieldnames, party["code"])
            for party in parties
        }
        answers_map: dict[str, list[dict[str, Any]]] = {
            party["id"]: [] for party in parties
        }
        questions: list[dict[str, Any]] = []

        for row in reader:
            question_id = clean(row.get(col_id))
            if not question_id:
                continue

            broad_topic = clean(row.get(col_broad_topic))
            statement = clean(row.get(col_statement))
            detail = clean(row.get(col_detail))

            title = broad_topic or statement
            tags = [topic for topic in [broad_topic] if topic]
            unique_tags = list(dict.fromkeys(tags))

            question: dict[str, Any] = {
                "id": question_id,
                "title": title,
                "statement": statement,
            }
            if detail:
                question["detail"] = detail
            if unique_tags:
                question["tags"] = unique_tags

            questions.append(question)

            for party in parties:
                code = party["code"]
                candidate_id = party["id"]
                answer_value = parse_answer(clean(row.get(code)))

                answer_entry: dict[str, Any] = {
                    "questionId": question_id,
                    "answer": answer_value,
                }

                comment_column = comment_columns.get(code)
                if comment_column:
                    raw_comment = clean(row.get(comment_column))
                    if raw_comment:
                        comment, sources = extract_sources(raw_comment)
                        if comment:
                            answer_entry["comment"] = comment
                        if sources:
                            answer_entry["sources"] = sources

                answers_map[candidate_id].append(answer_entry)

    if not questions:
        raise ValueError(f"No questions found in: {path}")

    return questions, answers_map


def build_organizations(parties: list[dict[str, str]]) -> list[dict[str, Any]]:
    organizations: list[dict[str, Any]] = []
    for party in parties:
        organization: dict[str, Any] = {
            "id": party["id"],
            "name": party["name"],
            "abbreviation": party["code"],
        }
        images = build_logo_images(party.get("logo", ""))
        if images:
            organization["images"] = images
        organizations.append(organization)
    return organizations


def build_candidates(parties: list[dict[str, str]]) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    for index, party in enumerate(parties, start=1):
        candidate: dict[str, Any] = {
            "id": party["id"],
            "references": [{"id": party["id"], "type": "organization"}],
            "displayName": party["code"],
            "number": index,
        }
        images = build_logo_images(party.get("logo", ""))
        if images:
            candidate["images"] = images
        candidates.append(candidate)
    return candidates


def compute_sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def build_calculator(
    args: argparse.Namespace, questions_json_text: str
) -> dict[str, Any]:
    created_at = (
        args.created_at or datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    )
    calculator_id = str(
        uuid.uuid5(
            uuid.NAMESPACE_URL, f"voksmonitor.hu/calculator/{args.calculator_key}"
        )
    )

    calculator: dict[str, Any] = {
        "id": calculator_id,
        "key": args.calculator_key,
        "version": "1.0.0",
        "createdAt": created_at,
        "title": args.title,
        "shortTitle": args.short_title,
        "description": args.description,
        "intro": args.intro,
        "checksums": {
            "questions": {
                "algorithm": "sha256",
                "value": compute_sha256(questions_json_text),
            }
        },
    }
    return calculator


def write_file(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate calculator data JSON files from CSV inputs"
    )
    parser.add_argument(
        "--input-csv",
        type=Path,
        default=Path("adatok_szoftverbe.csv"),
        help="Path to adatok_szoftverbe.csv",
    )
    parser.add_argument(
        "--parties-csv",
        type=Path,
        default=Path("parties.csv"),
        help="Path to parties.csv",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("2026-ogy/inventory"),
        help="Directory for generated JSON files",
    )
    parser.add_argument(
        "--calculator-key",
        default="voksmonitor-2026",
        help="Calculator key (standalone schema)",
    )
    parser.add_argument(
        "--title",
        default="Országgyűlési választások 2026 Voksmonitor",
        help="Calculator title",
    )
    parser.add_argument(
        "--short-title",
        default="Voksmonitor 2026",
        help="Calculator short title (max 25 chars)",
    )
    parser.add_argument(
        "--description",
        default="Voksmonitor 2026 - pártok álláspontjainak összehasonlítása.",
        help="Calculator description",
    )
    parser.add_argument(
        "--intro",
        default="Válaszolj a kérdésekre, és nézd meg, melyik párt áll legközelebb hozzád.",
        help="Calculator intro text",
    )
    parser.add_argument(
        "--created-at", default=None, help="CreatedAt timestamp in ISO 8601 with offset"
    )
    args = parser.parse_args()

    parties = parse_parties(args.parties_csv)
    questions, candidates_answers = parse_questions_and_answers(args.input_csv, parties)
    organizations = build_organizations(parties)
    candidates = build_candidates(parties)
    persons: list[dict[str, Any]] = []

    questions_text = dump_json(questions)
    calculator = build_calculator(args, questions_text)

    output_dir = args.output_dir
    write_file(output_dir / "calculator.json", dump_json(calculator))
    write_file(output_dir / "questions.json", questions_text)
    write_file(output_dir / "organizations.json", dump_json(organizations))
    write_file(output_dir / "candidates.json", dump_json(candidates))
    write_file(output_dir / "candidates-answers.json", dump_json(candidates_answers))
    write_file(output_dir / "persons.json", dump_json(persons))

    print(f"Generated files in {output_dir.resolve()}")
    print(f"Questions: {len(questions)}")
    print(f"Candidates/Organizations: {len(parties)}")


if __name__ == "__main__":
    main()
