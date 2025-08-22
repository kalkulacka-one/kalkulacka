// app/(embed)/embed/[embed]/ClientProvider.tsx
"use client";
import dynamic from "next/dynamic";

const ProviderMap = {
  idnes: dynamic(() => import(/* webpackInclude: /idnes\.client\.tsx$/ */ "./idnes"), { ssr: true }),
  default: dynamic(() => import(/* webpackInclude: /default\.client\.tsx$/ */ "./default"), { ssr: true }),
} as const;

export default function ClientProvider({ name, children }: { name: string; children: React.ReactNode }) {
  const P = (ProviderMap as any)[name] ?? ProviderMap.default;
  return <P>{children}</P>;
}
