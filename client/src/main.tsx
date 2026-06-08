import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/* Tailwind directives + design tokens (via @theme) */
import './index.css'
/* App-specific globals (body, #root) */
import './shared/styles/globals.css'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
