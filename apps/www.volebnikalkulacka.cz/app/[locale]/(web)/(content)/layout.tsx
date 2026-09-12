import { Header } from "@/components/client";
import { Footer } from "@/components/server";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // `scheme-light`: these screens are built in fixed light colours, so they
    // opt out of the dark mode the calculator screens follow — see the
    // matching root rule in `globals.css`.
    <div className="grid grid-cols-1 scheme-light">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
