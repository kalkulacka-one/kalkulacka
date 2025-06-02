import { create } from 'zustand';

export const useStore = create((set) => ({
  items: [
    { value: 'one', label: 'One', checked: false },
    { value: 'two', label: 'Two', checked: false },
    { value: 'three', label: 'Three', checked: false },
  ],
  toggleItems: (value: string) =>
    set((state) => {
      const updatedItems = state.items.map((item) => {
        if (item.value === value) {
          return { ...item, checked: !item.checked };
        }
        return item;
      });
      return { items: updatedItems };
    }),
}));
