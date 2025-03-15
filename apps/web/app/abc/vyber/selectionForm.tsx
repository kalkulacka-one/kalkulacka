import { Button } from "@repo/design-system/ui";
import districts from "./districts.json";
import { useForm } from "react-hook-form";
import { Field, Label, Radio, RadioGroup } from "@headlessui/react";
import { useState } from "react";

export default function SelectionForm() {
  const [selected, setSelected] = useState("");
  const {
    handleSubmit,
    register,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      radio: "",
    },
  });
  const onSubmit = (data: any) => console.log(data);

  console.log(selected);
  console.log(`Dirty state: ${isDirty}`);

  return (
    <div className="grid grid-cols-[1fr] justify-center p-4 min-[701px]:grid-cols-[minmax(24em,max-content)]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioGroup
          value={selected}
          onChange={setSelected}
          // dynamic here !!
          aria-label="Zvolte svůj kraj"
        >
          {districts.map((district) => (
            <Field key={district.value} {...register("radio")}>
              {/* blue focus fix! */}
              <Label className="group relative flex cursor-pointer items-center border-b border-neutral px-4 py-3">
                <Radio
                  value={district.value}
                  className="!focus:outline-none group flex size-6 items-center justify-center rounded-full border-2 border-neutral-strong bg-white"
                >
                  <span className="invisible size-[0.6rem] rounded-full bg-[#565252] group-hover:bg-[#ADA6A6] group-data-[checked]:visible" />
                </Radio>
                <span className="ml-4 text-neutral">{district.label}</span>
              </Label>
            </Field>
          ))}
        </RadioGroup>
        <div className="sticky bottom-0 flex w-full justify-center justify-self-center bg-white p-4  sm:bg-transparent">
          <Button
            type="submit"
            kind="filled"
            size="default"
            color="primary"
            fitContent
            disabled={!selected ? true : false}
          >
            Potvrdit a pokračovat
          </Button>
        </div>
      </form>
    </div>
  );
}
