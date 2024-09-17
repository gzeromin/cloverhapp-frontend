import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: '480px',
      nm: '574px',
      md: '768px',
      lg: '960px',
      xl: '1440px',
    },
    extend: {
      colors: {
        // Happy Stamp Color
        primary: '#ec5990',
        'primary-hover': '#ffd1e3a6',
        'primary-100': '#ffd1e3',
        'gray-hover': '#f3f4f6a6',
        'focus-color': '#bf1650',
        'happ-focus': '#f6acc8',
        secondary: '#28a745',
        success: '#198754',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#0dcaf0',
        input: '#ff00ff',
        cancel: '#6c757d',
        'primary-dark1': '#ec597b',
        'primary-dark2': '#e72b71',
        'light-color': '#f8f9fa',
        'light-focus': '#e2e6ea',
        'tool-btn': '#d9d9d9',
        saturday: '#1e96b4',
        'light-black': '#0000002d',
        // Text & Icon Color
        'primary-text': '#0f1553',
        'secondary-text': '#565a6f',
        'disabled-primary-text': '#868998',
        'disabled-secondary-text': '#aaacb6',
        'white-transparent': '#ffffff8c',
        'gray-transparent': '#ffffffbf',
        'light-gray': '#dee2e6',
        // Background Color
        'primary-surface': '#fff',
        'secondary-surface': '#f2f3f4',
        'tertiary-surface': '#e6e7ea',
        // Border Color
        'border-color': '#f0f0f0',
        'border-color-light': '#ececec',
        'border-color-light-focus': '#dae0e5',
        // Link Color
        'link-color': '#093475',
        'link-hover': '#3374da',
        'link-visited': '#f7f7f8',
        droplet: '#03f8fc',
      },
      fontWeight: {
        'semi-bold': '700',
      },
      maxWidth: {
        'contents-screen': '1080px',
      },
      maxHeight: {
        '4/5': 'calc(100vh * 0.8)',
      },
    },
  },
  plugins: [require('./src/utils/patterns.util')],
};

export default config;
