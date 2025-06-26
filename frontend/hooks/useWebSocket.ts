import { useEffect, useRef, useState, useCallback } from 'react'

// Configuration constants
const WEBSOCKET_CONFIG = {
  INITIAL_RECONNECT_DELAY: 1000,
  MAX_RECONNECT_DELAY: 30000,
  MAX_RECONNECT_ATTEMPTS: 10,
  BACKOFF_MULTIPLIER: 2,
} as const

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

interface WebSocketHookReturn {
  sendMessage: (message: string) => void
  lastMessage: string | null
  connectionStatus: ConnectionStatus
  reconnect: () => void
  error: string | null
}

interface WebSocketMessage {
  type: string
  content: string
  timestamp?: number
}

export function useWebSocket(url: string): WebSocketHookReturn {
  const [lastMessage, setLastMessage] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected')
  const [error, setError] = useState<string | null>(null)
  const ws = useRef<WebSocket | null>(null)
  const reconnectAttempts = useRef(0)
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null)
  const isConnecting = useRef(false)

  const log = useCallback((level: 'info' | 'warn' | 'error', message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      const prefix = '[WebSocket]'
      switch (level) {
        case 'info':
          console.log(`${prefix} ${message}`, data || '')
          break
        case 'warn':
          console.warn(`${prefix} ${message}`, data || '')
          break
        case 'error':
          console.error(`${prefix} ${message}`, data || '')
          break
      }
    }
  }, [])

  const calculateReconnectDelay = useCallback(() => {
    const delay = Math.min(
      WEBSOCKET_CONFIG.INITIAL_RECONNECT_DELAY * Math.pow(WEBSOCKET_CONFIG.BACKOFF_MULTIPLIER, reconnectAttempts.current),
      WEBSOCKET_CONFIG.MAX_RECONNECT_DELAY
    )
    return delay
  }, [])

  const connect = useCallback(() => {
    if (isConnecting.current || ws.current?.readyState === WebSocket.OPEN) {
      return
    }

    isConnecting.current = true
    setConnectionStatus('connecting')
    setError(null)

    try {
      ws.current = new WebSocket(url)

      ws.current.onopen = () => {
        log('info', 'Connection established')
        setConnectionStatus('connected')
        setError(null)
        reconnectAttempts.current = 0
        isConnecting.current = false
      }

      ws.current.onmessage = (event) => {
        log('info', 'Message received', { data: event.data })
        setLastMessage(event.data)
      }

      ws.current.onclose = (event) => {
        log('info', 'Connection closed', { code: event.code, reason: event.reason })
        setConnectionStatus('disconnected')
        isConnecting.current = false

        // Only attempt reconnection if it wasn't a manual close
        if (event.code !== 1000 && reconnectAttempts.current < WEBSOCKET_CONFIG.MAX_RECONNECT_ATTEMPTS) {
          const delay = calculateReconnectDelay()
          log('info', `Attempting reconnection in ${delay}ms (attempt ${reconnectAttempts.current + 1}/${WEBSOCKET_CONFIG.MAX_RECONNECT_ATTEMPTS})`)
          
          reconnectTimeout.current = setTimeout(() => {
            reconnectAttempts.current++
            connect()
          }, delay)
        } else if (reconnectAttempts.current >= WEBSOCKET_CONFIG.MAX_RECONNECT_ATTEMPTS) {
          setError('Maximum reconnection attempts reached')
          setConnectionStatus('error')
        }
      }

      ws.current.onerror = (error) => {
        log('error', 'WebSocket error occurred', error)
        setError('Connection error occurred')
        setConnectionStatus('error')
        isConnecting.current = false
      }
    } catch (error) {
      log('error', 'Failed to create WebSocket connection', error)
      setError('Failed to establish connection')
      setConnectionStatus('error')
      isConnecting.current = false
    }
  }, [url, log, calculateReconnectDelay])

  const reconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current)
      reconnectTimeout.current = null
    }
    reconnectAttempts.current = 0
    connect()
  }, [connect])

  const sendMessage = useCallback((message: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      try {
        log('info', 'Sending message', { message })
        ws.current.send(message)
      } catch (error) {
        log('error', 'Failed to send message', error)
        setError('Failed to send message')
      }
    } else {
      const state = ws.current?.readyState
      log('warn', 'Cannot send message, connection is not open', { state })
      setError('Connection not available')
    }
  }, [log])

  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current)
      }
      if (ws.current) {
        ws.current.close(1000, 'Component unmounting')
      }
    }
  }, [connect])

  return { sendMessage, lastMessage, connectionStatus, reconnect, error }
} 