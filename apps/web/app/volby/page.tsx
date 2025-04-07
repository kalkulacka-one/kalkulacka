"use client";
import { useState } from "react";
import { Field, Label, Radio, RadioGroup } from "@headlessui/react";
import { useElectionStore } from "../stores/electionStore";
import Link from "next/link";
export default function Page() {
  const setSelectedDistrict = useElectionStore(
    (state) => state.setSelectedDistrict,
  );

  const selectedDistrict = useElectionStore((state) => state.selectedDistrict);
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

  const [selected, setSelected] = useState("");

  function handleChange(value: string) {
    setSelected(value);
    setSelectedDistrict(value);
  }

  return (
    <div>
      <h2 className="text-xl font-bold">Zvolte svůj kraj</h2>
      <form>
        <RadioGroup
          value={selected}
          onChange={handleChange}
          aria-label="Zvolte svůj kraj"
        >
          {options.map((option) => (
            <Field key={option.value} className="flex items-center gap-2">
              <Radio
                value={option.value}
                className="group flex size-5 items-center justify-center rounded-full border bg-white data-[checked]:bg-blue-400"
              >
                <span className="invisible size-2 rounded-full bg-white group-data-[checked]:visible" />
              </Radio>
              <Label>{option.label}</Label>
            </Field>
          ))}
        </RadioGroup>
        <Link
          href={`volby/${selected}/navod`}
          className="bg-blue-500 px-4 py-2 text-white"
        >
          Potvrdit a pokračovat
        </Link>
      </form>
      <div className="flex flex-col">
        <span>Form:{selected}</span>
        <span>Zustand {selectedDistrict}</span>
      </div>
    </div>
  );
}
