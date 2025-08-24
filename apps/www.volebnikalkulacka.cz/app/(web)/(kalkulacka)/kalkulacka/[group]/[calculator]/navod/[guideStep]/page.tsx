"use client";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ guideStep: string }>();
  return <h2>Návod, guideStep: {params.guideStep}</h2>;
}
