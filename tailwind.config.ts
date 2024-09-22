import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Blue
        secondary: '#10B981', // Emerald
        background: '#F3F4F6', // Light gray
        text: '#1F2937', // Dark gray
      },
    },
  },
  plugins: [],
};

export default config;
