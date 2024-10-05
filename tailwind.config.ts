import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: '480px', // 480px x 800px (세로 화면을 감안한 일반적인 스마트폰 사이즈)
      nm: '574px', // 574px x 800px (스마트폰 중 큰 사이즈, 또는 작은 태블릿 사이즈)
      md: '768px', // 768px x 1024px (태블릿 화면 사이즈)
      lg: '960px', // 960px x 1024px (작은 노트북 화면 사이즈)
      lx: '1200px', // lg와 xl의 중간
      xl: '1440px', // 1440px x 900px (큰 데스크탑 화면 사이즈)
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
      fontFamily: {
        // En
        dancing: ['Dancing Script R', 'cursive'],
        'dancing-bold': ['Dancing Script B', 'cursive'],
        'dancing-medium': ['Dancing Script M', 'cursive'],
        'dancing-semi-bold': ['Dancing Script SB', 'cursive'],
        // Kr
        'single-day': ['Single Day', 'cursive'],
        // Jp
        slackside: ['Slackside One', 'cursive'],
        // 통합
        'm-plus': ['M PLUS 1p R', 'sans-serif'],
        'm-plus-blod': ['M PLUS 1p B', 'sans-serif'],
        'm-plus-extra-bold': ['M PLUS 1p EB', 'sans-serif'],
        'm-plus-black': ['M PLUS 1p Black', 'sans-serif'],
        'm-plus-light': ['M PLUS 1p L', 'sans-serif'],
        'm-plus-medium': ['M PLUS 1p M', 'sans-serif'],
        'm-plus-thin': ['M PLUS 1p T', 'sans-serif'],
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
