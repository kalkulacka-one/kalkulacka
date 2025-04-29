import { PillGroupItem } from '@repo/design-system/components';

type PillGroupProps = {
  items: any[];
  togglePill: (tag: string) => void;
  toggleAllPills: () => void;
};
export function PillGroup({ items, togglePill, toggleAllPills }: PillGroupProps) {
  return (
    <div className="ko:flex ko:gap-2">
      <PillGroupItem togglePill={toggleAllPills}>Vybrat vše</PillGroupItem>
      {items.map((item) => (
        <PillGroupItem togglePill={(value) => togglePill(value)} isChecked={item.checked} key={item.value} value={item.value}>
          {item.label}
        </PillGroupItem>
      ))}
    </div>
  );
}
