// WebSocket Configuration
export const WEBSOCKET_CONFIG = {
  INITIAL_RECONNECT_DELAY: 1000,
  MAX_RECONNECT_DELAY: 30000,
  MAX_RECONNECT_ATTEMPTS: 10,
  BACKOFF_MULTIPLIER: 2,
  DEFAULT_URL: 'ws://localhost:8080/ws',
  FOCUS_DELAY: 100,
} as const

// API Configuration
export const API_CONFIG = {
  DEFAULT_BACKEND_URL: 'http://localhost:8080',
  CHAT_HISTORY_ENDPOINT: '/api/chat/history',
} as const

// UI Configuration
export const UI_CONFIG = {
  CHAT_WINDOW: {
    WIDTH: '24rem', // w-96
    HEIGHT: '600px',
    POSITION: {
      BOTTOM: '1.5rem', // bottom-6
      RIGHT: '1.5rem', // right-6
    },
  },
  ANIMATION: {
    TRANSITION_DURATION: 200,
    HOVER_SCALE: 1.05,
  },
} as const

// Environment Configuration
export const ENV_CONFIG = {
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  WEBSOCKET_URL: process.env.NEXT_PUBLIC_WS_URL || WEBSOCKET_CONFIG.DEFAULT_URL,
  API_URL: process.env.NEXT_PUBLIC_API_URL || API_CONFIG.DEFAULT_BACKEND_URL,
} as const 