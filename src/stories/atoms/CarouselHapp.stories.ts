import CarouselHapp from '@/components/atoms/CarouselHapp';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CarouselHapp> = {
  title: 'Components/CarouselHapp',
  component: CarouselHapp,
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'CSS class names for custom styling',
    },
    imageUrls: {
      control: 'object',
      description: 'Array of image URLs to display in the carousel',
    },
    deleteImageUrls: {
      control: { type: 'text' },
      description: 'Function to delete all images',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CarouselHapp>;

export const Default: Story = {
  args: {
    imageUrls: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/200',
      'https://via.placeholder.com/250',
    ],
    deleteImageUrls: () => alert('Delete button clicked'),
  },
};

export const SingleImage: Story = {
  args: {
    imageUrls: ['https://via.placeholder.com/150'],
  },
};

export const MultipleImages: Story = {
  args: {
    imageUrls: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/200',
      'https://via.placeholder.com/250',
      'https://via.placeholder.com/300',
    ],
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'border border-blue-500 p-4',
    imageUrls: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/200',
    ],
  },
};
