import React from 'react'

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
    <div className="loader mb-4 border-4 border-blue-500 border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
    <p className="text-gray-600 text-sm">Processing your request...</p>
  </div>
  )
}

export default Loading
