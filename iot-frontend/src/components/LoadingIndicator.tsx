import React from 'react'

function LoadingIndicator({ size = 50, color = 'blue', message = 'Loading...' }) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div role="status">
        <svg
          aria-hidden="true"
          className={`w-${size} h-${size} text-gray-200 animate-spin dark:text-gray-600 fill-${color}-600`}
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 0C78.2051 0 100 21.7949 100 50C100 78.2051 78.2051 100 50 100C21.7949 100 0 78.2051 0 50C0 21.7949 21.7949 0 50 0ZM50 9.62791C27.2383 9.62791 9.62791 27.2383 9.62791 50C9.62791 72.7617 27.2383 90.3721 50 90.3721C72.7617 90.3721 90.3721 72.7617 90.3721 50C90.3721 27.2383 72.7617 9.62791 50 9.62791Z"
            fill="currentColor"
          />
          <path
            d="M50 20.4167C53.171 20.4167 55.625 22.8707 55.625 26.0417C55.625 29.2127 53.171 31.6667 50 31.6667C46.829 31.6667 44.375 29.2127 44.375 26.0417C44.375 22.8707 46.829 20.4167 50 20.4167ZM50 41.6667C57.3385 41.6667 62.5 46.8285 62.5 54.1675C62.5 61.5065 57.3385 66.6667 50 66.6667C42.6615 66.6667 37.5 61.5065 37.5 54.1675C37.5 46.8285 42.6615 41.6667 50 41.6667Z"
            fill="currentFill"
          />
        </svg>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default LoadingIndicator
