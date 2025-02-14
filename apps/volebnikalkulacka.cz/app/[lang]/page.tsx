import type { Metadata } from "next";
import Newsletter from "./newsletter";

export const metadata: Metadata = {
  title: "Kalkulacka.1",
  description: "Ta pravá volební kalkulačka pro miliony voličů ve 4 zemích",
};

export default function Page(): JSX.Element {
  return <Newsletter />;
}
