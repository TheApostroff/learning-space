// API Configuration Guide
// This file explains how to configure the API client for different environments

export const API_CONFIG = {
  // Environment Variables to set:
  
  // 1. For Mock Data (Development/Testing):
  // NEXT_PUBLIC_USE_MOCK_DATA=true
  // NEXT_PUBLIC_MOCK_DELAY=500 (optional, default: 500ms)
  
  // 2. For Real Server:
  // NEXT_PUBLIC_API_URL=http://your-server.com/api
  // NEXT_PUBLIC_USE_MOCK_DATA=false (or don't set it)
  
  // 3. For Local Development Server:
  // NEXT_PUBLIC_API_URL=http://localhost:3001/api
  // NEXT_PUBLIC_USE_MOCK_DATA=false
  
  // Default behavior:
  // - If NEXT_PUBLIC_API_URL is not set, mock mode is enabled
  // - If NEXT_PUBLIC_API_URL is set, real API mode is enabled (unless USE_MOCK_DATA=true)
  
  // Example .env.local file:
  /*
  # For mock data
  NEXT_PUBLIC_USE_MOCK_DATA=true
  NEXT_PUBLIC_MOCK_DELAY=300
  
  # For real server
  NEXT_PUBLIC_API_URL=http://localhost:3001/api
  NEXT_PUBLIC_USE_MOCK_DATA=false
  */
}

// Helper function to check current configuration
export function getApiConfig() {
  return {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    useMock: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !process.env.NEXT_PUBLIC_API_URL,
    mockDelay: parseInt(process.env.NEXT_PUBLIC_MOCK_DELAY || '500'),
  }
}

// Helper function to log current configuration (useful for debugging)
export function logApiConfig() {
  const config = getApiConfig()
  console.log('API Configuration:', {
    baseUrl: config.baseUrl,
    useMock: config.useMock,
    mockDelay: config.mockDelay,
    environment: process.env.NODE_ENV,
  })
} 