import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG, ENV_CONFIG } from '@/config/constants'

interface ChatHistoryResponse {
  success: boolean
  data?: any[]
  error?: string
  bigtable_available?: boolean
  message?: string
}

export async function GET(request: NextRequest): Promise<NextResponse<ChatHistoryResponse>> {
  try {
    const response = await fetch(`${ENV_CONFIG.API_URL}${API_CONFIG.CHAT_HISTORY_ENDPOINT}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout for better error handling
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      const errorMessage = `Backend responded with status: ${response.status}`
      if (ENV_CONFIG.IS_DEVELOPMENT) {
        console.error('API Error:', errorMessage)
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage,
          bigtable_available: false,
          message: 'Failed to connect to backend server'
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    if (ENV_CONFIG.IS_DEVELOPMENT) {
      console.error('Error fetching chat history:', error)
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch chat history',
        details: errorMessage,
        bigtable_available: false,
        message: 'Cannot connect to backend server. Please check if the backend is running.'
      },
      { status: 500 }
    )
  }
} 