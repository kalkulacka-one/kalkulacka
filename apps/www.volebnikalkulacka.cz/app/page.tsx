import type { Metadata } from "next";
import SubmissionForm from "./submissionForm";

export const metadata: Metadata = {
  title: "Volební kalkulačka",
  description: "Ta pravá volební kalkulačka pro miliony voličů ve 4 zemích",
};

export default function Page() {
  return (
    <section className="ko:flex ko:flex-col ko:items-center ko:gap-4">
      <h2 className="ko:font-bold ko:text-4xl">Volby 2025: Komu dáte svůj hlas?</h2>
      <p className="ko:text-sm ko:leading-[1.23] ko:text-neutral">Zjistěte, kdo se s vámi shodne na klíčových tématech. Nechte nám tu svůj e-mail a získejte přístup k nové kalkulačce mezi prvními.</p>
      <SubmissionForm />
    </section>
  );
}
