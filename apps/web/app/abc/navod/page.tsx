// use middleware for redirection
"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuestionsStore } from "../providers/storeProvider";
export default function Page() {
  const path = usePathname();
  const router = useRouter();
  const guideNumber = useQuestionsStore((state) => state.guideNumber);
  console.log(typeof path);
  useEffect(() => {
    console.log("Use effect");
    if (path === "/abc/navod") {
      router.push(`/abc/navod/${guideNumber}`);
    }
  }, []);

  return <h1>Redirect to guide</h1>;
}
