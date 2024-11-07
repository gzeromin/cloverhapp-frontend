import { Meta, StoryObj } from '@storybook/react';
import KeyValueHapp from '@/components/atoms/KeyValueHapp';

const meta: Meta<typeof KeyValueHapp> = {
  title: 'Components/KeyValueHapp',
  component: KeyValueHapp,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'The key value used for displaying specific language text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof KeyValueHapp>;

export const Default: Story = {
  args: {
    value: 'Communication',
  },
};

export const RandomColorPalette: Story = {
  args: {
    value: 'Effectiveness',
  },
  decorators: [
    (KeyValueHapp) => (
      <div className='flex gap-2'>
        <KeyValueHapp />
        <KeyValueHapp />
        <KeyValueHapp />
        <KeyValueHapp />
        <KeyValueHapp />
        <KeyValueHapp />
      </div>
    ),
  ],
};

export const CustomValue: Story = {
  args: {
    value: 'Gratitude',
  },
};
