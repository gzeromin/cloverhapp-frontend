import type { Meta, StoryObj } from '@storybook/react';
import SelectHapp from '@/components/molecules/SelectHapp';
import { fn } from '@storybook/test';
import { Locale } from '@/types/User';
import { StampStatus } from '@/types/Stamp';
import { RxLockClosed, RxLockOpen2 } from 'react-icons/rx';
import { GoPeople } from 'react-icons/go';

const meta = {
  title: 'Molecules/SelectHapp',
  component: SelectHapp,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    className: { control: 'text' },
    options: { control: 'object' },
    selected: { control: 'text' },
    dark: { control: 'boolean' },
    border: { control: 'boolean' },
    labelName: { control: 'text' },
    labelClassName: { control: 'text' },
    wide: { control: 'boolean' },
    disable: { control: 'boolean' },
    grow: { control: 'boolean' },
  },
  args: { onSelected: fn() },
} as Meta<typeof SelectHapp>;

export default meta;
type Story = StoryObj<typeof meta>;

const statusOptions = [
  {
    value: StampStatus.PRIVATE,
    labelLevel1: 'StampStatus',
    labelLevel2: StampStatus.PRIVATE,
    icon: <RxLockClosed />,
  },
  {
    value: StampStatus.FRIEND,
    labelLevel1: 'StampStatus',
    labelLevel2: StampStatus.FRIEND,
    icon: <GoPeople />,
  },
  {
    value: StampStatus.PUBLIC,
    labelLevel1: 'StampStatus',
    labelLevel2: StampStatus.PUBLIC,
    icon: <RxLockOpen2 />,
  },
];
const imageOptions = [
  { value: Locale.Kr, image: { src: '/images/flags/south-korea.png' } },
  { value: Locale.En, image: { src: '/images/flags/united-states.png' } },
  { value: Locale.Jp, image: { src: '/images/flags/japan.png' } },
];

export const Default: Story = {
  args: {
    id: 'select-default',
    options: statusOptions,
    selected: StampStatus.PRIVATE,
    className: 'w-[200px]',
    labelName: 'Default Select',
  },
  decorators: [
    (Story) => (
      <div className='w-full h-[100px]'>
        <Story />
      </div>
    ),
  ],
};

export const ImageSelect: Story = {
  args: {
    id: 'select-image',
    options: imageOptions,
    selected: Locale.Kr,
  },
};

export const WithDarkMode: Story = {
  args: {
    id: 'select-dark',
    options: imageOptions,
    selected: Locale.Kr,
    dark: true,
  },
  decorators: [
    (Story) => (
      <div className='bg-gray-800'>
        <Story />
      </div>
    ),
  ],
};

export const WithBorder: Story = {
  args: {
    id: 'select-border',
    options: statusOptions,
    selected: StampStatus.PRIVATE,
    className: 'w-[200px]',
    labelName: 'WithBorder Select',
    border: true,
  },
  decorators: [
    (Story) => (
      <div className='w-full h-[100px]'>
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    id: 'select-disabled',
    options: statusOptions,
    selected: StampStatus.PRIVATE,
    className: 'w-[200px]',
    labelName: 'Disabled Select',
    disable: true,
  },
};
