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
          DEFAULT: '#052A49',
          variant: '#084577',
        },
        secondary: {
          DEFAULT: '#1BA8DF',
        },
        error: {
          DEFAULT: '#FF0000',
        },
        background: '#F1F4F6',
        outline: '#828282',
        input: '#E0E0E0',
        on: {
          primary: {
            DEFAULT: '#FFFFFF',
          },
          secondary: {
            DEFAULT: '#FFFFFF',
          },
        },
        muted: {
          DEFAULT: '#d6dce1',
          text: '#828282',
        },
      },
    },
  },
  plugins: [],
};
export default config;
