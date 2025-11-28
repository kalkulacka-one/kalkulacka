import { type ReactNode, useRef } from "react";
import type { StoreApi } from "zustand";

import { type AnswersStore, AnswersStoreContext, createAnswersStore } from "../../stores";

export type AnswersStoreProviderProps = {
  children: ReactNode;
};

export const AnswersStoreProvider = ({ children }: AnswersStoreProviderProps) => {
  const storeRef = useRef<StoreApi<AnswersStore> | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createAnswersStore();
  }

  return <AnswersStoreContext.Provider value={storeRef.current}>{children}</AnswersStoreContext.Provider>;
};
