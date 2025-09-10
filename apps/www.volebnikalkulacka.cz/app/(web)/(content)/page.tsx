import Link from "next/link";

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="ko:font-display text-4xl font-bold text-gray-900 mb-8">
        Volby do Poslanecké sněmovny 2025
      </h1>
      
      {/* Main Calculator Card - left aligned */}
      <div className="max-w-md bg-white rounded-2xl p-6 mb-8 shadow-sm border">
        <div className="mb-4">
          <span className="text-blue-600 font-medium">Oblíbená kalkulačka</span>
          <span className="text-gray-500 ml-4">40 otázek</span>
        </div>
        <h2 className="ko:font-display text-xl font-bold text-gray-900 mb-3">
          Která strana se nejvíce zhoduje s Vašimi názory?
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Nejužitečnějších 5 minut před sněmovními volbami 2025.
        </p>
        <button className="w-full bg-gray-900 text-white font-semibold py-3 rounded-lg">
          Spustit kalkulačku
        </button>
      </div>

      {/* Calculator Cards Grid - 3 columns, left aligned */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border">
          <div className="mb-3">
            <span className="text-gray-600 text-sm">👁 Pohled zpátky</span>
            <span className="text-gray-500 text-sm ml-4">40 otázek</span>
          </div>
          <h3 className="ko:font-display font-bold text-gray-900 mb-2">Inventura hlasování</h3>
          <p className="text-gray-600 text-sm mb-4">
            Ověřte si, jak reprezentovali Vaše názory ve sněmovně poslanci za poslední volební období
          </p>
          <Link 
            href="/snemovni-2025/inventura" 
            className="block w-full text-center border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:border-gray-400 transition-colors"
          >
            Spustit kalkulačku
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border">
          <div className="mb-3">
            <span className="text-yellow-600 text-sm">👶 Pro mladé lidi</span>
            <span className="text-gray-500 text-sm ml-4">40 otázek</span>
          </div>
          <h3 className="ko:font-display font-bold text-gray-900 mb-2">Témata, které trápí mladé lidi</h3>
          <p className="text-gray-600 text-sm mb-4">Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</p>
          <button className="w-full border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:border-gray-400 transition-colors">
            Spustit kalkulačku
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border">
          <div className="mb-3">
            <span className="text-green-600 text-sm">✅ Klima</span>
            <span className="text-gray-500 text-sm ml-4">40 otázek</span>
          </div>
          <h3 className="ko:font-display font-bold text-gray-900 mb-2">Témata ohledně klimatu</h3>
          <p className="text-gray-600 text-sm mb-4">Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</p>
          <button className="w-full border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:border-gray-400 transition-colors">
            Spustit kalkulačku
          </button>
        </div>
      </div>
    </div>
  );
}