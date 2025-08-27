import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Volební kalkulačka",
  description: "Nejužitečnějších 5 minut před parlamentními volbami 2025",
};

export default function Page() {
  throw new Error("This is a test error");

  return (
    <section>
      <h2>Parlamentní volby 2025</h2>
    </section>
  );
}
