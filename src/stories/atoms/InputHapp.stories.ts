import type { Meta, StoryObj } from '@storybook/react';
import InputHapp from '@/components/atoms/InputHapp';

const meta = {
  title: 'Components/InputHapp',
  component: InputHapp,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'text' },
    labelName: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    disable: { control: 'boolean' },
    value: { control: 'text' },
    min: { control: 'text' },
    max: { control: 'text' },
    grow: { control: 'boolean' },
    step: { control: 'text' },
  },
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
};

export const WithError: Story = {
  args: {
    labelName: 'Error Input',
    placeholder: 'Enter text...',
    error: 'This field is required',
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

export const DateInput: Story = {
  args: {
    labelName: 'Date Input',
    type: 'datetime-local',
    placeholder: 'Select date and time...',
  },
};

export const WithCustomClassNames: Story = {
  args: {
    labelName: 'Custom Class Input',
    placeholder: 'Custom styles here...',
    className: 'bg-blue-100 p-4 rounded-lg',
    inputClassName: 'border-blue-500 focus:border-blue-700',
  },
};
