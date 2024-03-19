import React from 'react'

const ViewMatric = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 border rounded-lg shadow-md">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap">
          <span className="mr-4">Device: XXRU2</span>
          <span className="mr-4">Water Device</span>
          <span className="mr-4">Client: King Salmon</span>
          <span className="mr-4">Last Online: 14/01/2023 11:13</span>
          <span>Last ticket created: Never</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col">
        <div className="flex mb-4">
          <span className="font-bold mr-2">Scan:</span>
          <span>Online</span>
        </div>
        <div className="flex mb-4">
          <span className="font-bold mr-2">Battery:</span>
          <span>Offline</span>
        </div>
        <div className="flex mb-4">
          <span className="font-bold mr-2">Insitu:</span>
          <span>ERROR</span>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4">
          Create Ticket
        </button>
        <div>No ticket currently active.</div>
      </div>

      {/* Metrics */}
      <div className="font-bold mt-6">Metrics</div>
    </div>
  )
}

export default ViewMatric
