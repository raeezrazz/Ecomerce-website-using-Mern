import React from 'react'

export default function Success() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 Registration Successful!</h2>
              <p className="text-gray-700 mb-2">You will be redirected shortly...</p>
              <p className="text-sm text-gray-500">(Modal will close in 3 seconds)</p>
            </div>
  )
}
