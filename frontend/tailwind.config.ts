import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#161821',
        surface: '#FAFAF8',
        panel: '#12141C',
        flow: {
          50: '#F1F0FE',
          100: '#E2E0FD',
          400: '#8B8EF5',
          500: '#5B5FEF',
          600: '#4548D6',
          700: '#3436A8',
        },
        amber: {
          400: '#F5A524',
          500: '#E08E0B',
        },
        moss: {
          400: '#3FBF7F',
          500: '#22A566',
        },
        clay: {
          400: '#F0655A',
          500: '#DC4C41',
        },
      },
      fontFamily: {
        // System font stacks are used instead of next/font/google so the app builds reliably
        // in offline/restricted-network environments. Swap in Manrope/Inter via next/font/google
        // once you have normal internet access, if you'd like the exact original look.
        display: ['"Segoe UI"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(22,24,33,0.04), 0 1px 8px rgba(22,24,33,0.06)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
