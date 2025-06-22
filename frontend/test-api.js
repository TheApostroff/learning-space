// Test script to verify API configuration
// Run this in your browser console or create a test component

import { api, apiConfig } from '@/lib/api'

// Test 1: Check configuration
console.log('API Configuration:', apiConfig)
// Should show: { baseUrl: "http://localhost:3001/api", useMock: true, mockDelay: 500 }

// Test 2: Test API call
async function testApi() {
  console.log('Testing API call...')
  
  const response = await api.getCourses()
  
  console.log('Response:', response)
  // Should show: { success: true, data: [...courses], message: "Courses retrieved successfully" }
  
  if (response.success) {
    console.log('✅ API working with mock data!')
    console.log('Number of courses:', response.data.length)
  } else {
    console.log('❌ API error:', response.error)
  }
}

// Run the test
testApi() 