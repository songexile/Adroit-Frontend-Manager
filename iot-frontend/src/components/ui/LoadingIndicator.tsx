import React from 'react';

function LoadingIndicator() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <div role="status" className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-spin h-40 w-40"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
        <h1 className="text-center">Loading...</h1>
      </div>
    </>
  );
}

export default LoadingIndicator;
