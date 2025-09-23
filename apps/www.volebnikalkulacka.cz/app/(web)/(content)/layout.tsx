import { Header } from "../../../components/client";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1">
      <Header />
      {children}
    </div>
  );
}
