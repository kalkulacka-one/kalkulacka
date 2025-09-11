import { Button } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="font-display text-5xl md:text-7xl font-bold text-slate-800 tracking-tight leading-tight">
                Volební kalkulačka je <span className="text-primary">tady!</span>
              </h1>

              <p className="text-base md:text-lg font-light text-slate-500">
                Volby do Poslanecké sněmovny Parlamentu České republiky 2025
                <br />
                3. a 4. října 2025
              </p>

              <div className="space-y-3">
                <p className="text-2xl md:text-3xl font-light text-slate-700 leading-relaxed">
                  Zatím vyzkoušejte <span className="font-bold">inventuru hlasování</span>.
                </p>
                <p className="text-lg md:text-xl font-light text-slate-700 leading-relaxed">
                  Klasickou <span className="font-bold">Volební kalkulačku</span> pro Sněmovní volby 2025 spustíme každou chvíli.
                </p>
              </div>
            </div>
          </div>

          {/* Calculator Cards */}
          <div className="flex justify-center max-w-3xl mx-auto">
            <Link href="/volby/snemovni-2025/inventura" className="group block">
              <Card shadow="hard" corner="topLeft">
                <div className="grid gap-4 p-8">
                  <div className="grid grid-flow-col auto-cols-max gap-2 items-center text-sm">
                    <span className="font-light">Sněmovní volby 2025</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold leading-tight max-w-2xl break-words group-hover:text-primary transition-colors">Inventura hlasování</h3>
                  <p className="text-sm text-gray-900 leading-relaxed sm:text-base max-w-prose break-words">Zjistěte, kdo vás opravdu zastupoval ve sněmovně.</p>
                  <Button variant="fill" color="neutral">
                    Spustit inventuru →
                  </Button>
                </div>
              </Card>
            </Link>
          </div>

          <div className="space-y-4 pt-12">
            <p className="text-lg text-slate-600">
              Sledujte <span className="font-bold">Volební kalkulačku</span> i na{" "}
              <a href="https://www.instagram.com/volebnikalk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Instagramu
              </a>{" "}
              a{" "}
              <a href="https://twitter.com/volebnikalk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                X
              </a>
              !
            </p>
            <div className="flex justify-center gap-8">
              <a
                href="https://x.com/volebnikalk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-4 border-2 border-slate-300 rounded-2xl rounded-br-none text-slate-700 font-semibold tracking-wide hover:bg-slate-100 hover:border-slate-400 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-label="X (Twitter)">
                  <title>X (Twitter)</title>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <div className="flex items-center gap-1">
                  X<span className="text-xs text-slate-500 line-through">(Twitter)</span>
                </div>
              </a>

              <a
                href="https://instagram.com/volebnikalk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-4 border-2 border-slate-300 rounded-2xl rounded-br-none text-slate-700 font-semibold tracking-wide hover:bg-slate-100 hover:border-slate-400 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-label="Instagram">
                  <title>Instagram</title>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.40z" />
                </svg>
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-auto px-6 py-8 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto text-center text-slate-500">
          <p className="text-sm">© 2025 Volební kalkulačka. Všechna práva vyhrazena.</p>
        </div>
      </footer>
    </div>
  );
}
