import type { Metadata } from "next";
import Newsletter from "./newsletter";

export const metadata: Metadata = {
  title: "Kalkulatori zgjedhor",
  description: "Kalkulatori zgjedhor është një projekt i organizatës jofitimprurëse KohoVolit.eu, në bashkëpunim me Faktoje, dhe është një ndihmës i paanshëm në vendimin tuaj se kë të votoni.",
};

export default function Page(): JSX.Element {
  return <Newsletter />;
}
