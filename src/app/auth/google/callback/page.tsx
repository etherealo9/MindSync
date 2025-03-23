'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

export default function GoogleAuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing your authentication...')
  
  useEffect(() => {
    // Get code and error from URL
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    
    // Handle error case
    if (error) {
      setStatus('error')
      setMessage(`Authentication error: ${error}`)
      return
    }
    
    // Handle missing code
    if (!code) {
      setStatus('error')
      setMessage('No authentication code received')
      return
    }
    
    // Process the code server-side
    async function processCode() {
      try {
        // The API endpoint will exchange the code for tokens
        // and store them in the database
        const response = await fetch(`/api/auth/google/callback?code=${code}`)
        
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Failed to authenticate')
        }
        
        setStatus('success')
        setMessage('Google Calendar connected successfully!')
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard?calendar_connected=true')
        }, 2000)
      } catch (err) {
        console.error('Authentication error:', err)
        setStatus('error')
        setMessage(`Authentication failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
    
    processCode()
  }, [searchParams, router])
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border-2 border-black dark:border-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold tracking-tighter uppercase text-center">
          Google Calendar Authentication
        </h1>
        
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Icons.spinner className="h-8 w-8 animate-spin" />
            <p className="text-center">{message}</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <Icons.check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <p className="text-center font-medium text-green-600">{message}</p>
            <p className="text-center text-muted-foreground">
              Redirecting you to the dashboard...
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-3">
                <Icons.warning className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <p className="text-center font-medium text-red-600">{message}</p>
            <Button 
              className="w-full" 
              onClick={() => router.push('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 