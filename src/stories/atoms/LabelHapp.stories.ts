import LabelHapp from '@/components/atoms/LabelHapp';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Atoms/LabelHapp',
  component: LabelHapp,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    htmlFor: { control: 'text', description: 'label의 for 속성' },
    children: { control: 'text', description: 'label의 내용' },
  },
} satisfies Meta<typeof LabelHapp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    htmlFor: 'login-email',
    children: '이메일',
  },
};