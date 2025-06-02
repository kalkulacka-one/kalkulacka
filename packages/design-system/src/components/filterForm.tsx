import { Fieldset, Form, Legend, PillGroup, PillGroupItem } from "@repo/design-system/components";

type FilterFormProps = {
  filterItems: any[];
  toggleItem: (tag: string | undefined) => void;
  toggleAllItems: () => void;
};

// const { handleSubmit, register } = useForm<FilterFormProps>({});

export function FilterForm({ filterItems, toggleItem, toggleAllItems }: FilterFormProps) {
  return (
    <Form aria-labelledby="filter form">
      <Fieldset>
        <Legend>Filtrujte podle...</Legend>
        <PillGroup>
          <PillGroupItem value="selectall" togglePill={toggleAllItems}>
            Vybrat vše
          </PillGroupItem>
          {filterItems.map((item) => (
            <PillGroupItem isChecked={item.checked} key={item.value} value={item.value} togglePill={(value) => toggleItem(value)}>
              {item.label}
            </PillGroupItem>
          ))}
        </PillGroup>
      </Fieldset>
    </Form>
  );
}

// 1. ul / li ???
// 2. any[] fix
