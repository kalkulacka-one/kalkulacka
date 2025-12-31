import Link from "next/link";

import { Header } from "@/components/client";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <footer className="bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <p className="text-sm text-white">
                  <strong>Volebná kalkulačka</strong> vám pomáha rozhodnúť sa, koho voliť
                </p>
              </div>
              <div />
              <div className="grid grid-flow-row gap-2">
                <Link href="/soukromi" className="text-sm text-slate-400 hover:text-white">
                  Súkromie
                </Link>
              </div>
              <div />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
