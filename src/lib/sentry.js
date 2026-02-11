// Sentry Error Tracking Configuration
import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'development';

/**
 * Initialize Sentry error tracking
 * Only runs in production or when SENTRY_DSN is provided
 */
export function initSentry() {
  // Skip if no DSN provided (development)
  if (!SENTRY_DSN) {
    console.log('Sentry DSN not provided - error tracking disabled');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    
    // Performance Monitoring
    integrations: [
      new Sentry.BrowserTracing({
        // Track route changes
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          window.history,
          location,
          {
            matchPath: (pattern, pathname) => {
              // Match React Router patterns
              return pathname.includes(pattern);
            },
          }
        ),
      }),
      new Sentry.Replay({
        // Session replay for debugging
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Performance traces sample rate (0-1)
    // 1.0 = capture 100% of transactions
    // In production, reduce to 0.1 (10%) to save quota
    tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,

    // Session replay sample rate (0-1)
    // Only capture 10% of normal sessions
    replaysSessionSampleRate: 0.1,
    
    // But capture 100% of sessions with errors
    replaysOnErrorSampleRate: 1.0,

    // Filter out sensitive data
    beforeSend(event, hint) {
      // Don't send errors in development
      if (ENVIRONMENT === 'development') {
        console.error('Sentry would have sent:', event);
        return null;
      }

      // Filter out common browser extensions errors
      if (event.exception) {
        const error = hint.originalException;
        if (error && error.message) {
          // Common extension errors to ignore
          if (
            error.message.includes('chrome-extension://') ||
            error.message.includes('moz-extension://') ||
            error.message.includes('webkit-masked-url://') ||
            error.message.includes('ResizeObserver loop')
          ) {
            return null;
          }
        }
      }

      // Scrub sensitive data from URLs and headers
      if (event.request) {
        // Remove sensitive query params
        if (event.request.url) {
          const url = new URL(event.request.url);
          url.searchParams.delete('token');
          url.searchParams.delete('api_key');
          url.searchParams.delete('password');
          event.request.url = url.toString();
        }

        // Remove authorization headers
        if (event.request.headers) {
          delete event.request.headers['Authorization'];
          delete event.request.headers['X-API-Key'];
        }
      }

      return event;
    },

    // Ignore specific errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      'atomicFindClose',
      
      // Network errors (common, not actionable)
      'Network request failed',
      'NetworkError',
      'Failed to fetch',
      
      // User cancellations
      'AbortError',
      'The user aborted a request',
      
      // Supabase auth errors (handled gracefully in app)
      'Invalid Refresh Token',
      'refresh_token_not_found',
    ],
  });

  console.log('✅ Sentry initialized:', ENVIRONMENT);
}

/**
 * Manually capture an error with context
 * @param {Error} error 
 * @param {Object} context 
 */
export function captureError(error, context = {}) {
  console.error('Error:', error, context);
  
  if (SENTRY_DSN) {
    Sentry.captureException(error, {
      contexts: {
        app: context,
      },
    });
  }
}

/**
 * Set user context for error tracking
 * @param {Object} user 
 */
export function setUser(user) {
  if (!SENTRY_DSN) return;
  
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.user_metadata?.name,
    });
  } else {
    Sentry.setUser(null);
  }
}

/**
 * Add breadcrumb for debugging
 * @param {string} message 
 * @param {Object} data 
 */
export function addBreadcrumb(message, data = {}) {
  if (!SENTRY_DSN) return;
  
  Sentry.addBreadcrumb({
    message,
    data,
    level: 'info',
  });
}

/**
 * Start a performance transaction
 * @param {string} name 
 * @param {string} op 
 * @returns {Object} transaction
 */
export function startTransaction(name, op = 'custom') {
  if (!SENTRY_DSN) return null;
  
  return Sentry.startTransaction({
    name,
    op,
  });
}

// Export Sentry for direct access if needed
export { Sentry };
