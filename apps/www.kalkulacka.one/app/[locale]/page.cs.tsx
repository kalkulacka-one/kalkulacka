import { Logo } from "@repo/design-system/client";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo title="Volební kalkulačka" text size="medium" />
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-blue-600 font-medium">
              Volební kalkulačka
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600">
              O kalkulačce
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600">
              Pro partnery
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              Podpořte nás
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="mb-8">
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">✕</span>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">✓</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Volby do Poslanecké sněmovny 2025</h1>
          </div>

          {/* Main Calculator Card */}
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg p-8 mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">✓</span>
              </div>
              <span className="text-blue-600 font-medium">Oblíbená kalkulačka</span>
              <span className="text-gray-500">40 otázek</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Která strana se nejvíce shoduje s Vašími názory?</h2>
            <p className="text-gray-600 mb-6">Nejaužitečnějších 5 minut před sněmovními volbami 2025.</p>
            <button className="w-full bg-gray-800 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-gray-900 transition-colors">Spustit kalkulačku</button>
          </div>
        </section>

        {/* Calculator Cards Grid */}
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Inventura hlasování */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">👁</span>
              </div>
              <span className="text-gray-600">Pohled zpátky</span>
              <span className="text-gray-500">40 otázek</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Inventura hlasování</h3>
            <p className="text-gray-600 text-sm mb-6">Ověřte si, jak reprezentovali Vaše názory ve sněmovně poslanci za poslední volební období</p>
            <button className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-2xl hover:border-gray-400 transition-colors">Spustit kalkulačku</button>
          </div>

          {/* Pro mladé lidi */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">👶</span>
              </div>
              <span className="text-yellow-600">Pro mladé lidi</span>
              <span className="text-gray-500">40 otázek</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Témý, které trápí mladé lidi</h3>
            <p className="text-gray-600 text-sm mb-6">Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</p>
            <button className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-2xl hover:border-gray-400 transition-colors">Spustit kalkulačku</button>
          </div>

          {/* Klima */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🌱</span>
              </div>
              <span className="text-green-600">Klima</span>
              <span className="text-gray-500">40 otázek</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Témy ohledně klimatu</h3>
            <p className="text-gray-600 text-sm mb-6">Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</p>
            <button className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-2xl hover:border-gray-400 transition-colors">Spustit kalkulačku</button>
          </div>

          {/* Extrémní kalkulačka */}
          <div className="md:col-span-3 bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">⚡</span>
              </div>
              <span className="text-red-600">Extrémní kalkulačka</span>
              <span className="text-gray-500">10 otázek</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Nemáte čas strácet čas?</h3>
            <p className="text-gray-600 text-sm mb-6">Vyberte jime pro vás 10 nejdůležitejších otázek, které trápí obyčanj Čechy.</p>
            <button className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-2xl hover:border-gray-400 transition-colors">Spustit kalkulačku</button>
          </div>
        </section>

        {/* Jak kalkulačka vzniká */}
        <section className="bg-gray-800 rounded-3xl p-8 mb-12 text-white">
          <h2 className="text-2xl font-bold mb-8 text-center">Jak kalkulačka vzniká?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <p className="text-sm">Připravíme zhruba 40 otázek na aktuální politická témata</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <p className="text-sm">Oslovíme všem kandidáty / vyzveme</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-sm">Dostaneme od každé ty nich odpovědi</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-sm">Volební kalkulačka vám s mini spojen nezávosué shody</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="#" className="text-blue-400 hover:text-blue-300 underline">
              Více o kalkulačce
            </Link>
          </div>
        </section>

        {/* Podpořte tvorbu kalkulaček */}
        <section className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Podpořte tvorbu kalkulaček</h2>
          <p className="text-gray-600 mb-6">
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            <br />
            Lorem ipsum Lorem ipsum Lorem ipsum
          </p>
          <p className="text-gray-600 mb-8">
            Lorem ipsum Lorem ipsum Lorem ipsum
            <br />
            Lorem ipsum Lorem ipsum Lorem ipsum
            <br />
            Lorem ipsum Lorem ipsum Lorem ipsum
            <br />
            Lorem ipsum
          </p>
        </section>

        {/* Chcete kalkulačku na svém médiu */}
        <section className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Chcete kalkulačku na svém médiu?</h2>
          <p className="text-gray-600 mb-6">
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            <br />
            Lorem ipsum Lorem ipsum Lorem ipsum
          </p>
          <p className="text-gray-600 mb-8">
            Lorem ipsum Lorem ipsum Lorem ipsum
            <br />
            Lorem ipsum Lorem ipsum Lorem ipsum
            <br />
            Lorem ipsum Lorem ipsum Lorem ipsum
            <br />
            Lorem ipsum
          </p>
        </section>

        {/* Footer */}
        <footer className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Foooooooter</h2>
          <p className="text-gray-600">
            Lorem ipsum Lorem ipsum Lorem ipsum
            <br />
            Lorem ipsum Lorem ipsum Lorem ipsum
            <br />
            Lorem ipsum
          </p>
        </footer>
      </main>
    </div>
  );
}
