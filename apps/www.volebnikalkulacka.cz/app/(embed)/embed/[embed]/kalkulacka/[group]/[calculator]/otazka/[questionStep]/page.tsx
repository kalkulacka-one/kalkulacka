"use client";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ questionStep: string }>();
  return <h2>Otázka, questionStep: {params.questionStep}</h2>;
}
