import Link from "next/link";

export function Header() {
  return (
    <header className="ko:sticky ko:top-0 ko:z-50 ko:bg-white ko:border-b ko:border-gray-200">
      <div className="ko:container ko:mx-auto ko:px-4 ko:py-4 ko:flex ko:items-center ko:justify-between">
        <div className="ko:flex ko:items-center ko:gap-2">
          <div className="ko:flex ko:gap-1">
            <div className="ko:w-4 ko:h-4 ko:bg-blue-600 ko:rounded" />
            <div className="ko:w-4 ko:h-4 ko:bg-red-500 ko:rounded" />
            <div className="ko:w-4 ko:h-4 ko:bg-red-500 ko:rounded" />
            <div className="ko:w-4 ko:h-4 ko:bg-blue-600 ko:rounded" />
          </div>
          <span className="ko:font-medium ko:text-gray-900">Volební kalkulačka</span>
        </div>
        <nav className="ko:hidden ko:md:flex ko:items-center ko:space-x-8">
          <Link href="#" className="ko:text-blue-600 ko:font-medium">
            Volební kalkulačka
          </Link>
          <Link href="/o-nas" className="ko:text-gray-700 hover:ko:text-blue-600">
            O kalkulačce
          </Link>
          <Link href="#" className="ko:text-gray-700 hover:ko:text-blue-600">
            Pro partnery
          </Link>
          <Link href="#" className="ko:text-blue-600 hover:ko:text-blue-800 ko:font-medium">
            Podpořte nás
          </Link>
        </nav>
      </div>
    </header>
  );
}