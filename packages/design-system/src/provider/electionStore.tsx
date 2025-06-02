'use client';

import { type ReactNode, createContext, useContext, useRef } from 'react';
import { type StoreApi, createStore, useStore } from 'zustand';

type ElectionStoreState = {
  districts: any[];
};

type ElectionStoreActions = {
  setDistricts: (district: any[]) => void;
  action: () => void;
};

type ElectionStore = ElectionStoreState & ElectionStoreActions;
const createElectionStore = (initialStateProps?: Partial<ElectionStore>) => {
  // default state naming?
  const DEFAULT_STATE: ElectionStoreState = {
    districts: [],
  };
  return createStore<ElectionStore>()((set) => ({
    ...DEFAULT_STATE,
    ...initialStateProps,
    setDistricts: (districts) => set(() => ({ districts: districts })),
    action: () => {},
  }));
};

export const ElectionStoreContext = createContext<StoreApi<ElectionStore> | undefined>(undefined);

// passing default state ?
export interface ElectionStoreProviderProps {
  children: ReactNode;
  initialState?: Partial<ElectionStore>;
}

export const ElectionStoreProvider = ({ children, initialState }: ElectionStoreProviderProps) => {
  // understand undefined as arg?
  const storeRef = useRef<StoreApi<ElectionStore> | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createElectionStore(initialState);
  }

  return <ElectionStoreContext.Provider value={storeRef.current}>{children}</ElectionStoreContext.Provider>;
};

export function useElectionStore<U>(selector: (state: ElectionStore) => U): U {
  const store = useContext(ElectionStoreContext);
  if (!store) {
    throw new Error('Missing ElectionStoreProvider');
  }
  return useStore(store, selector);
}

export default ElectionStore;
