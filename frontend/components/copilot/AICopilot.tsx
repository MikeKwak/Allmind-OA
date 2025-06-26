'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MessageCircle, X, Send, Bot, User, Loader2, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useWebSocket } from '@/hooks/useWebSocket'

// Configuration constants
const WEBSOCKET_CONFIG = {
  DEFAULT_URL: 'ws://localhost:8080/ws',
  FOCUS_DELAY: 100,
} as const

interface Message {
  type: 'user' | 'ai' | 'system'
  content: string
  timestamp: number
  id: string
}

interface WebSocketMessage {
  type: 'user_message' | 'ai_response' | 'system'
  content: string
  timestamp?: number
}

export default function AICopilot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || WEBSOCKET_CONFIG.DEFAULT_URL
  const { sendMessage, lastMessage, connectionStatus, error } = useWebSocket(wsUrl)

  // Generate unique message ID
  const generateMessageId = useCallback(() => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }, [])

  // Handle hotkey (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(!isOpen)
        if (!isOpen) {
          setTimeout(() => inputRef.current?.focus(), WEBSOCKET_CONFIG.FOCUS_DELAY)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Handle incoming messages
  useEffect(() => {
    if (lastMessage) {
      try {
        const msg: WebSocketMessage = JSON.parse(lastMessage)
        const newMessage: Message = {
          type: msg.type === 'ai_response' ? 'ai' : msg.type === 'system' ? 'system' : 'user',
          content: msg.content,
          timestamp: msg.timestamp || Date.now(),
          id: generateMessageId()
        }
        
        setMessages(prev => [...prev, newMessage])
        
        if (msg.type === 'ai_response') {
          setIsTyping(false)
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }
  }, [lastMessage, generateMessageId])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() || isTyping || connectionStatus !== 'connected') return

    const userMessage: Message = {
      type: 'user',
      content: inputValue,
      timestamp: Date.now(),
      id: generateMessageId()
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)
    
    const wsMessage: WebSocketMessage = {
      type: 'user_message',
      content: inputValue
    }
    
    sendMessage(JSON.stringify(wsMessage))
    setInputValue('')
  }, [inputValue, isTyping, connectionStatus, sendMessage, generateMessageId])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  const isInputDisabled = connectionStatus !== 'connected' || isTyping

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 relative"
        >
          <MessageCircle size={24} />
          <div className="absolute -top-12 -left-20 bg-gray-800 text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Press Ctrl+K to open
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <span className="font-br-sonoma-medium">AI Copilot</span>
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'
          }`} />
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/chat-history"
            className="hover:bg-white/20 p-2 rounded transition-colors"
            title="View Chat History"
          >
            <Clock size={18} />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 p-3">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <Bot size={48} className="mx-auto mb-4 opacity-50" />
            <p className="font-br-sonoma-medium">Welcome to AI Copilot!</p>
            <p className="text-sm mt-2 font-br-sonoma-regular">Ask me anything - I'm here to help.</p>
            <p className="text-xs mt-4 text-gray-400 font-br-sonoma-regular">Use Ctrl+K to toggle this panel</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg flex items-start gap-2 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.type === 'system'
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-gray-50 text-gray-800'
              }`}
            >
              {message.type === 'ai' && <Bot size={16} className="mt-0.5 flex-shrink-0" />}
              {message.type === 'user' && <User size={16} className="mt-0.5 flex-shrink-0" />}
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-50 text-gray-800 max-w-[80%] p-3 rounded-lg flex items-center gap-2">
              <Bot size={16} />
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">AI is typing...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={isInputDisabled}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isInputDisabled}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-lg transition-colors flex items-center justify-center disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {connectionStatus === 'connected' ? 'Connected' : 
           connectionStatus === 'connecting' ? 'Connecting...' : 
           connectionStatus === 'error' ? 'Connection Error' : 'Disconnected'}
        </p>
      </div>
    </div>
  )
} 