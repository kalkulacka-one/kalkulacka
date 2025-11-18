import { Header } from "../../../../components/client";
import { Footer } from "../../../../components/server";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
