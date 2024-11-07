import { Meta, StoryObj } from '@storybook/react';
import FileUploadHapp from '@/components/atoms/FileUploadHapp';

const meta: Meta<typeof FileUploadHapp> = {
  title: 'Components/FileUploadHapp',
  component: FileUploadHapp,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: 'number',
      defaultValue: 300,
      description: 'Container width in pixels',
    },
    height: {
      control: 'number',
      defaultValue: 240,
      description: 'Container height in pixels',
    },
    textColor: {
      control: 'text',
      defaultValue: 'text-gray-500',
      description: 'Color of the placeholder text',
    },
    textSize: {
      control: 'text',
      defaultValue: 'text-sm',
      description: 'Font size of the placeholder text',
    },
    className: {
      control: 'text',
      description: 'Custom CSS classes for the component container',
    },
    imageUrls: {
      control: 'object',
      description: 'Array of URLs to display images in a carousel',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FileUploadHapp>;

export const Default: Story = {
  args: {
    width: 300,
    height: 240,
    textColor: 'text-gray-500',
    textSize: 'text-sm',
    className: '',
    imageUrls: [],
  },
};

export const WithImageUrls: Story = {
  args: {
    ...Default.args,
    imageUrls: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/200',
      'https://via.placeholder.com/250',
    ],
  },
};
