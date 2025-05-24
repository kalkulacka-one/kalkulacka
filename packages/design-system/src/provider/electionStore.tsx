'use client';

import { type ReactNode, createContext, useContext, useRef } from 'react';
import { type StoreApi, createStore, useStore } from 'zustand';

// types test
type District = {
  value: string;
  label: string;
};

type ElectionStore = {
  districts: District[];
  setDistricts: (district: District[]) => void;
};

export const ElectionStoreContext = createContext<StoreApi<ElectionStore> | undefined>(undefined);

// passing default state ?
export interface ElectionStoreProviderProps {
  children: ReactNode;
}

export const ElectionStoreProvider = ({ children }: ElectionStoreProviderProps) => {
  // undefined as arg?
  const storeRef = useRef<StoreApi<ElectionStore> | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createStore<ElectionStore>((set) => ({
      districts: [
        {
          value: '2-jihocesky',
          label: 'Jihočeský kraj',
        },
        {
          value: '10-jihomoravsky',
          label: 'Jihomoravský kraj',
        },
      ],
      setDistricts: (districts) => set(() => ({ districts: districts })),
    }));
  }

  return <ElectionStoreContext.Provider value={storeRef.current}>{children}</ElectionStoreContext.Provider>;
};

// eslint-disable-next-line no-unused-vars
export function useElectionStore<U>(selector: (state: ElectionStore) => U): U {
  const store = useContext(ElectionStoreContext);
  if (!store) {
    throw new Error('Missing ElectionStoreProvider');
  }
  return useStore(store, selector);
}

export default ElectionStore;

// 1. Store location better solution?
// 2. Types
// 3. divide parts of the store
