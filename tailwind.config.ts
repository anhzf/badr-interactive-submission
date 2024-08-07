import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', ...fontFamily.sans],
      },
      colors: {
        primary: {
          bg: '#052A49',
          onBg: '#FFFFFF',
          text: '#002D40',
          bgVariant: '#084577',
        },
        secondary: '#1BA8DF',
        outline: '#828282',
        muted: {
          bg: '#d6dce1',
          text: '#E0E0E0',
        },
      },
    },
  },
  plugins: [],
};
export default config;
