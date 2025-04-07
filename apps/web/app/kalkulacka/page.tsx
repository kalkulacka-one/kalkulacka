"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioItem } from "@repo/design-system/ui";
import { useForm } from "react-hook-form";
import { Button } from "@repo/design-system/ui";
import { useElectionStore } from "../stores/electionStore";
import DistrictHeader from "./districtHeader";
import { getLabel } from "../utils/getLabel";

export default function Page() {
  const [selected, setSelected] = useState("");
  const router = useRouter();
  const setSelectedDistrict = useElectionStore(
    (state) => state.setSelectedDistrict,
  );

  useEffect(() => {
    setSelectedDistrict("");
  }, []);

  const {
    handleSubmit,
    register,
    formState: { isDirty },
    setValue,
  } = useForm({
    defaultValues: {
      radio: selected,
    },
  });

  function handleRadioChange(value: string) {
    setSelected(value);
    setValue("radio", value, {
      shouldDirty: true,
    });
  }

  const onSubmit = (data: any) => {
    const label = getLabel(data.radio, options);

    setSelectedDistrict(label);
    router.push(`/kalkulacka/${selected}/navod`);
  };

  const options = [
    {
      value: "1-stredocesky",
      label: "Středočeský kraj",
    },
    {
      value: "2-jihocesky",
      label: "Jihočeský kraj",
    },
    {
      value: "3-plzensky",
      label: "Plzeňský kraj",
    },
    {
      value: "4-karlovarsky",
      label: "Karlovarský kraj",
    },
    {
      value: "5-ustecky",
      label: "Ústecký kraj",
    },
    {
      value: "6-liberecky",
      label: "Liberecký kraj",
    },
    {
      value: "7-kralovehradecky",
      label: "Královéhradecký kraj",
    },
    {
      value: "8-pardubicky",
      label: "Pardubický kraj",
    },
    {
      value: "9-vysocina",
      label: "Vysočina",
    },
    {
      value: "10-jihomoravsky",
      label: "Jihomoravský kraj",
    },
    {
      value: "11-olomoucky",
      label: "Olomoucký kraj",
    },
    {
      value: "12-zlinsky",
      label: "Zlínský kraj",
    },
    {
      value: "13-moravskoslezsky",
      label: "Moravskoslezský kraj",
    },
  ];

  return (
    <>
      <DistrictHeader />
      <main className="grid" style={{ gridArea: "main" }}>
        <div className="grid grid-cols-[1fr] justify-center p-4 min-[701px]:grid-cols-[minmax(24em,max-content)]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <RadioGroup
              value={selected}
              {...register("radio")}
              onChange={handleRadioChange}
              aria-label="District selection form"
            >
              {options.map((option) => (
                <RadioItem key={option.value} value={option.value}>
                  {option.label}
                </RadioItem>
              ))}
            </RadioGroup>
            <div className="sticky bottom-0 flex w-full justify-center justify-self-center bg-white p-4  sm:bg-transparent">
              <Button
                type="submit"
                kind="filled"
                size="default"
                color="primary"
                fitContent
                disabled={!isDirty ? true : false}
              >
                Potvrdit a pokračovat
              </Button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
