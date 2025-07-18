import { Button, Switch } from "@headlessui/react";
import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Volební kalkulačka",
//   description: "Nejužitečnějších 5 minut před parlamentními volbami 2025",
// };

export default function Page() {
  return (
    <section>
      <h2>Parlamentní volby 2025</h2>
      <Switch as={Button}>Ano</Switch>
    </section>
  );
}
