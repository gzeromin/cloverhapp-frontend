import MiniCalendarHapp from '@/components/atoms/MiniCalendarHapp';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof MiniCalendarHapp> = {
  title: 'Components/MiniCalendar',
  component: MiniCalendarHapp,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Custom CSS class for styling',
    },
    startTime: {
      control: 'date',
      description: 'The initial start date for the calendar',
    },
    setStartTime: {
      action: 'setStartTime',
      description: 'Function to update the start date',
    },
  },
};

export default meta;

export const Default: StoryObj<typeof MiniCalendarHapp> = {
  args: {
    className: 'custom-calendar-class',
    startTime: new Date(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '200px', height: '200px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};