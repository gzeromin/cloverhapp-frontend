import type { Meta, StoryObj } from '@storybook/react';
import InputHapp from '@/components/molecules/InputHapp';
import { fn } from '@storybook/test';

const meta = {
  title: 'Molecules/InputHapp',
  component: InputHapp,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    type: { control: 'text' },
    labelName: { control: 'text' },
    labelClassName: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    border: { control: 'boolean' },
    className: { control: 'text' },
    inputClassName: { control: 'text' },
    disable: { control: 'boolean' },
    value: { control: 'text' },
    min: { control: 'text' },
    max: { control: 'text' },
    grow: { control: 'boolean' },
    step: { control: 'text' },
  },
  args: { onChange: fn() },
} as Meta<typeof InputHapp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    labelName: 'Default Input',
    placeholder: 'Enter text...',
    value: '',
    border: true,
    grow: true,
  },
  decorators: [
    (Story) => (
      <div className='w-full'>
        <Story />
      </div>
    ),
  ],
};

export const WithError: Story = {
  args: {
    labelName: 'Error Input',
    placeholder: 'Enter text...',
    error: 'This field is required',
  },
};

export const LabelRow: Story = {
  args: {
    labelName: 'Label Row Input',
    className: 'flex gap-3 items-center',
    placeholder: 'Enter text...',
    value: '',
    border: true,
    grow: true,
  },
};

export const Disabled: Story = {
  args: {
    labelName: 'Disabled Input',
    placeholder: 'Cannot type here...',
    disable: true,
    value: 'Disabled input value',
  },
};

export const NumberInput: Story = {
  args: {
    labelName: 'Number Input',
    type: 'number',
    placeholder: 'Enter a number...',
    min: '1',
    max: '100',
    step: '1',
  },
};
