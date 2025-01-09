"use client";
import { useEffect } from "react";
import { useCounterStore } from "../providers/counterStoreProvider";

type Props = {
  children: React.ReactNode;
};

export default function UrlUpdater({ children }: Props) {
  const count = useCounterStore((state) => state.count);

  useEffect(() => {
    function changeTitle() {
      document.title = `Hello World: ${count}`;
    }
    changeTitle();
  }, [count]);
  return children;
}
