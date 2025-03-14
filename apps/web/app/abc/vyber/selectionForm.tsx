import { Button } from "@repo/design-system/ui";
import districts from "./districts.json";
import { useForm } from "react-hook-form";

export default function SelectionForm() {
  const { handleSubmit } = useForm();
  const onSubmit = (data: any) => console.log(data);
  return (
    <div className="grid grid-cols-[1fr] justify-center p-4 min-[701px]:grid-cols-[minmax(24em,max-content)]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          {districts.map((district) => {
            return (
              <label
                key={district.value}
                className="group relative flex cursor-pointer items-center border-b border-neutral px-4 py-3"
              >
                <input
                  name="selection"
                  type="radio"
                  className="peer hidden"
                  value={district.value}
                />
                <span className="relative flex size-6 items-center justify-center rounded-full border-2 border-solid border-neutral-strong group-hover:border-neutral peer-checked:after:absolute peer-checked:after:size-[0.6rem] peer-checked:after:rounded-full peer-checked:after:bg-[#565252] peer-checked:after:content-[''] group-hover:peer-checked:after:bg-[#ADA6A6]"></span>
                <span className="ml-4">
                  <p className="text-neutral">{district.label}</p>
                </span>
              </label>
            );
          })}
        </div>
        <div className="sticky bottom-0 flex w-full justify-center justify-self-center bg-white p-4  sm:bg-transparent">
          <Button
            type="submit"
            kind="filled"
            size="default"
            color="primary"
            fitContent
          >
            Potvrdit a pokračovat
          </Button>
        </div>
      </form>
    </div>
  );
}
