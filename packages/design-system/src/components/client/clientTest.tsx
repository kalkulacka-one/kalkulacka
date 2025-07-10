import { useEffect } from "react";

export function ClientTest() {
  useEffect(() => {
    console.log("ClientTest component mounted");
  }, []);

  return null;
}
