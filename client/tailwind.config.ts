import type { Config } from 'tailwindcss';

/**
 * Tailwind CSS configuration.
 *
 * NOTE: Tailwind v4 (the installed version) favours CSS-first configuration
 * via the @theme block in src/index.css. This file is kept for:
 *   1. Explicit content-path declaration.
 *   2. A typed JS-side canonical reference that mirrors the CSS @theme.
 *   3. Future migration ease.
 *
 * The @tailwindcss/vite plugin reads this file automatically.
 * When a token exists in both sources, the CSS @theme takes precedence in v4.
 */
const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'app-bg': '#0C0E13',
        'panel': '#1D1C21',
        'chat-bg': '#26252D',
        'active-row': '#26252D',
        'border': '#454350',
        'text-primary': '#FFFFFF',
        'text-secondary': '#C9C7D0',
        'text-muted': '#7B798F',
        'text-dim': '#929699',
        'accent': '#04B17D',
        'accent-hover': '#03A070',
        'my-bubble': '#7DEBF5',
        'other-bubble': '#454350',
        'unread': '#FD3338',
        'input-bg': '#26252D',
        'dropdown': '#35333D',
        'user-status': {
          online: '#04B17D',
          away: '#FFA726',
          dnd: '#FD3338',
        },
      },
      fontFamily: {
        body: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        code: ['"SF Mono"', '"Fira Code"', '"Fira Mono"', 'Menlo', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
