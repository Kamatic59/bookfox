/**
 * Sentry Error Tracking Configuration
 * 
 * Captures errors, performance metrics, and user feedback for production monitoring.
 * See: https://docs.sentry.io/platforms/javascript/guides/react/
 */

import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry (call this once at app startup)
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const environment = import.meta.env.VITE_SENTRY_ENV || import.meta.env.MODE;
  
  // Only initialize if DSN is configured
  if (!dsn) {
    console.warn('Sentry DSN not configured - error tracking disabled');
    return;
  }
  
  Sentry.init({
    dsn,
    environment,
    
    // Performance monitoring
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        // Mask all text/input by default for privacy
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    
    // Sample rate for performance monitoring (0.0 - 1.0)
    // Start low in production, increase as needed
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
    
    // Session Replay sample rate
    // Only capture 10% of sessions, 100% of error sessions
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Filter out expected errors
    beforeSend(event, hint) {
      const error = hint.originalException;
      
      // Ignore network errors from ad blockers, extensions, etc.
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return null;
      }
      
      // Ignore Supabase auth session errors (user not logged in)
      if (error?.message?.includes('session_not_found') ||
          error?.message?.includes('Auth session missing')) {
        return null;
      }
      
      return event;
    },
    
    // Add user context automatically
    beforeSendTransaction(transaction) {
      // Filter out long-running transactions (>10s are usually bugs)
      if (transaction.timestamp && transaction.start_timestamp) {
        const duration = transaction.timestamp - transaction.start_timestamp;
        if (duration > 10) {
          console.warn('Long transaction detected:', transaction.name, duration);
        }
      }
      return transaction;
    },
  });
  
  console.log('✅ Sentry initialized:', environment);
}

/**
 * Manually capture an error
 * @param {Error} error - The error to capture
 * @param {object} context - Additional context (tags, user data, etc.)
 */
export function captureError(error, context = {}) {
  Sentry.captureException(error, {
    tags: context.tags || {},
    extra: context.extra || {},
    level: context.level || 'error',
  });
}

/**
 * Set user context (call after login)
 * @param {object} user - User object with id, email, etc.
 */
export function setUser(user) {
  Sentry.setUser(user ? {
    id: user.id,
    email: user.email,
    // Don't send PII like phone numbers
  } : null);
}

/**
 * Add breadcrumb (manual tracking of user actions)
 * @param {string} message - Action description
 * @param {object} data - Additional data
 */
export function addBreadcrumb(message, data = {}) {
  Sentry.addBreadcrumb({
    message,
    level: 'info',
    data,
  });
}

/**
 * Create an error boundary component
 */
export const ErrorBoundary = Sentry.ErrorBoundary;

export default Sentry;
