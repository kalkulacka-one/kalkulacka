import type { Meta, StoryObj } from '@storybook/react';

import { DistrictSelectionForm } from '@repo/design-system/components';
import { ElectionStoreProvider, useElectionStore } from '@repo/design-system/provider';

const initialState = {
  districts: [
    {
      value: '2-jihocesky',
      label: 'Jihočeský kraj',
    },
    {
      value: '10-jihomoravsky',
      label: 'Jihomoravský kraj',
    },
    {
      value: '4-karlovarsky',
      label: 'Karlovarský kraj',
    },
    {
      value: '7-kralovehradecky',
      label: 'Královéhradecký kraj',
    },
    {
      value: '6-liberecky',
      label: 'Liberecký kraj',
    },
    {
      value: '13-moravskoslezsky',
      label: 'Moravskoslezský kraj',
    },
    {
      value: '11-olomoucky',
      label: 'Olomoucký kraj',
    },
    {
      value: '8-pardubicky',
      label: 'Pardubický kraj',
    },
    {
      value: '3-plzensky',
      label: 'Plzeňský kraj',
    },
    {
      value: '1-stredocesky',
      label: 'Středočeský kraj',
    },
    {
      value: '5-ustecky',
      label: 'Ústecký kraj',
    },
    {
      value: '9-vysocina',
      label: 'Vysočina',
    },
    {
      value: '12-zlinsky',
      label: 'Zlínský kraj',
    },
  ],
};

const meta: Meta<typeof DistrictSelectionForm> = {
  title: 'Components/DistrictSelectionForm',
  component: DistrictSelectionForm,
  decorators: [
    (Story) => {
      return (
        <ElectionStoreProvider initialState={initialState}>
          <Story />
        </ElectionStoreProvider>
      );
    },
  ],
};

type DistrictSelectionFormStory = StoryObj<typeof meta>;

export const Default: DistrictSelectionFormStory = {
  render: () => {
    const districts = useElectionStore((state) => state.districts);
    console.log(districts);
    return <DistrictSelectionForm options={districts} />;
  },
};

export default meta;
