import { useState, useCallback } from 'react'

interface LoadingState {
  isLoading: boolean
  error: string | null
  startLoading: () => void
  stopLoading: () => void
  setError: (error: string | null) => void
  reset: () => void
}

export function useLoadingState(initialLoading = false): LoadingState {
  const [isLoading, setIsLoading] = useState(initialLoading)
  const [error, setErrorState] = useState<string | null>(null)

  const startLoading = useCallback(() => {
    setIsLoading(true)
    setErrorState(null)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  const setError = useCallback((error: string | null) => {
    setErrorState(error)
    setIsLoading(false)
  }, [])

  const reset = useCallback(() => {
    setIsLoading(false)
    setErrorState(null)
  }, [])

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setError,
    reset
  }
} 