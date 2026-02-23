import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { initSentry } from './lib/sentry'

// Initialize Sentry error tracking
initSentry()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary name="root">
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
