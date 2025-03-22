"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, createStore, useStore } from "zustand";

// divide store, to the external file ?
type ElectionStore = {
  // questions: ExtendedQuestions[];
  // krajske-2024, senatni-2024, etc...
  selectedElectionType: string;
  selectedDistrict: string;
  electionIntro: any;

  // // electionStore actions
  // eslint-disable-next-line no-unused-vars
  setSelectedElectionType: (electionType: string) => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedDistrict: (district: any) => void;
  setElectionIntro: (electionIntro: any) => void;
  // fetchers
  fetchCalculator: (district: any) => Promise<void>;
};

export const ElectionStoreContext = createContext<
  StoreApi<ElectionStore> | undefined
>(undefined);

// update to props with children, assign questions differently?
export interface ElectionStoreProviderProps {
  children: ReactNode;
  //   questions: ExtendedQuestions[];
}

export const ElectionStoreProvider = ({
  children,
}: ElectionStoreProviderProps) => {
  const storeRef = useRef<StoreApi<ElectionStore> | undefined>();
  if (!storeRef.current) {
    storeRef.current = createStore<ElectionStore>((set) => ({
      selectedElectionType: "",
      electionIntro: "",
      selectedDistrict: "testSelectedDistrict",
      // setters
      setSelectedDistrict: (district) =>
        set(() => ({ selectedDistrict: district })),
      setSelectedElectionType: (electionType) =>
        set(() => ({ selectedElectionType: electionType })),
      setElectionIntro: (electionIntro) =>
        set(() => ({ electionIntro: electionIntro })),
      // fetchers
      fetchCalculator: async (district) => {
        const res = await fetch(
          `/data/instance/volebnikalkulacka.cz/krajske-2024/${district}/calculator.json`,
        );
        const data = await res.json();
        return data;
      },
    }));
  }

  return (
    <ElectionStoreContext.Provider value={storeRef.current}>
      {children}
    </ElectionStoreContext.Provider>
  );
};

// eslint-disable-next-line no-unused-vars
export function useElectionStore<U>(selector: (state: ElectionStore) => U): U {
  const store = useContext(ElectionStoreContext);
  if (!store) {
    throw new Error("Missing ElectionStoreProvider");
  }
  return useStore(store, selector);
}

export default ElectionStore;
