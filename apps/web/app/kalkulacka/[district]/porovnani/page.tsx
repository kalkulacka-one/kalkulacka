export default function Page() {
  return (
    <form className="bg-white p-8 pt-0">
      <h3 className="pb-4 text-lg font-bold">Filtrovat podle témat</h3>
      <ul className="flex list-none flex-wrap gap-[calc(1rem/2)]">
        <li>
          <label className="relative flex cursor-pointer" htmlFor="label1">
            <input id="label1" type="checkbox" className="peer hidden" />
            <span className="select-none rounded-[1rem] border-[0.0625em] border-black bg-black px-4 py-2 text-xs font-bold uppercase text-white peer-checked:border-neutral peer-checked:bg-neutral peer-checked:text-neutral">
              Label 1
            </span>
          </label>
        </li>
        <li>
          <label className="relative flex cursor-pointer" htmlFor="label2">
            <input id="label2" type="checkbox" className="peer hidden" />
            <span className="select-none rounded-[1rem] border-[0.0625em] border-black bg-black px-4 py-2 text-xs font-bold uppercase text-white peer-checked:border-neutral peer-checked:bg-neutral peer-checked:text-neutral">
              Label 2
            </span>
          </label>
        </li>
      </ul>
    </form>
  );
}
