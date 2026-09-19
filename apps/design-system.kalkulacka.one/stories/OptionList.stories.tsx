import { OptionList } from "@kalkulacka-one/design-system/client";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { useArgs } from "storybook/internal/preview-api";

const meta: Meta<typeof OptionList> = {
  title: "Components/OptionList",
  component: OptionList,
  tags: ["autodocs"],
  args: {
    "aria-label": "Města",
    activeIndex: 0,
  },
};

type OptionListStory = StoryObj<typeof meta>;

export const Default: OptionListStory = {
  render: function Render(args) {
    const [{ activeIndex }, updateArgs] = useArgs();
    const onActiveIndexChange = (index: number) => updateArgs({ activeIndex: index });

    return (
      <OptionList {...args} activeIndex={activeIndex} onActiveIndexChange={onActiveIndexChange} className="ko:grid ko:gap-2.5">
        <OptionList.Row href="#brno" tabIndex={activeIndex === 0 ? 0 : -1}>
          <OptionList.Title>Brno</OptionList.Title>
        </OptionList.Row>
        <OptionList.Row href="#ostrava" tabIndex={activeIndex === 1 ? 0 : -1}>
          <OptionList.Title>Ostrava</OptionList.Title>
        </OptionList.Row>
        <OptionList.Row href="#plzen" tabIndex={activeIndex === 2 ? 0 : -1}>
          <OptionList.Title>Plzeň</OptionList.Title>
        </OptionList.Row>
      </OptionList>
    );
  },
};

export const WithDetails: OptionListStory = {
  args: { "aria-label": "Obvody" },
  render: function Render(args) {
    const [{ activeIndex }, updateArgs] = useArgs();
    const onActiveIndexChange = (index: number) => updateArgs({ activeIndex: index });

    return (
      <OptionList {...args} activeIndex={activeIndex} onActiveIndexChange={onActiveIndexChange} className="ko:grid ko:gap-2.5">
        <OptionList.Row href="#cheb" highlighted={activeIndex === 0} tabIndex={activeIndex === 0 ? 0 : -1}>
          <OptionList.Badge>
            <span className="ko:inline-grid ko:h-7 ko:min-w-7 ko:place-items-center ko:rounded-lg ko:bg-neutral/10 ko:px-1.5 ko:text-sm ko:font-medium ko:tabular-nums">3</span>
          </OptionList.Badge>
          <OptionList.Title>Cheb</OptionList.Title>
          <OptionList.Description>Hazlov</OptionList.Description>
        </OptionList.Row>
        <OptionList.Row href="#strakonice" highlighted={activeIndex === 1} tabIndex={activeIndex === 1 ? 0 : -1}>
          <OptionList.Badge>
            <span className="ko:inline-grid ko:h-7 ko:min-w-7 ko:place-items-center ko:rounded-lg ko:bg-neutral/10 ko:px-1.5 ko:text-sm ko:font-medium ko:tabular-nums">12</span>
          </OptionList.Badge>
          <OptionList.Title>Strakonice</OptionList.Title>
        </OptionList.Row>
        <OptionList.Row disabled>
          <OptionList.Badge>
            <span className="ko:inline-grid ko:h-7 ko:min-w-7 ko:place-items-center ko:rounded-lg ko:bg-neutral/10 ko:px-1.5 ko:text-sm ko:font-medium ko:tabular-nums">48</span>
          </OptionList.Badge>
          <OptionList.Title>Rychnov nad Kněžnou</OptionList.Title>
          <OptionList.Description>Připravujeme</OptionList.Description>
        </OptionList.Row>
      </OptionList>
    );
  },
};

export const AsButtons: OptionListStory = {
  render: function Render(args) {
    const [{ activeIndex }, updateArgs] = useArgs();
    const onActiveIndexChange = (index: number) => updateArgs({ activeIndex: index });

    return (
      <OptionList {...args} activeIndex={activeIndex} onActiveIndexChange={onActiveIndexChange} className="ko:grid ko:gap-2.5">
        <OptionList.Row onClick={() => onActiveIndexChange(0)} tabIndex={activeIndex === 0 ? 0 : -1}>
          <OptionList.Title>Komunální volby</OptionList.Title>
        </OptionList.Row>
        <OptionList.Row onClick={() => onActiveIndexChange(1)} tabIndex={activeIndex === 1 ? 0 : -1}>
          <OptionList.Title>Senátní volby</OptionList.Title>
        </OptionList.Row>
      </OptionList>
    );
  },
};

export default meta;
