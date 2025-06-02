import type { Meta, StoryObj } from '@storybook/react';

import { FilterForm } from '@repo/design-system/components';
import { create } from 'zustand'; // Import create from zustand

const meta: Meta<typeof FilterForm> = {
  title: 'Components/FilterForm',
  component: FilterForm,
  tags: ['autodocs'],
};

type FilterFormStory = StoryObj<typeof meta>;

const useStoryStore = create((set) => ({
  items: [
    { value: 'one', label: 'One', checked: false },
    { value: 'two', label: 'Two', checked: false }, // Example initial state
    { value: 'three', label: 'Three', checked: false },
  ],
  toggleItems: (value) =>
    set((state) => ({
      items: state.items.map((item) => (item.value === value ? { ...item, checked: !item.checked } : item)),
    })),
  toggleAllItems: () =>
    set((state) => ({
      items: state.items.map((item) => ({ ...item, checked: !item.checked })),
    })),
}));

export const Default: FilterFormStory = {
  render: () => {
    const items = useStoryStore((state) => state.items);
    const toggleItem = useStoryStore((state) => state.toggleItems);
    const toggleAllItems = useStoryStore((state) => state.toggleAllItems);

    console.log(items);

    return (
      <div>
        <FilterForm filterItems={items} toggleItem={(value) => toggleItem(value)} toggleAllItems={toggleAllItems} />
      </div>
    );
  },
};

export default meta;
