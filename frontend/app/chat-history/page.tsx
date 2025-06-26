'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Clock, MessageSquare, User, Bot, Database, CheckCircle, AlertCircle, RefreshCw, Info } from 'lucide-react'
import Link from 'next/link'
import Container from '../../components/ui/Container'
import { useLoadingState } from '@/hooks/useLoadingState'
import { API_CONFIG, ENV_CONFIG } from '@/config/constants'

interface ChatHistoryItem {
  row_key: string
  user_message: string
  ai_response: string
  timestamp: string
}

interface BigtableStatus {
  available: boolean
  message: string
  rowCount?: number
  lastUpdated?: string
}

export default function ChatHistory() {
  const [history, setHistory] = useState<ChatHistoryItem[]>([])
  const [bigtableStatus, setBigtableStatus] = useState<BigtableStatus>({
    available: false,
    message: 'Checking Bigtable status...'
  })
  const [refreshing, setRefreshing] = useState(false)
  
  const { isLoading, error, startLoading, stopLoading, setError, reset } = useLoadingState(true)

  const fetchHistory = async () => {
    try {
      startLoading()
      const response = await fetch('/api/chat-history')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setHistory(data.data || [])
        
        // Update Bigtable status based on response
        if (data.bigtable_available === false) {
          setBigtableStatus({
            available: false,
            message: data.message || 'Bigtable is not configured for local development. Chat history will not be persisted.',
            rowCount: 0,
            lastUpdated: new Date().toISOString()
          })
        } else {
          setBigtableStatus({
            available: true,
            message: `Successfully connected to Bigtable. Found ${data.data?.length || 0} chat records.`,
            rowCount: data.data?.length || 0,
            lastUpdated: new Date().toISOString()
          })
        }
      } else {
        setError(data.error || 'Failed to fetch chat history')
        setBigtableStatus({
          available: false,
          message: 'Failed to connect to backend server.'
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to server'
      setError(errorMessage)
      setBigtableStatus({
        available: false,
        message: 'Cannot connect to backend server. Please check if the backend is running.'
      })
    } finally {
      stopLoading()
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    reset()
    await fetchHistory()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatRowKey = (rowKey: string) => {
    // Convert UNIX timestamp to readable format
    const timestamp = parseInt(rowKey)
    if (!isNaN(timestamp)) {
      const date = new Date(timestamp / 1000000) // Convert nanoseconds to milliseconds
      return `${rowKey} (${date.toLocaleString()})`
    }
    return rowKey
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Container className="py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-br-sonoma-medium text-gray-900 mb-2">Chat History</h1>
          <p className="text-gray-600 font-br-sonoma-regular">View and manage your conversation history</p>
        </div>

        {/* Bigtable Verification Section */}
        <div className="bg-white rounded-lg shadow-md border mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database size={24} />
                <h2 className="text-xl font-br-sonoma-medium">Bigtable Data Verification</h2>
              </div>
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              {bigtableStatus.available ? (
                <CheckCircle size={20} className="text-green-600 mt-0.5" />
              ) : bigtableStatus.message.includes('not configured') ? (
                <Info size={20} className="text-blue-600 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className="font-br-sonoma-medium text-gray-900 mb-1">
                  Connection Status: {bigtableStatus.available ? 'Connected' : 
                   bigtableStatus.message.includes('not configured') ? 'Bigtable Not Configured (Local Development)' :
                   'Bigtable Connection Issue'}
                </h3>
                <p className="text-gray-600">{bigtableStatus.message}</p>
                {bigtableStatus.rowCount !== undefined && (
                  <p className="text-sm text-gray-500 mt-1">
                    Total records: {bigtableStatus.rowCount} | Last updated: {bigtableStatus.lastUpdated ? new Date(bigtableStatus.lastUpdated).toLocaleString() : 'N/A'}
                  </p>
                )}
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-br-sonoma-medium text-gray-900 mb-2">Technical Details:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Row Key Format:</strong> UNIX timestamp in nanoseconds (e.g., 1703123456789123456)</li>
                <li>• <strong>Column Family:</strong> "chat"</li>
                <li>• <strong>Columns:</strong> user_message, ai_response, timestamp</li>
                <li>• <strong>Storage:</strong> Google Bigtable for persistent chat history</li>
                <li>• <strong>Authentication:</strong> No user auth required - using timestamp-based row keys</li>
                <li>• <strong>Local Development:</strong> Chat history is not persisted without Bigtable credentials</li>
              </ul>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}
        
        {history.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-br-sonoma-medium text-gray-900 mb-2">No chat history found</h3>
            <p className="text-gray-600 font-br-sonoma-regular">Start a conversation to see your chat history here.</p>
            <Link 
              href="/"
              className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Chatting
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div key={item.row_key || index} className="bg-white rounded-lg shadow-md border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">
                    {formatRowKey(item.row_key)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-br-sonoma-medium text-gray-900 mb-1">User Message:</p>
                      <p className="text-gray-700">{item.user_message}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Bot size={16} className="text-green-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-br-sonoma-medium text-gray-900 mb-1">AI Response:</p>
                      <p className="text-gray-700">{item.ai_response}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  )
} 