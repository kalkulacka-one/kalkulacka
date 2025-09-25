import { Header } from "../../../components/client";
import { Footer } from "../../../components/server";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] min-h-dvh">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
