import type { Metadata } from "next";
import SubmissionForm from "./submissionForm";

export const metadata: Metadata = {
  title: "Volební kalkulačka",
  description: "Nejužitečnějších 5 minut před parlamentními volbami 2025",
};

export default function Page() {
  return (
    <section className="flex flex-col gap-4 items-center">
      <h2>Parlamentní volby 2025</h2>
      <SubmissionForm />
    </section>
  );
}
