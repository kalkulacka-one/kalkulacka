import type { Meta, StoryObj } from "@storybook/react";

import { Description as DescriptionH, Field as FieldH, Input as InputH, Label as LabelH } from "@headlessui/react";
import { Description, Field, Icon, Input, Label } from "@repo/design-system/client";
import { EnvelopeIcon } from "@repo/design-system/icons";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
};

type InputStory = StoryObj<typeof meta>;

export const Default: InputStory = {
  args: {
    placeholder: "Input placeholder",
  },
};

export const WithIcon: InputStory = {
  render: () => {
    const hasError = true;
    return (
      <form>
        <Field style={{ position: "relative" }}>
          <Label style={{ display: "none" }}>Input label</Label>
          <Input placeholder="Input placeholder">
            <Icon size="medium" decorative icon={EnvelopeIcon} />
          </Input>
          {hasError && (
            <Description
              style={{
                position: "absolute",
                bottom: "-0.385rem",
                right: "1rem",
                paddingLeft: "0.25rem",
                paddingRight: "0.25rem",
                backgroundColor: "#ffffff",
                fontSize: "0.75rem",
                lineHeight: "1rem",
                color: "#ef4444",
              }}
            >
              Input error
            </Description>
          )}
        </Field>
      </form>
    );
  },
};

export const HeadlessInputTest: InputStory = {
  render: () => (
    <form>
      <FieldH>
        <LabelH>Input label</LabelH>
        <InputH />
        <DescriptionH>Field description</DescriptionH>
      </FieldH>
    </form>
  ),
};

export default meta;
