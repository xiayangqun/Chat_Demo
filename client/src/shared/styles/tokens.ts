/**
 * Design tokens — single source of truth for all visual primitives.
 * Values match frontend_design.md §3 exactly.
 */
export const tokens = {
  color: {
    appBg: '#0C0E13',
    panel: '#1D1C21',
    chatBg: '#26252D',
    activeRow: '#26252D',
    border: '#454350',
    textPrimary: '#FFFFFF',
    textSecondary: '#C9C7D0',
    textMuted: '#7B798F',
    textDim: '#929699',
    accent: '#04B17D',
    accentHover: '#03A070',
    myBubble: '#7DEBF5',
    otherBubble: '#454350',
    unread: '#FD3338',
    inputBg: '#26252D',
    dropdown: '#35333D',
    userStatus: {
      online: '#04B17D',
      away: '#FFA726',
      dnd: '#FD3338',
    },
  },
  font: {
    family: {
      body: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      code: ['"SF Mono"', '"Fira Code"', '"Fira Mono"', 'Menlo', 'monospace'],
    },
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
} as const;

export type Tokens = typeof tokens;
