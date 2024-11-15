import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import TextareaHapp from '@/components/molecules/TextareaHapp';

const meta = {
  title: 'Molecules/TextareaHapp',
  component: TextareaHapp,
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
} as Meta<typeof TextareaHapp>;

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

export const WithCustomClassNames: Story = {
  args: {
    labelName: 'Custom Class Input',
    placeholder: 'Custom styles here...',
    textAreaClassName: 'border-dashed border-2 border-gray-100 min-h-[50px]',
  },
};
