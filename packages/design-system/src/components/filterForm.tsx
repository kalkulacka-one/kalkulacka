import { PillGroup } from '@repo/design-system/components';
import { useForm } from 'react-hook-form';

type FilterFormProps = {
  items: any[];
  toggleItem: (tag: string) => void;
  toggleAllItems: () => void;
};

// const { handleSubmit, register } = useForm<FilterFormProps>({});

export function FilterForm({ items, toggleItem, toggleAllItems }: FilterFormProps) {
  return (
    <form>
      <PillGroup items={items} togglePill={(value) => toggleItem(value)} toggleAllPills={toggleAllItems} />
    </form>
  );
}
