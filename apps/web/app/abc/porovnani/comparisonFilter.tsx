// fix types
type ComparisonFilterProps<
  Tags = (string | undefined)[],
  Organizations = {
    id: string;
    name: string;
    shortName: string;
    sortName: string;
    type: string;
  }[],
> = {
  tags: Tags;
  organizations: Organizations;
};

export default function ComparisonFilter({
  tags,
  organizations,
}: ComparisonFilterProps) {
  return (
    <>
      {/* tags wrapper */}
      <form className="bg-white p-8 pt-0">
        <h3 className="pb-4 text-lg font-bold">Filtrovat podle témat</h3>
        <ul className="flex list-none flex-wrap gap-[calc(1rem/2)]">
          {tags.map((tag) => (
            <li>
              <label className="relative flex cursor-pointer" htmlFor={tag}>
                <input id={tag} type="checkbox" className="peer hidden" />
                <span className="select-none rounded-[1rem] border-[0.0625em] border-black bg-black px-4 py-2 text-xs font-bold uppercase text-white peer-checked:border-neutral peer-checked:bg-neutral peer-checked:text-neutral">
                  {tag}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </form>
      {/* candidates wrapper */}
      <form className="bg-white p-8 pt-0">
        <h3 className="pb-4 text-lg font-bold">
          Filtrovat podle kandidujících
        </h3>
        <ul className="flex list-none flex-wrap gap-[calc(1rem/2)]">
          {organizations.map((organization) => (
            <li>
              <label
                className="relative flex cursor-pointer"
                htmlFor={organization.name}
              >
                <input
                  id={organization.name}
                  type="checkbox"
                  className="peer hidden"
                />
                <span className="select-none rounded-[1rem] border-[0.0625em] border-black bg-black px-4 py-2 text-xs font-bold uppercase text-white peer-checked:border-neutral peer-checked:bg-neutral peer-checked:text-neutral">
                  {organization.name}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </form>
    </>
  );
}

// 1. Vybrat vše button
// 2. Implement filter logic (tied with 1)
