"use client";

import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-bold">Krajské a senátní volby 2024</h2>
      <div className="flex gap-2">
        <Link
          href="/volby/krajske-2024"
          className="bg-blue-500 px-4 py-2 text-white"
        >
          Vyberte kraj
        </Link>
        <Link
          href="/volby/senatni-2024"
          className="bg-blue-500 px-4 py-2 text-white"
        >
          Vyberte senátní obvod
        </Link>
      </div>
    </div>
  );
}
