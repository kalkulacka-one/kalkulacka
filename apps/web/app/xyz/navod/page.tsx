// use middleware for redirection
"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Page() {
  const path = usePathname();
  const router = useRouter();
  console.log(typeof path);
  useEffect(() => {
    console.log("Use effect");
    if (path === "/xyz/navod") {
      router.push("/xyz/navod/1");
    }
  }, []);

  return <h1>Redirect to guide</h1>;
}
